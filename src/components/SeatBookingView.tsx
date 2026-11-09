import React, { useState, useRef } from 'react';
import { ScreenConfig, SeatInfo, Movie, Show, SeatTier } from '../types';
import { Auditorium3D } from './Auditorium3D';
import {
  Clock,
  Check,
  X,
  Armchair,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertCircle,
  Accessibility,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface SeatBookingViewProps {
  movie: Movie;
  show: Show;
  screenConfig: ScreenConfig;
  theaterName: string;
  theaterArea: string;
  selectedSeats: SeatInfo[];
  activePreviewSeatId: string | null;
  isOverviewMode: boolean;
  bookedSeatIds: Set<string>;
  heldByOthersSeatIds: Set<string>;
  holdSecondsLeft: number;
  holdTimerActive: boolean;
  seatLimitWarning: string | null;
  priceSummary: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    total: number;
    count: number;
  };
  onToggleSeat: (row: string, num: number) => void;
  onSelectPreviewSeat: (seatId: string) => void;
  onToggleOverview: (overview: boolean) => void;
  onBack: () => void;
  onProceedToCheckout: () => void;
}

export const SeatBookingView: React.FC<SeatBookingViewProps> = ({
  movie,
  show,
  screenConfig,
  theaterName,
  theaterArea,
  selectedSeats,
  activePreviewSeatId,
  isOverviewMode,
  bookedSeatIds,
  heldByOthersSeatIds,
  holdSecondsLeft,
  holdTimerActive,
  seatLimitWarning,
  priceSummary,
  onToggleSeat,
  onSelectPreviewSeat,
  onToggleOverview,
  onBack,
  onProceedToCheckout,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPriceSheetOpen, setIsPriceSheetOpen] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const layout = screenConfig.layout;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const tierSections = React.useMemo(() => {
    const sections: { tier: SeatTier; price: number; rows: string[] }[] = [];
    const tiers: SeatTier[] = ['Platinum', 'Gold', 'Silver'];

    tiers.forEach((tier) => {
      const rowsForTier = layout.rows.filter((r) => layout.tierMap[r] === tier);
      if (rowsForTier.length > 0) {
        sections.push({
          tier,
          price: show.basePriceConfig[tier] || 250,
          rows: rowsForTier,
        });
      }
    });
    return sections;
  }, [layout, show]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F0] text-[#0E1424]">
      {/* Top Navigation & Context Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E2DDD3] px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-md hover:bg-[#F1EFEA] text-[#475569] hover:text-[#0E1424] transition-colors border border-transparent hover:border-[#E2DDD3]"
              aria-label="Go back to showtimes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-base sm:text-lg font-bold text-[#0E1424] truncate max-w-[200px] sm:max-w-md">
                  {movie.title}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#FAF0D9] border border-[#E8D4A8] text-[#845E1B] font-mono font-bold">
                  {show.format}
                </span>
              </div>
              <p className="text-xs text-[#64748B] truncate">
                {theaterName}, {theaterArea} • <span className="font-semibold text-[#0E1424]">{show.timeStr}</span> • {show.dateStr}
              </p>
            </div>
          </div>

          {/* Hold Timer Badge */}
          {holdTimerActive && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0D9] border border-[#C8A35B] text-[#845E1B] shadow-sm">
              <Clock className="w-4 h-4 text-[#A17424]" />
              <div className="text-xs">
                <span className="hidden sm:inline font-medium">Seats Held: </span>
                <span className="font-mono font-bold text-[#845E1B]">{formatTimer(holdSecondsLeft)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Toast */}
      {seatLimitWarning && (
        <div className="bg-[#FAF0D9] border-b border-[#C8A35B] text-[#845E1B] px-4 py-2.5 text-center text-xs font-bold flex items-center justify-center gap-2 sticky top-[61px] z-20 shadow-md">
          <AlertCircle className="w-4 h-4 text-[#A17424]" />
          <span>{seatLimitWarning}</span>
        </div>
      )}

      {/* Main Content: Split Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 2D Interactive Seat Map (7 cols on lg) */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col bg-white border border-[#E2DDD3] rounded-xl p-4 sm:p-6 shadow-md relative overflow-hidden">
          {/* Map Controls & Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E2DDD3] text-xs">
            <div>
              <span className="font-serif text-base font-bold text-[#0E1424]">
                Choose Seats (Max 8)
              </span>
              <p className="text-[11px] text-[#64748B]">
                Click any seat to instantly see the screen view from that exact chair
              </p>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#F8F6F0] p-1 rounded-md border border-[#E2DDD3]">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.1))}
                className="p-1.5 rounded hover:bg-white text-[#475569] hover:text-[#0E1424]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1.5 text-[#0E1424]">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 rounded hover:bg-white text-[#475569] hover:text-[#0E1424]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded hover:bg-white text-[#475569] hover:text-[#0E1424]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Seat State Legend (High Contrast & Clear) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 px-3 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DDD3] text-xs text-[#2D3748]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-t-sm border-2 border-[#94A3B8] bg-white flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span className="font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-t-sm bg-[#C8A35B] text-[#0E1424] flex items-center justify-center font-bold shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="font-bold text-[#845E1B]">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-t-sm bg-[#E2E8F0] border border-[#CBD5E1] text-[#94A3B8] flex items-center justify-center">
                <X className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="text-[#64748B]">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-t-sm border-2 border-dashed border-[#F59E0B] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <Clock className="w-3 h-3" />
              </span>
              <span className="text-[#92400E]">Held</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-t-sm border-2 border-[#3B82F6] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Accessibility className="w-3 h-3" />
              </span>
              <span className="text-[#1D4ED8]">Accessible</span>
            </div>
          </div>

          {/* Zoomable Container */}
          <div
            ref={mapContainerRef}
            className="flex-1 overflow-x-auto overflow-y-auto pb-8 pt-2 flex flex-col items-center select-none"
          >
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 150ms ease-out',
              }}
              className="flex flex-col items-center min-w-max"
            >
              {/* Curved Cinema Screen Bar */}
              <div className="w-full max-w-[480px] flex flex-col items-center mb-10">
                <div className="w-full h-4 border-t-4 border-x-4 border-[#C8A35B] rounded-t-[100px] bg-gradient-to-b from-[#C8A35B]/30 to-transparent" />
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#845E1B] mt-1.5 flex items-center gap-2">
                  <span>◀ ALL EYES THIS WAY • CINEMA SCREEN ▶</span>
                </div>
              </div>

              {/* Tiers & Rows */}
              <div className="space-y-6">
                {tierSections.map((section) => (
                  <div key={section.tier} className="space-y-2.5">
                    {/* Section Header */}
                    <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-[#FAF8F5] rounded-md border border-[#E2DDD3]">
                      <span className="font-bold text-[#0E1424] tracking-wide">
                        {section.tier} Section
                      </span>
                      <span className="font-mono font-bold text-[#845E1B]">
                        ₹{section.price} per ticket
                      </span>
                    </div>

                    {/* Rows */}
                    <div className="space-y-2">
                      {section.rows.map((row) => (
                        <div key={row} className="flex items-center gap-2">
                          {/* Left Row Label */}
                          <span className="w-6 text-center text-xs font-mono font-bold text-[#64748B]">
                            {row}
                          </span>

                          {/* Seats */}
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: layout.seatsPerRow }, (_, i) => i + 1).map((num) => {
                              const seatId = `${row}-${num}`;
                              const isBooked = bookedSeatIds.has(seatId);
                              const isHeld = heldByOthersSeatIds.has(seatId);
                              const isSelected = selectedSeats.some((s) => s.id === seatId);
                              const isActivePreview = activePreviewSeatId === seatId;
                              const isAccessible = row === layout.rows[0] && (num === 1 || num === layout.seatsPerRow);
                              const isAisleAfter = layout.aisleGapsAfter.includes(num);

                              return (
                                <React.Fragment key={num}>
                                  <button
                                    type="button"
                                    disabled={isBooked || isHeld}
                                    onClick={() => onToggleSeat(row, num)}
                                    aria-label={`Row ${row}, Seat ${num}, ${section.tier}, ₹${section.price}`}
                                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-md flex items-center justify-center text-xs font-mono font-bold transition-all duration-150 ${
                                      isSelected
                                        ? 'bg-[#C8A35B] text-[#0E1424] shadow-md ring-2 ring-[#845E1B]'
                                        : isBooked
                                        ? 'bg-[#E2E8F0] border border-[#CBD5E1] text-[#94A3B8] cursor-not-allowed'
                                        : isHeld
                                        ? 'border-2 border-dashed border-[#F59E0B] bg-[#FEF3C7] text-[#D97706] cursor-not-allowed'
                                        : isAccessible
                                        ? 'border-2 border-[#3B82F6] bg-[#EFF6FF] text-[#1D4ED8] hover:border-[#1E40AF]'
                                        : 'bg-white border-2 border-[#94A3B8] text-[#0E1424] hover:border-[#C8A35B] hover:bg-[#FAF0D9] shadow-sm'
                                    } ${isActivePreview ? 'ring-2 ring-offset-2 ring-offset-white ring-[#0E1424]' : ''}`}
                                  >
                                    {isSelected ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : isBooked ? (
                                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                    ) : isHeld ? (
                                      <Clock className="w-3.5 h-3.5" />
                                    ) : isAccessible ? (
                                      <Accessibility className="w-3.5 h-3.5" />
                                    ) : (
                                      <span>{num}</span>
                                    )}
                                  </button>
                                  {isAisleAfter && <div className="w-6 sm:w-7" />}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* Right Row Label */}
                          <span className="w-6 text-center text-xs font-mono font-bold text-[#64748B]">
                            {row}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Viewport & Live Price Summary (5 cols on lg) */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-6">
          {/* 3D AUDITORIUM HERO VIEWPORT */}
          <div className="w-full">
            <Auditorium3D
              screenConfig={screenConfig}
              selectedSeats={selectedSeats}
              activeSeatId={activePreviewSeatId}
              movie={movie}
              isOverviewMode={isOverviewMode}
              onToggleOverview={onToggleOverview}
              onSelectSeatChip={onSelectPreviewSeat}
            />
          </div>

          {/* LIVE PRICE PANEL (DESKTOP) */}
          <div className="hidden lg:flex flex-col bg-white border border-[#E2DDD3] rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3] mb-4">
              <span className="font-serif text-lg font-bold text-[#0E1424]">
                Price Summary
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#FAF0D9] text-[#845E1B]">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
              </span>
            </div>

            {selectedSeats.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B] space-y-2">
                <Armchair className="w-9 h-9 text-[#CBD5E1] mx-auto" />
                <p className="font-semibold text-[#0E1424]">No seats selected yet.</p>
                <p className="text-[11px] text-[#64748B]">
                  Click on the seat map to sit in any row and inspect prices.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List of selected seats */}
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {selectedSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-[#FAF8F5] border border-[#E2DDD3]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#845E1B] text-sm">
                          {seat.row}{seat.number}
                        </span>
                        <span className="text-[#475569] font-medium">{seat.tier} Tier</span>
                      </div>
                      <span className="font-mono font-bold text-[#0E1424]">
                        ₹{seat.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Taxes breakdown */}
                <div className="space-y-2 pt-3 border-t border-[#E2DDD3] text-xs">
                  <div className="flex justify-between text-[#475569]">
                    <span>Tickets Subtotal</span>
                    <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#475569]">
                    <span>Convenience Fee (₹35/seat)</span>
                    <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.convenienceFee}</span>
                  </div>
                  <div className="flex justify-between text-[#475569]">
                    <span>GST (18%)</span>
                    <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.taxes}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-[#E2DDD3] font-bold">
                    <span className="text-sm text-[#0E1424]">Grand Total</span>
                    <span className="text-2xl font-mono text-[#845E1B]">
                      ₹{priceSummary.total}
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  disabled={selectedSeats.length === 0}
                  className="w-full py-3.5 px-4 rounded-lg bg-[#C8A35B] hover:bg-[#b89445] active:bg-[#a17424] text-[#0E1424] font-extrabold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continue to Checkout</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-white border-t border-[#E2DDD3] px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsPriceSheetOpen(!isPriceSheetOpen)}
            className="flex flex-col text-left"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[#845E1B] font-mono">
                ₹{priceSummary.total}
              </span>
              <span className="text-xs text-[#64748B]">
                ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})
              </span>
              <Info className="w-3.5 h-3.5 text-[#64748B]" />
            </div>
            <span className="text-[11px] text-[#475569] underline">
              {isPriceSheetOpen ? 'Hide breakdown' : 'View price breakdown'}
            </span>
          </button>

          <button
            type="button"
            onClick={onProceedToCheckout}
            disabled={selectedSeats.length === 0}
            className="py-2.5 px-5 rounded-lg bg-[#C8A35B] text-[#0E1424] font-bold text-sm transition-colors flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Expandable Mobile Price Sheet */}
        {isPriceSheetOpen && (
          <div className="mt-3 pt-3 border-t border-[#E2DDD3] text-xs space-y-2">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>Convenience Fee</span>
              <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.convenienceFee}</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>GST (18%)</span>
              <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.taxes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
