import React, { useState } from 'react';
import { User } from '../types';
import { Eye, EyeOff, X, Sparkles, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: email === 'demo@seatview.app' ? 'Demo User' : formattedName,
      email,
      phone: '+91 98765 43210',
    };

    onLoginSuccess(user);
    onClose();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otpSent) {
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
      setOtpSent(true);
      setOtp('4256');
    } else {
      if (otp !== '4256' && otp.length < 4) {
        setErrorMsg('Invalid verification code.');
        return;
      }
      const user: User = {
        id: `usr-${Date.now().toString(36)}`,
        name: 'Movie Enthusiast',
        email: `${phone.slice(-4)}@seatview.app`,
        phone,
      };
      onLoginSuccess(user);
      onClose();
    }
  };

  const fillDemoAccount = () => {
    setAuthMode('email');
    setEmail('demo@seatview.app');
    setPassword('Demo@1234');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white border border-[#E2DDD3] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-[#F1EFEA] text-[#64748B] hover:text-[#0E1424] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Brand Panel */}
        <div className="hidden md:flex md:col-span-5 bg-[#FAF8F5] border-r border-[#E2DDD3] p-8 flex-col justify-between relative overflow-hidden">
          <div>
            <div className="w-10 h-10 rounded-xl border-2 border-[#C8A35B] bg-[#FAF0D9] flex items-center justify-center text-[#845E1B] mb-6 shadow-sm">
              <span className="font-serif font-black text-xl">S</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0E1424] leading-tight mb-2">
              See Your Screen View in 3D
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Never gamble on distance, side angles, or blocked sightlines again. Step into real auditoriums before you book.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E2DDD3] text-xs text-[#475569]">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#C8A35B]" />
              <span>Real auditorium layouts & rake</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-[#C8A35B]" />
              <span>Field of view & sightline calculation</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <span className="text-[10px] font-mono tracking-widest text-[#845E1B] uppercase font-bold">
              Member Sign In
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0E1424] mt-1">
              Welcome to SeatView
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Sign in to manage held seats and save ticket history.
            </p>
          </div>

          {/* 1-Click Demo Button */}
          <div className="mb-5 p-3 rounded-xl bg-[#FAF0D9] border border-[#E8D4A8] flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-[#845E1B]">Instant Reviewer Account</p>
              <p className="text-[11px] font-mono text-[#64748B]">demo@seatview.app • Demo@1234</p>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#C8A35B] text-[#0E1424] font-bold hover:bg-[#b89445] transition-colors shadow-sm"
            >
              Fill Demo
            </button>
          </div>

          {/* Toggle Email vs Phone */}
          <div className="flex border-b border-[#E2DDD3] mb-5 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setErrorMsg(null);
              }}
              className={`pb-2.5 px-3 font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                authMode === 'email'
                  ? 'border-[#C8A35B] text-[#845E1B]'
                  : 'border-transparent text-[#64748B] hover:text-[#0E1424]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setErrorMsg(null);
              }}
              className={`pb-2.5 px-3 font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                authMode === 'phone'
                  ? 'border-[#C8A35B] text-[#845E1B]'
                  : 'border-transparent text-[#64748B] hover:text-[#0E1424]'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Mobile OTP</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] font-medium">
              {errorMsg}
            </div>
          )}

          {authMode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0E1424] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#0E1424]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#64748B] hover:text-[#0E1424] flex items-center gap-1 font-medium"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#C8A35B] hover:bg-[#b89445] text-[#0E1424] font-extrabold text-xs transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0E1424] mb-1">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-[#CBD5E1] bg-[#FAF8F5] text-xs text-[#475569] font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    disabled={otpSent}
                    className="w-full px-3.5 py-2.5 rounded-r-lg bg-white border border-[#CBD5E1] text-sm text-[#0E1424] focus:outline-none focus:border-[#C8A35B] shadow-sm"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#0E1424]">
                      Verification Code (OTP)
                    </label>
                    <span className="text-[11px] font-mono text-[#845E1B] font-bold">
                      Auto-filled: 4256
                    </span>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="4256"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-mono tracking-widest text-[#0E1424] text-center font-bold focus:outline-none focus:border-[#C8A35B] shadow-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#C8A35B] hover:bg-[#b89445] text-[#0E1424] font-extrabold text-xs transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
              >
                <span>{otpSent ? 'Verify & Sign In' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
