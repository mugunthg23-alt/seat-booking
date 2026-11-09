import React from 'react';
import { Booking } from '../types';
import { getMoviePosterDataUrl } from '../utils/posters';
import { Check, Calendar, Eye, Ticket as TicketIcon } from 'lucide-react';

interface TicketViewProps {
  booking: Booking;
  onHomeClick: () => void;
  onViewIn3D: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  booking,
  onHomeClick,
  onViewIn3D,
}) => {
  const handleAddToCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SeatView//Movie Ticket//EN
BEGIN:VEVENT
SUMMARY:Movie: ${booking.movieTitle} (${booking.format})
DESCRIPTION:Theater: ${booking.theaterName}, ${booking.screenName}\\nSeats: ${booking.seats.map((s) => s.row + s.number).join(', ')}\\nBooking ID: ${booking.id}
LOCATION:${booking.theaterName}, ${booking.city}
DTSTART:${booking.showDate.replace(/-/g, '')}T100000Z
DTEND:${booking.showDate.replace(/-/g, '')}T130000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SeatView-${booking.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      {/* Success banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#FAF0D9] border-2 border-[#C8A35B] text-[#845E1B] flex items-center justify-center mx-auto mb-3 shadow-md">
          <Check className="w-9 h-9 stroke-[3]" />
        </div>
        <span className="text-[11px] font-mono tracking-widest text-[#845E1B] uppercase font-bold">
          Booking Confirmed
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#0E1424] mt-1">
          Enjoy the Screening!
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Your digital ticket and gate pass is ready. Please present the QR code at the screen entrance.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="bg-white border-2 border-[#E2DDD3] rounded-2xl overflow-hidden shadow-xl relative">
        {/* Top Header of Ticket */}
        <div className="bg-[#FAF8F5] p-6 border-b border-[#E2DDD3] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={getMoviePosterDataUrl(booking.movieId)}
              alt={booking.movieTitle}
              className="w-16 h-24 object-cover rounded-lg border border-[#C8A35B] shadow-md shrink-0"
            />
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#845E1B] uppercase font-bold">
                {booking.format} • Cinema Pass
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#0E1424] mt-1">
                {booking.movieTitle}
              </h2>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                {booking.theaterName} • {booking.city}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#64748B] uppercase font-mono font-bold">Booking ID</span>
            <p className="font-mono text-sm font-extrabold text-[#845E1B]">{booking.id}</p>
          </div>
        </div>

        {/* Middle Details Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-[#E2DDD3]">
          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">Date</span>
            <p className="font-bold text-[#0E1424] mt-0.5">{booking.showDate}</p>
          </div>
          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">Time</span>
            <p className="font-bold text-[#0E1424] mt-0.5">{booking.showTime}</p>
          </div>
          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">Auditorium</span>
            <p className="font-bold text-[#0E1424] mt-0.5">{booking.screenName}</p>
          </div>
          <div>
            <span className="text-[#64748B] text-[10px] uppercase font-mono font-bold">Paid</span>
            <p className="font-mono font-extrabold text-[#845E1B] mt-0.5 text-sm">₹{booking.total}</p>
          </div>
        </div>

        {/* Seats Row & QR Code */}
        <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] text-[#64748B] uppercase font-mono font-bold block mb-2">
              Reserved Seats ({booking.seats.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <div
                  key={seat.id}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FAF0D9] border border-[#C8A35B] text-[#0E1424] font-mono font-extrabold text-sm shadow-sm"
                >
                  {seat.row}{seat.number}
                  <span className="text-[10px] ml-1.5 font-sans font-bold text-[#845E1B]">
                    ({seat.tier})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG QR Code */}
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white border-2 border-[#0E1424] rounded-lg shadow-md">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <rect x="5" y="5" width="28" height="28" stroke="#0E1424" strokeWidth="6" fill="none" />
                <rect x="12" y="12" width="14" height="14" fill="#0E1424" />

                <rect x="67" y="5" width="28" height="28" stroke="#0E1424" strokeWidth="6" fill="none" />
                <rect x="74" y="12" width="14" height="14" fill="#0E1424" />

                <rect x="5" y="67" width="28" height="28" stroke="#0E1424" strokeWidth="6" fill="none" />
                <rect x="12" y="74" width="14" height="14" fill="#0E1424" />

                <rect x="42" y="8" width="6" height="6" fill="#0E1424" />
                <rect x="52" y="8" width="6" height="6" fill="#0E1424" />
                <rect x="42" y="20" width="6" height="6" fill="#0E1424" />
                <rect x="52" y="24" width="6" height="6" fill="#0E1424" />
                <rect x="10" y="44" width="6" height="6" fill="#0E1424" />
                <rect x="22" y="44" width="6" height="6" fill="#0E1424" />
                <rect x="36" y="40" width="6" height="6" fill="#0E1424" />
                <rect x="48" y="44" width="6" height="6" fill="#0E1424" />
                <rect x="62" y="42" width="6" height="6" fill="#0E1424" />
                <rect x="76" y="44" width="6" height="6" fill="#0E1424" />
                <rect x="88" y="40" width="6" height="6" fill="#0E1424" />
                <rect x="40" y="56" width="6" height="6" fill="#0E1424" />
                <rect x="54" y="56" width="6" height="6" fill="#0E1424" />
                <rect x="68" y="56" width="6" height="6" fill="#0E1424" />
                <rect x="42" y="72" width="6" height="6" fill="#0E1424" />
                <rect x="54" y="76" width="6" height="6" fill="#0E1424" />
                <rect x="78" y="72" width="6" height="6" fill="#0E1424" />
                <rect x="88" y="84" width="6" height="6" fill="#0E1424" />
              </svg>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#475569] mt-1.5">Scan at Gate</span>
          </div>
        </div>

        {/* Perforated ticket divider */}
        <div className="relative flex items-center justify-between px-2">
          <div className="w-5 h-5 rounded-full bg-[#F8F6F0] border-r-2 border-[#E2DDD3] -ml-5" />
          <div className="flex-1 border-b-2 border-dashed border-[#CBD5E1] mx-2" />
          <div className="w-5 h-5 rounded-full bg-[#F8F6F0] border-l-2 border-[#E2DDD3] -mr-5" />
        </div>

        {/* Ticket Actions */}
        <div className="p-6 bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#F1EFEA] border border-[#CBD5E1] text-[#0E1424] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#C8A35B]" />
            <span>Add to Calendar (.ics)</span>
          </button>

          <button
            type="button"
            onClick={onViewIn3D}
            className="px-4 py-2.5 rounded-lg bg-[#FAF0D9] hover:bg-[#F0E5CE] border border-[#C8A35B] text-[#845E1B] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View in 3D Again</span>
          </button>
        </div>
      </div>

      {/* Done Button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onHomeClick}
          className="px-8 py-3 rounded-lg bg-[#C8A35B] text-[#0E1424] font-extrabold text-sm transition-colors hover:bg-[#b89445] shadow-md"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
};
