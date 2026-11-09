import React, { useState } from 'react';
import { useSeatViewStore } from './store/useStore';
import { Header } from './components/Header';
import { CitySelectorModal } from './components/CitySelectorModal';
import { LoginModal } from './components/LoginModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { MoviesView } from './components/MoviesView';
import { TheatersView } from './components/TheatersView';
import { SeatBookingView } from './components/SeatBookingView';
import { FnbView } from './components/FnbView';
import { CheckoutView } from './components/CheckoutView';
import { TicketView } from './components/TicketView';
import { Movie, Show, Booking, CityId } from './types';
import { THEATERS, CITIES } from './data/seedData';
import { AlertCircle } from 'lucide-react';

type ActiveView = 'movies' | 'theaters' | 'seats' | 'fnb' | 'checkout' | 'ticket';

export default function App() {
  const store = useSeatViewStore();

  const [currentView, setCurrentView] = useState<ActiveView>('movies');
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const cityName = CITIES.find((c) => c.id === store.selectedCityId)?.name || 'Chennai';
  const currentTheater = THEATERS.find((t) => t.id === store.selectedShow?.theaterId);

  const handleSelectMovie = (movie: Movie) => {
    store.setSelectedMovie(movie);
    setCurrentView('theaters');
  };

  const handleSelectShow = (show: Show) => {
    store.setSelectedShow(show);
    setCurrentView('seats');
  };

  const handleProceedToFnb = () => {
    setCurrentView('fnb');
  };

  const handleProceedToCheckout = () => {
    if (!store.currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setCurrentView('checkout');
  };

  const handlePaymentSuccess = (method: string) => {
    const booking = store.confirmBooking(method);
    if (booking) {
      setConfirmedBooking(booking);
      setCurrentView('ticket');
      return booking;
    }
    return null;
  };

  const handleSelectPastBooking = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCurrentView('ticket');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#0E1424] flex flex-col font-sans selection:bg-[#C8A35B] selection:text-[#0E1424]">
      {/* Top Header */}
      {currentView !== 'fnb' && (
        <Header
          currentCityId={store.selectedCityId}
          currentUser={store.currentUser}
          bookingsCount={store.bookings.length}
          onOpenCityModal={() => setCityModalOpen(true)}
          onOpenLoginModal={() => setLoginModalOpen(true)}
          onOpenMyBookings={() => setMyBookingsOpen(true)}
          onLogout={store.logoutUser}
          onHomeClick={() => setCurrentView('movies')}
        />
      )}

      {/* Hold Expired Modal Notice */}
      {store.holdExpiredNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white border border-[#E2DDD3] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#FAF0D9] border-2 border-[#C8A35B] flex items-center justify-center mx-auto text-[#845E1B]">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0E1424]">
              Seat Hold Released
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your 8-minute reservation window expired. The selected seats have been released back to the auditorium inventory.
            </p>
            <button
              type="button"
              onClick={() => store.setHoldExpiredNotice(false)}
              className="w-full py-3 px-4 rounded-xl bg-[#C8A35B] text-[#0E1424] text-xs font-bold hover:bg-[#b89445] shadow-md"
            >
              Choose Seats Again
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'movies' && (
          <MoviesView
            onSelectMovie={handleSelectMovie}
            cityName={cityName}
            onOpenCityModal={() => setCityModalOpen(true)}
          />
        )}

        {currentView === 'theaters' && store.selectedMovie && (
          <TheatersView
            movie={store.selectedMovie}
            cityId={store.selectedCityId}
            selectedDate={store.selectedDate}
            onSelectDate={store.setSelectedDate}
            onSelectShow={handleSelectShow}
            onBack={() => setCurrentView('movies')}
          />
        )}

        {currentView === 'seats' && store.selectedMovie && store.selectedShow && store.currentScreenConfig && (
          <SeatBookingView
            movie={store.selectedMovie}
            show={store.selectedShow}
            screenConfig={store.currentScreenConfig}
            theaterName={currentTheater?.name || 'Grand Cinema'}
            theaterArea={currentTheater?.area || 'City Center'}
            selectedSeats={store.selectedSeats}
            activePreviewSeatId={store.activePreviewSeatId}
            isOverviewMode={store.isOverviewMode}
            bookedSeatIds={store.bookedSeatIds}
            heldByOthersSeatIds={store.heldByOthersSeatIds}
            holdSecondsLeft={store.holdSecondsLeft}
            holdTimerActive={store.holdTimerActive}
            seatLimitWarning={store.seatLimitWarning}
            priceSummary={store.priceSummary}
            onToggleSeat={store.toggleSeatSelection}
            onSelectPreviewSeat={store.setActivePreviewSeatId}
            onToggleOverview={store.setIsOverviewMode}
            onBack={() => setCurrentView('theaters')}
            onProceedToCheckout={handleProceedToFnb}
          />
        )}

        {currentView === 'fnb' && store.selectedMovie && store.selectedShow && (
          <FnbView
            movie={store.selectedMovie}
            show={store.selectedShow}
            theaterName={currentTheater?.name || 'Grand Cinema'}
            theaterArea={currentTheater?.area || 'City Center'}
            selectedSeats={store.selectedSeats}
            ticketsSubtotal={store.priceSummary.subtotal}
            fnbCart={store.fnbCart}
            onUpdateFnbQuantity={store.updateFnbQuantity}
            onSkip={handleProceedToCheckout}
            onProceedToCheckout={handleProceedToCheckout}
            onBackToSeats={() => setCurrentView('seats')}
          />
        )}

        {currentView === 'checkout' && store.selectedMovie && store.selectedShow && store.currentScreenConfig && (
          <CheckoutView
            movie={store.selectedMovie}
            show={store.selectedShow}
            screenConfig={store.currentScreenConfig}
            selectedSeats={store.selectedSeats}
            currentUser={store.currentUser}
            holdSecondsLeft={store.holdSecondsLeft}
            priceSummary={store.priceSummary}
            onBackToSeats={() => setCurrentView('fnb')}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {currentView === 'ticket' && confirmedBooking && (
          <TicketView
            booking={confirmedBooking}
            onHomeClick={() => {
              store.setSelectedMovie(null);
              store.setSelectedShow(null);
              setCurrentView('movies');
            }}
            onViewIn3D={() => {
              setCurrentView('seats');
            }}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'fnb' && (
        <footer className="border-t border-[#E5E7EB] py-6 px-4 sm:px-8 text-center text-xs text-[#6B7280] bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#111827]">SeatView</span>
              <span>•</span>
              <span className="font-medium">3D Theater Proof of Concept</span>
              <span>•</span>
              <span className="text-[#F84464] font-bold">Chennai • Bangalore • Mumbai</span>
            </div>
            <div className="text-[11px] font-mono text-[#9CA3AF]">
              3D Seat Sightlines • Real Theatrical Posters • Live Hold Sync
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <CitySelectorModal
        isOpen={cityModalOpen}
        currentCityId={store.selectedCityId}
        onSelectCity={(id: CityId) => store.setCity(id)}
        onClose={() => setCityModalOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => store.loginUser(user)}
      />

      <MyBookingsModal
        isOpen={myBookingsOpen}
        bookings={store.bookings}
        onClose={() => setMyBookingsOpen(false)}
        onSelectBooking={handleSelectPastBooking}
      />
    </div>
  );
}
