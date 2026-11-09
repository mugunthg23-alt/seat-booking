import { useState, useEffect, useCallback, useMemo } from 'react';
import { CityId, Movie, Show, SeatInfo, Booking, User, ScreenConfig } from '../types';
import { CITIES, MOVIES, THEATERS, getSeededBookedSeatIds, STANDARD_SCREENS, FNB_ITEMS } from '../data/seedData';
import { calculateSeatCoordinates } from '../utils/geometry';

const DEMO_USER: User = {
  id: 'usr-demo-01',
  name: 'Kavitha Raman',
  email: 'demo@seatview.app',
  phone: '+91 98765 43210',
};

const STORAGE_KEYS = {
  USER: 'seatview_user',
  CITY: 'seatview_city',
  BOOKINGS: 'seatview_bookings',
  HOLDS: 'seatview_global_holds',
};

// Global cross-tab channel
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('seatview_realtime_channel');
  }
} catch {
  // Graceful fallback
}

interface HoldRecord {
  showId: string;
  seatId: string;
  heldByUserId: string;
  expiresAt: number;
}

export function useSeatViewStore() {
  // 1. User session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // 2. City
  const [selectedCityId, setSelectedCityId] = useState<CityId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CITY);
      return (saved as CityId) || 'chennai';
    } catch {
      return 'chennai';
    }
  });

  // 3. Navigation / Selection State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  // 4. Seats & 3D
  const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([]);
  const [activePreviewSeatId, setActivePreviewSeatId] = useState<string | null>(null);
  const [isOverviewMode, setIsOverviewMode] = useState<boolean>(false);
  const [seatLimitWarning, setSeatLimitWarning] = useState<string | null>(null);

  // 5. Food & Beverages Cart
  const [fnbCart, setFnbCart] = useState<Record<string, number>>({});

  const updateFnbQuantity = useCallback((itemId: string, quantity: number) => {
    setFnbCart((prev) => {
      const copy = { ...prev };
      if (quantity <= 0) {
        delete copy[itemId];
      } else {
        copy[itemId] = quantity;
      }
      return copy;
    });
  }, []);

  const clearFnbCart = useCallback(() => {
    setFnbCart({});
  }, []);

  // 6. Global Holds & Bookings
  const [activeHolds, setActiveHolds] = useState<HoldRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOLDS);
      if (saved) {
        const parsed: HoldRecord[] = JSON.parse(saved);
        const now = Date.now();
        return parsed.filter((h) => h.expiresAt > now);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Hold Timer (8 minutes = 480 seconds)
  const [holdSecondsLeft, setHoldSecondsLeft] = useState<number>(480);
  const [holdTimerActive, setHoldTimerActive] = useState<boolean>(false);
  const [holdExpiredNotice, setHoldExpiredNotice] = useState<boolean>(false);

  // Sync city to storage
  const setCity = useCallback((cityId: CityId) => {
    setSelectedCityId(cityId);
    try {
      localStorage.setItem(STORAGE_KEYS.CITY, cityId);
    } catch {}
  }, []);

  // Sync user to storage
  const loginUser = useCallback((user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {}
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
  }, []);

  // Save active holds to storage and broadcast
  const updateHolds = useCallback((updater: (prev: HoldRecord[]) => HoldRecord[], notify: boolean = true) => {
    setActiveHolds((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEYS.HOLDS, JSON.stringify(next));
      } catch {}
      if (notify && broadcastChannel) {
        broadcastChannel.postMessage({ type: 'SYNC_HOLDS', holds: next });
      }
      return next;
    });
  }, []);

  // Listen to broadcast events from other tabs
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SYNC_HOLDS') {
        setActiveHolds(e.data.holds || []);
      } else if (e.data?.type === 'SEAT_BOOKED') {
        // Someone booked seats, reload bookings if any
        try {
          const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
          if (saved) setBookings(JSON.parse(saved));
        } catch {}
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel?.removeEventListener('message', handleMessage);
    };
  }, []);

  // Hold Timer tick
  useEffect(() => {
    if (!holdTimerActive || selectedSeats.length === 0) return;

    const interval = setInterval(() => {
      setHoldSecondsLeft((prev) => {
        if (prev <= 1) {
          // Timer expired! Release holds and clear seats
          if (selectedShow && currentUser) {
            updateHolds((holds) =>
              holds.filter(
                (h) => !(h.showId === selectedShow.id && h.heldByUserId === currentUser.id)
              )
            );
          }
          setSelectedSeats([]);
          setActivePreviewSeatId(null);
          setHoldTimerActive(false);
          setHoldExpiredNotice(true);
          return 480;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [holdTimerActive, selectedSeats.length, selectedShow, currentUser, updateHolds]);

  // Current screen configuration for selected show
  const currentScreenConfig: ScreenConfig | undefined = useMemo(() => {
    if (!selectedShow) return undefined;
    const theater = THEATERS.find((t) => t.id === selectedShow.theaterId);
    return theater?.screens.find((s) => s.id === selectedShow.screenId) || STANDARD_SCREENS[0];
  }, [selectedShow]);

  // Booked seat IDs for the selected show
  const bookedSeatIds = useMemo(() => {
    if (!selectedShow || !currentScreenConfig) return new Set<string>();

    // 1. Seeded pre-booked seats
    const seeded = getSeededBookedSeatIds(selectedShow.id, currentScreenConfig.layout);

    // 2. Completed bookings from all users
    const bookedFromDb: string[] = [];
    bookings.forEach((b) => {
      if (b.showId === selectedShow.id) {
        b.seats.forEach((s) => bookedFromDb.push(s.id));
      }
    });

    return new Set([...seeded, ...bookedFromDb]);
  }, [selectedShow, currentScreenConfig, bookings]);

  // Currently held seats by others for this show
  const heldByOthersSeatIds = useMemo(() => {
    if (!selectedShow || !currentUser) return new Set<string>();
    const now = Date.now();
    const held = activeHolds
      .filter((h) => h.showId === selectedShow.id && h.heldByUserId !== currentUser.id && h.expiresAt > now)
      .map((h) => h.seatId);
    return new Set(held);
  }, [selectedShow, currentUser, activeHolds]);

  // Toggle seat selection
  const toggleSeatSelection = useCallback(
    (row: string, num: number) => {
      if (!selectedShow || !currentScreenConfig || !currentUser) return;

      const seatId = `${row}-${num}`;
      const layout = currentScreenConfig.layout;
      const tier = layout.tierMap[row] || 'Gold';
      const price = selectedShow.basePriceConfig[tier] || 250;

      // Check if already booked
      if (bookedSeatIds.has(seatId)) return;

      // Check if held by someone else
      if (heldByOthersSeatIds.has(seatId)) {
        setSeatLimitWarning('This seat is currently held by another moviegoer.');
        setTimeout(() => setSeatLimitWarning(null), 3500);
        return;
      }

      const existingIndex = selectedSeats.findIndex((s) => s.id === seatId);

      if (existingIndex >= 0) {
        // Deselect
        const next = selectedSeats.filter((s) => s.id !== seatId);
        setSelectedSeats(next);

        // Remove from active holds
        updateHolds((holds) =>
          holds.filter((h) => !(h.showId === selectedShow.id && h.seatId === seatId))
        );

        if (next.length === 0) {
          setActivePreviewSeatId(null);
          setHoldTimerActive(false);
          setHoldSecondsLeft(480);
        } else if (activePreviewSeatId === seatId) {
          setActivePreviewSeatId(next[next.length - 1].id);
        }
      } else {
        // Select (limit to max 8 seats)
        if (selectedSeats.length >= 8) {
          setSeatLimitWarning('Maximum 8 seats per booking allowed.');
          setTimeout(() => setSeatLimitWarning(null), 3500);
          return;
        }

        const seat = calculateSeatCoordinates(row, num, layout, tier, price);
        const next = [...selectedSeats, seat];
        setSelectedSeats(next);
        setActivePreviewSeatId(seat.id);
        setIsOverviewMode(false); // Return to seat POV immediately on pick

        // Add hold record
        const expiresAt = Date.now() + 8 * 60 * 1000;
        updateHolds((holds) => [
          ...holds.filter((h) => !(h.showId === selectedShow.id && h.seatId === seatId)),
          {
            showId: selectedShow.id,
            seatId,
            heldByUserId: currentUser.id,
            expiresAt,
          },
        ]);

        if (!holdTimerActive) {
          setHoldTimerActive(true);
          setHoldSecondsLeft(480);
        }
      }
    },
    [
      selectedShow,
      currentScreenConfig,
      currentUser,
      bookedSeatIds,
      heldByOthersSeatIds,
      selectedSeats,
      activePreviewSeatId,
      holdTimerActive,
      updateHolds,
    ]
  );

  // Price calculations
  const priceSummary = useMemo(() => {
    const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 35 : 0; // ₹35 per ticket
    const fnbSubtotal = Object.entries(fnbCart).reduce((sum, [id, qty]) => {
      const item = FNB_ITEMS.find((f) => f.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
    const taxes = Math.round((subtotal + convenienceFee) * 0.18); // 18% GST
    const total = subtotal + convenienceFee + taxes + fnbSubtotal;

    return {
      subtotal,
      convenienceFee,
      fnbSubtotal,
      taxes,
      total,
      count: selectedSeats.length,
    };
  }, [selectedSeats, fnbCart]);

  // Confirm booking
  const confirmBooking = useCallback(
    (mockPaymentMethod: string): Booking | null => {
      if (!selectedShow || !selectedMovie || !currentScreenConfig || !currentUser || selectedSeats.length === 0) {
        return null;
      }

      const theater = THEATERS.find((t) => t.id === selectedShow.theaterId);
      const bookingId = `SV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking: Booking = {
        id: bookingId,
        userId: currentUser.id,
        showId: selectedShow.id,
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        theaterName: theater?.name || 'Grand Cinema',
        screenName: currentScreenConfig.name,
        city: selectedCityId.toUpperCase(),
        showDate: selectedShow.dateStr,
        showTime: selectedShow.timeStr,
        format: selectedShow.format,
        seats: selectedSeats.map((s) => ({
          id: s.id,
          row: s.row,
          number: s.number,
          tier: s.tier,
          price: s.price,
        })),
        subtotal: priceSummary.subtotal,
        convenienceFee: priceSummary.convenienceFee,
        taxes: priceSummary.taxes,
        total: priceSummary.total,
        fnbItems: Object.entries(fnbCart)
          .map(([id, qty]) => {
            const item = FNB_ITEMS.find((f) => f.id === id);
            return {
              id,
              name: item ? item.name : 'Food Combo',
              quantity: qty,
              price: item ? item.price : 0,
            };
          })
          .filter((f) => f.quantity > 0),
        bookedAt: new Date().toISOString(),
        qrCodeValue: JSON.stringify({
          app: 'SeatView',
          bookingId,
          user: currentUser.email,
          showId: selectedShow.id,
          seats: selectedSeats.map((s) => s.id),
          total: priceSummary.total,
          method: mockPaymentMethod,
        }),
      };

      const updatedBookings = [newBooking, ...bookings];
      setBookings(updatedBookings);
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
      } catch {}

      // Release holds from active holds
      updateHolds(
        (holds) => holds.filter((h) => !(h.showId === selectedShow.id && h.heldByUserId === currentUser.id)),
        false
      );

      // Notify other tabs that seats are booked
      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'SEAT_BOOKED',
          showId: selectedShow.id,
          seats: selectedSeats.map((s) => s.id),
        });
      }

      // Reset selection, F&B & hold timer
      setSelectedSeats([]);
      setActivePreviewSeatId(null);
      setFnbCart({});
      setHoldTimerActive(false);

      return newBooking;
    },
    [
      selectedShow,
      selectedMovie,
      currentScreenConfig,
      currentUser,
      selectedSeats,
      selectedCityId,
      priceSummary,
      bookings,
      updateHolds,
    ]
  );

  return {
    currentUser,
    loginUser,
    logoutUser,
    selectedCityId,
    setCity,
    selectedMovie,
    setSelectedMovie,
    selectedDate,
    setSelectedDate,
    selectedShow,
    setSelectedShow,
    selectedSeats,
    toggleSeatSelection,
    activePreviewSeatId,
    setActivePreviewSeatId,
    isOverviewMode,
    setIsOverviewMode,
    seatLimitWarning,
    bookedSeatIds,
    heldByOthersSeatIds,
    holdSecondsLeft,
    holdTimerActive,
    holdExpiredNotice,
    setHoldExpiredNotice,
    priceSummary,
    fnbCart,
    updateFnbQuantity,
    clearFnbCart,
    currentScreenConfig,
    confirmBooking,
    bookings,
  };
}
