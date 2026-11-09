import React, { useState, useMemo } from 'react';
import { Movie, Show, SeatInfo, FnbItem, FnbCategory } from '../types';
import { FNB_ITEMS } from '../data/seedData';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface FnbViewProps {
  movie: Movie;
  show: Show;
  theaterName: string;
  theaterArea: string;
  selectedSeats: SeatInfo[];
  ticketsSubtotal: number;
  fnbCart: Record<string, number>;
  onUpdateFnbQuantity: (itemId: string, quantity: number) => void;
  onSkip: () => void;
  onProceedToCheckout: () => void;
  onBackToSeats: () => void;
}

const CATEGORIES: FnbCategory[] = ['All', 'Combos', 'Snacks', 'Popcorn', 'Beverages'];

export const FnbView: React.FC<FnbViewProps> = ({
  movie,
  show,
  theaterName,
  theaterArea,
  selectedSeats,
  ticketsSubtotal,
  fnbCart,
  onUpdateFnbQuantity,
  onSkip,
  onProceedToCheckout,
  onBackToSeats,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FnbCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered items
  const filteredItems = useMemo(() => {
    return FNB_ITEMS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Cart calculations
  const cartItems = useMemo(() => {
    return Object.entries(fnbCart)
      .map(([id, quantity]) => {
        const item = FNB_ITEMS.find((f) => f.id === id);
        return item ? { item, quantity } : null;
      })
      .filter((ci): ci is { item: FnbItem; quantity: number } => ci !== null && ci.quantity > 0);
  }, [fnbCart]);

  const fnbTotal = useMemo(() => {
    return cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  }, [cartItems]);

  const grandTotal = ticketsSubtotal + fnbTotal;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] flex flex-col font-sans">
      {/* 1. Top Navigation Bar (matching image_f3b0f44c.png) */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Arrow & Movie Info */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onBackToSeats}
              className="p-1 rounded-md text-[#111827] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Back to seats"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="font-semibold text-base sm:text-lg text-[#111827] leading-tight">
                {movie.title} - {movie.primaryLanguage}
              </h1>
              <p className="text-xs text-[#6B7280] font-normal leading-tight mt-0.5">
                {theaterName}: {theaterArea} | {show.dateStr} | {show.timeStr}
              </p>
            </div>
          </div>

          {/* Right Red Skip Button */}
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-2 rounded-lg bg-[#F84464] hover:bg-[#E53935] active:bg-[#D32F2F] text-white text-sm font-semibold tracking-wide transition-colors shadow-xs"
          >
            Skip
          </button>
        </div>
      </header>

      {/* 2. Main Content Split Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: F&B Menu (8 cols on lg) */}
        <div className="w-full lg:col-span-8 flex flex-col gap-5">
          {/* Search & Header Card */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <span className="font-bold text-lg sm:text-xl text-[#111827]">
              Grab a Bite!
            </span>

            {/* Search Pill Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for F&B Items"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D1D5DB] focus:border-[#F84464] text-xs sm:text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs (matching image underline style) */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 shadow-xs">
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto text-sm font-medium">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-3.5 whitespace-nowrap transition-all border-b-2 font-semibold text-sm ${
                      isActive
                        ? 'border-[#F84464] text-[#F84464]'
                        : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Items Grid (2 cols on sm/md/lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const qty = fnbCart[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs hover:border-[#CBD5E1] transition-all flex items-start gap-3.5 relative"
                >
                  {/* Veg / Non-veg Indicator Dot */}
                  <div className="absolute top-4 left-4 z-10">
                    {item.isVeg ? (
                      <div className="w-3.5 h-3.5 rounded-xs border border-[#16A34A] flex items-center justify-center bg-white p-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-xs border border-[#DC2626] flex items-center justify-center bg-white p-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      </div>
                    )}
                  </div>

                  {/* Food Item Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#F9FAFB] shrink-0 border border-[#F3F4F6] mt-1">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Details & Price */}
                  <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                    <div>
                      <h3 className="font-semibold text-sm text-[#111827] leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[#6B7280] leading-snug mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-1">
                      <span className="font-bold text-sm sm:text-base text-[#111827]">
                        ₹{item.price}
                      </span>

                      {/* Add Button or Quantity Controller */}
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => onUpdateFnbQuantity(item.id, 1)}
                          className="px-5 py-1.5 rounded-lg border border-[#F84464] text-[#F84464] hover:bg-[#FFF1F3] text-xs sm:text-sm font-bold transition-colors"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#FFF1F3] border border-[#F84464] rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateFnbQuantity(item.id, qty - 1)}
                            className="p-1 rounded text-[#F84464] hover:bg-white transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <span className="font-bold text-xs font-mono text-[#F84464] px-1">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateFnbQuantity(item.id, qty + 1)}
                            className="p-1 rounded text-[#F84464] hover:bg-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Cart & Price Summary (4 cols on lg, exactly matching image_f3b0f44c.png) */}
        <div className="w-full lg:col-span-4 sticky top-20 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            {/* Ticket(s) price row */}
            <div className="p-4 flex items-center justify-between border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#4B5563]">
                Ticket(s) price ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})
              </span>
              <span className="font-bold text-base text-[#111827]">
                ₹{ticketsSubtotal.toFixed(2)}
              </span>
            </div>

            {/* Your Cart Header */}
            <div className="p-4 pb-2">
              <h2 className="font-bold text-base text-[#111827]">
                Your Cart
              </h2>
            </div>

            {/* Empty or Populated Cart State */}
            {cartItems.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                {/* Cute Smiling Red-and-White Popcorn Graphic (matching image_f3b0f44c.png) */}
                <div className="w-24 h-24 relative flex items-center justify-center mb-3">
                  <svg width="84" height="92" viewBox="0 0 84 92" fill="none">
                    {/* Fluffy Popcorn kernels on top */}
                    <circle cx="26" cy="22" r="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
                    <circle cx="42" cy="16" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                    <circle cx="58" cy="22" r="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
                    <circle cx="34" cy="28" r="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                    <circle cx="50" cy="28" r="10" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />

                    {/* Popcorn Tub Body */}
                    <path
                      d="M16 32L24 86H60L68 32H16Z"
                      fill="#FFFFFF"
                      stroke="#EF4444"
                      strokeWidth="3"
                    />

                    {/* Red Stripes on Tub */}
                    <path d="M26 32L31 86H39L34 32H26Z" fill="#EF4444" />
                    <path d="M46 32L45 86H53L54 32H46Z" fill="#EF4444" />

                    {/* Cute smiling cartoon face */}
                    <circle cx="36" cy="54" r="2.5" fill="#1F2937" />
                    <circle cx="48" cy="54" r="2.5" fill="#1F2937" />
                    <path
                      d="M37 62C39 67 45 67 47 62"
                      stroke="#1F2937"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path d="M32 58C34 59 34 60 32 60" stroke="#F87171" strokeWidth="2" />
                    <path d="M52 58C50 59 50 60 52 60" stroke="#F87171" strokeWidth="2" />
                  </svg>
                </div>

                <p className="text-xs text-[#6B7280] font-medium max-w-[200px] leading-relaxed">
                  Fill this cart with your favorite food combos!
                </p>
              </div>
            ) : (
              <div className="p-4 pt-1 space-y-3">
                {cartItems.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-2 border-b border-[#F3F4F6] last:border-b-0"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-[#111827]">{item.name}</p>
                      <p className="text-[11px] text-[#6B7280]">₹{item.price} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-[#FFF1F3] border border-[#F84464] rounded-md px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateFnbQuantity(item.id, quantity - 1)}
                          className="text-[#F84464] hover:bg-white rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs text-[#F84464] px-1">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateFnbQuantity(item.id, quantity + 1)}
                          className="text-[#F84464] hover:bg-white rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-xs text-[#111827] w-14 text-right">
                        ₹{item.price * quantity}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Subtotals & Total */}
                <div className="pt-2 border-t border-[#E5E7EB] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>F&B Total</span>
                    <span className="font-mono font-semibold text-[#111827]">₹{fnbTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#111827] font-bold text-sm pt-2 border-t border-[#E5E7EB]">
                    <span>Grand Total</span>
                    <span className="font-mono text-[#F84464] text-lg">₹{grandTotal}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed to Pay Action Button */}
            <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 rounded-lg bg-[#F84464] hover:bg-[#E53935] active:bg-[#D32F2F] text-white font-bold text-sm tracking-wide transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Proceed to Pay (₹{grandTotal})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
