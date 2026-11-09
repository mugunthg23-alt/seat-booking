export type CityId = 'chennai' | 'bangalore' | 'mumbai';

export interface City {
  id: CityId;
  name: string;
  state: string;
  lat: number;
  lng: number;
  theatersCount: number;
}

export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Kannada';
export type Genre = 'Action' | 'Sci-Fi' | 'Drama' | 'Thriller' | 'Romance' | 'Comedy' | 'Adventure';
export type Certificate = 'U' | 'UA' | 'A';
export type Format = '2D' | 'IMAX 2D' | 'Dolby Atmos' | '4DX';

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  languages: Language[];
  primaryLanguage: Language;
  genres: Genre[];
  certificate: Certificate;
  runtimeMin: number;
  synopsis: string;
  posterBg: string;
  posterAccent: string;
  posterUrl?: string; // Direct path to official high-res poster
  screenVisualUrl?: string;
  rating: number; // e.g. 8.7
  votes: string; // e.g. "42.5K"
}

export type FnbCategory = 'All' | 'Combos' | 'Snacks' | 'Popcorn' | 'Beverages';

export interface FnbItem {
  id: string;
  name: string;
  description: string;
  category: 'Combos' | 'Snacks' | 'Popcorn' | 'Beverages';
  isVeg: boolean;
  price: number;
  imageUrl: string;
  caloriesKcal?: number;
  allergens?: string;
}

export interface FnbCartItem {
  item: FnbItem;
  quantity: number;
}

export interface Theater {
  id: string;
  cityId: CityId;
  name: string;
  area: string;
  address: string;
  screens: ScreenConfig[];
}

export type SeatTier = 'Silver' | 'Gold' | 'Platinum';

export interface TierPrice {
  tier: SeatTier;
  label: string;
  basePrice: number;
  rows: string[];
}

export interface ScreenLayout {
  rows: string[]; // e.g. ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']
  seatsPerRow: number; // e.g. 14
  aisleGapsAfter: number[]; // e.g. [3, 10] leaves aisles between seat 3-4 and 10-11
  tierMap: Record<string, SeatTier>; // row -> tier
  rakeAngleDeg: number; // e.g. 14 degrees slope
  rowDistanceMeters: number; // e.g. 1.1m
  screenWidthMeters: number; // e.g. 16m
  screenHeightMeters: number; // e.g. 8.5m
  screenDistanceMeters: number; // e.g. 4.5m from row A
  screenCurvatureMeters: number; // e.g. 24m radius
}

export interface ScreenConfig {
  id: string;
  name: string;
  format: Format;
  layout: ScreenLayout;
  pricing: TierPrice[];
}

export type AvailabilityStatus = 'Available' | 'Filling fast' | 'Almost full';

export interface Show {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // e.g. "10:30 AM", "02:15 PM"
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  format: Format;
  availability: AvailabilityStatus;
  basePriceConfig: Record<SeatTier, number>;
}

export type SeatStatus = 'available' | 'selected' | 'held' | 'booked';

export interface SeatInfo {
  id: string; // e.g. "C-7"
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  isAccessible?: boolean;
  // 3D coordinates relative to screen center at (0, 0, 0)
  x: number;
  y: number; // eye height included
  z: number;
}

export interface ShowSeatState {
  seatId: string;
  status: 'available' | 'held' | 'booked';
  heldByUserId?: string;
  holdExpiresAt?: number; // timestamp
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  movieId: string;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  city: string;
  showDate: string;
  showTime: string;
  format: Format;
  seats: {
    id: string;
    row: string;
    number: number;
    tier: SeatTier;
    price: number;
  }[];
  subtotal: number;
  convenienceFee: number;
  taxes: number;
  total: number;
  bookedAt: string;
  qrCodeValue: string;
  fnbItems?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface ViewQualityMetrics {
  label: 'Ideal distance' | 'Close to screen' | 'Far back' | 'Side angle';
  distanceMeters: number;
  horizontalAngleDeg: number;
  verticalAngleDeg: number;
  fieldOfViewDeg: number;
  description: string;
}
