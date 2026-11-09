import React, { useState } from 'react';
import { Movie, Show, SeatInfo, ScreenConfig, User, Booking } from '../types';
import { THEATERS } from '../data/seedData';
import { getMoviePosterDataUrl } from '../utils/posters';
import {
  Clock,
  ArrowLeft,
  CreditCard,
  QrCode,
  Building2,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface CheckoutViewProps {
  movie: Movie;
  show: Show;
  screenConfig: ScreenConfig;
  selectedSeats: SeatInfo[];
  currentUser: User | null;
  holdSecondsLeft: number;
  priceSummary: {
    subtotal: number;
    convenienceFee: number;
    taxes: number;
    total: number;
  };
  onBackToSeats: () => void;
  onPaymentSuccess: (method: string) => Booking | null;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  movie,
  show,
  screenConfig,
  selectedSeats,
  currentUser,
  holdSecondsLeft,
  priceSummary,
  onBackToSeats,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('841');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const theater = THEATERS.find((t) => t.id === show.theaterId);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFailure) {
        setErrorMessage(
          'Payment declined by bank (Simulated Mode). Your seat holds are active—please retry or switch payment method.'
        );
      } else {
        const methodLabel =
          paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit Card' : 'Net Banking';
        onPaymentSuccess(methodLabel);
      }
    }, 1400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
      {/* Back to Seat Selection & Hold Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToSeats}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F1EFEA] border border-[#CBD5E1] text-[#475569] hover:text-[#0E1424] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 3D Seat Map</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0D9] border border-[#C8A35B] text-[#845E1B] text-xs font-bold shadow-sm">
          <Clock className="w-4 h-4 text-[#A17424]" />
          <span>Hold expires in: </span>
          <span className="font-mono text-sm">{formatTimer(holdSecondsLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Payment Forms */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2DDD3] rounded-xl p-6 shadow-md">
            <h2 className="font-serif text-xl font-bold text-[#0E1424] mb-1">
              Select Payment Method
            </h2>
            <p className="text-xs text-[#64748B] mb-6">
              Simulated payment gateway for SeatView POC. All options succeed instantly.
            </p>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-lg border-2 text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-[#C8A35B] bg-[#FAF0D9] font-bold text-[#845E1B] shadow-sm'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#FAF8F5]'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border-2 text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-[#C8A35B] bg-[#FAF0D9] font-bold text-[#845E1B] shadow-sm'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#FAF8F5]'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-bold">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-lg border-2 text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#C8A35B] bg-[#FAF0D9] font-bold text-[#845E1B] shadow-sm'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#FAF8F5]'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="font-bold">Net Banking</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0E1424] mb-1">
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                      required
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E2DDD3] text-xs text-[#475569] flex items-center justify-between font-medium">
                    <span>Google Pay, PhonePe, Paytm, or BHIM</span>
                    <span className="font-mono text-[10px] text-[#845E1B] font-bold">Auto-Approve</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0E1424] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• ••••"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-mono text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0E1424] mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-mono text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0E1424] mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-mono text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0E1424]">
                    Select Popular Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                      <div
                        key={b}
                        className="p-3 rounded-lg border border-[#CBD5E1] bg-white text-[#0E1424] font-medium flex items-center gap-2 cursor-pointer hover:border-[#C8A35B] shadow-sm"
                      >
                        <Building2 className="w-4 h-4 text-[#C8A35B]" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dev Setting */}
              <div className="pt-4 border-t border-[#E2DDD3] flex items-center justify-between text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#C8A35B]" />
                  <span>Dev: Test Payment Failure Path</span>
                </span>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded accent-[#C8A35B] cursor-pointer w-4 h-4"
                />
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 py-3.5 px-4 rounded-lg bg-[#C8A35B] hover:bg-[#b89445] text-[#0E1424] font-extrabold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Authorizing Mock Transaction...' : `Pay ₹${priceSummary.total}`}
                </span>
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="bg-white border border-[#E2DDD3] rounded-xl p-5 text-xs text-[#475569] shadow-sm">
            <h3 className="font-bold text-sm text-[#0E1424] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8A35B]" />
              <span>Contact & Ticket Delivery</span>
            </h3>
            <p>E-Ticket with QR code will be generated immediately for:</p>
            <div className="mt-2 font-mono text-xs font-semibold text-[#0E1424] space-y-0.5">
              <div>{currentUser?.email || 'guest@seatview.app'}</div>
              <div>{currentUser?.phone || '+91 98765 43210'}</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#E2DDD3] rounded-xl p-6 shadow-md sticky top-20 space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#0E1424] pb-3 border-b border-[#E2DDD3]">
              Booking Review
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-14 h-20 rounded-lg overflow-hidden border border-[#CBD5E1] shrink-0 bg-[#FAF8F5] shadow-sm">
                <img
                  src={getMoviePosterDataUrl(movie.id)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-[#0E1424]">
                    {movie.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF0D9] border border-[#E8D4A8] font-mono font-bold text-[#845E1B]">
                    {show.format}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                  {movie.primaryLanguage} • {movie.certificate} • {movie.runtimeMin} mins
                </p>
              </div>
            </div>

            <div className="text-xs text-[#475569] space-y-1 py-3 border-y border-[#E2DDD3]">
              <div className="font-bold text-[#0E1424]">{theater?.name}</div>
              <div className="text-[#64748B]">{theater?.area}</div>
              <div className="text-[#845E1B] font-mono font-bold mt-1">
                {screenConfig.name} • {show.dateStr} at {show.timeStr}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#0E1424] block mb-2">
                Reserved Seats ({selectedSeats.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 rounded-md bg-[#FAF0D9] border border-[#C8A35B] font-mono text-xs font-extrabold text-[#845E1B]"
                  >
                    {s.row}{s.number} ({s.tier})
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E2DDD3] text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>Tickets Subtotal</span>
                <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Convenience Fee (₹35/ticket)</span>
                <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.convenienceFee}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Integrated GST (18%)</span>
                <span className="font-mono font-bold text-[#0E1424]">₹{priceSummary.taxes}</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-[#E2DDD3] font-bold">
                <span className="text-sm text-[#0E1424]">Total Payable</span>
                <span className="text-2xl font-mono text-[#845E1B]">
                  ₹{priceSummary.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
