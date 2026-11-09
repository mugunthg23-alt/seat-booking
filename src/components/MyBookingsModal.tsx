import React from 'react';
import { Booking } from '../types';
import { getMoviePosterDataUrl } from '../utils/posters';
import { X, Ticket, Calendar, Clock, MapPin, Eye, Film } from 'lucide-react';

interface MyBookingsModalProps {
  isOpen: boolean;
  bookings: Booking[];
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  bookings,
  onClose,
  onSelectBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-[#E2DDD3] rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F1EFEA] text-[#64748B] hover:text-[#0E1424] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-3 border-b border-[#E2DDD3]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#845E1B] uppercase">
            <Ticket className="w-4 h-4 text-[#C8A35B]" />
            <span>Digital Passes</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0E1424] mt-1">
            My Bookings
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            All your confirmed tickets across Chennai, Bangalore, and Mumbai.
          </p>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {bookings.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#64748B]">
              <Film className="w-9 h-9 text-[#CBD5E1] mx-auto mb-2" />
              <p className="font-bold text-[#0E1424]">No bookings yet.</p>
              <p className="text-[11px] text-[#64748B] mt-1">
                Select a movie and test the 3D seat preview to make your first booking!
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border-2 border-[#CBD5E1] hover:border-[#C8A35B] rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={getMoviePosterDataUrl(booking.movieId)}
                    alt={booking.movieTitle}
                    className="w-14 h-20 object-cover rounded-md border border-[#C8A35B] shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-[#0E1424]">
                        {booking.movieTitle}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF0D9] border border-[#E8D4A8] text-[#845E1B]">
                        {booking.format}
                      </span>
                    </div>

                  <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A35B]" />
                    <span>{booking.theaterName}, {booking.screenName}</span>
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[#475569] font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{booking.showDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{booking.showTime}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {booking.seats.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-0.5 rounded-md bg-[#FAF0D9] border border-[#C8A35B] font-mono text-xs text-[#845E1B] font-extrabold"
                      >
                        {s.row}{s.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E2DDD3]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#64748B] block font-mono font-bold">
                      {booking.id}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-[#0E1424]">
                      ₹{booking.total}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectBooking(booking);
                      onClose();
                    }}
                    className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#C8A35B] hover:text-[#0E1424] text-xs font-bold text-[#0E1424] border border-[#CBD5E1] hover:border-[#C8A35B] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Ticket</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
