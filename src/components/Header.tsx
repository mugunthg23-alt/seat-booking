import React, { useState } from 'react';
import { CityId, User } from '../types';
import { CITIES } from '../data/seedData';
import { MapPin, Ticket, User as UserIcon, LogOut, ChevronDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentCityId: CityId;
  currentUser: User | null;
  bookingsCount: number;
  onOpenCityModal: () => void;
  onOpenLoginModal: () => void;
  onOpenMyBookings: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCityId,
  currentUser,
  bookingsCount,
  onOpenCityModal,
  onOpenLoginModal,
  onOpenMyBookings,
  onLogout,
  onHomeClick,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentCity = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2DDD3] px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-lg border-2 border-[#C8A35B] bg-[#FAF0D9] flex items-center justify-center text-[#845E1B] group-hover:bg-[#C8A35B] group-hover:text-[#0E1424] transition-colors shadow-sm">
            <span className="font-serif font-black text-lg">S</span>
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#0E1424]">
              SeatView
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono tracking-widest text-[#845E1B] uppercase font-bold">
              3D Theater Preview
            </span>
          </div>
        </button>

        {/* Right Action Controls: City Selector & User Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* City Selector Pill */}
          <button
            type="button"
            onClick={onOpenCityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F1EFEA] border border-[#D8D3C5] text-xs font-semibold text-[#0E1424] transition-colors shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C8A35B]" />
            <span>{currentCity.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* My Bookings Shortcut */}
          <button
            type="button"
            onClick={onOpenMyBookings}
            className="relative px-3 py-1.5 rounded-full hover:bg-[#F1EFEA] text-[#2D3748] hover:text-[#0E1424] transition-colors flex items-center gap-1.5 text-xs font-medium border border-[#E2DDD3]"
            title="View My Bookings"
          >
            <Ticket className="w-4 h-4 text-[#A17424]" />
            <span className="hidden md:inline font-semibold">My Bookings</span>
            {bookingsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C8A35B] text-[#0E1424] text-[10px] font-bold flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-[#F1EFEA] text-xs text-[#0E1424] border border-[#E2DDD3] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#C8A35B] text-[#0E1424] font-bold text-xs flex items-center justify-center shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-semibold truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E2DDD3] py-2 shadow-2xl z-50 animate-fadeIn">
                  <div className="px-3.5 py-2.5 border-b border-[#E2DDD3] text-xs">
                    <p className="font-bold text-[#0E1424]">{currentUser.name}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono bg-[#FAF0D9] text-[#845E1B] font-bold border border-[#E8D4A8]">
                      Verified Reviewer
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenMyBookings();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-[#2D3748] hover:bg-[#FAF8F5] flex items-center gap-2 font-medium"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#C8A35B]" />
                    <span>My Tickets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="px-4 py-1.5 rounded-full bg-[#C8A35B] hover:bg-[#b89445] text-[#0E1424] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
