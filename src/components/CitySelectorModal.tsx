import React, { useState } from 'react';
import { CityId } from '../types';
import { CITIES } from '../data/seedData';
import { MapPin, Navigation, X, Check, AlertCircle } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  currentCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
  onClose: () => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  currentCityId,
  onSelectCity,
  onClose,
}) => {
  const [detecting, setDetecting] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetecting(false);
        const { latitude, longitude } = pos.coords;

        let nearestCity = CITIES[0];
        let minDistance = Infinity;

        CITIES.forEach((city) => {
          const dist = getDistanceKm(latitude, longitude, city.lat, city.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestCity = city;
          }
        });

        if (minDistance > 1200) {
          setGeoNotice(
            `You appear to be ~${Math.round(minDistance)}km away. SeatView POC currently supports Chennai, Bangalore, and Mumbai. Please pick one below.`
          );
        } else {
          onSelectCity(nearestCity.id);
          onClose();
        }
      },
      (err) => {
        setDetecting(false);
        setGeoNotice('Could not retrieve coordinates. Please select your city manually below.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-[#E2DDD3] rounded-2xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F1EFEA] text-[#64748B] hover:text-[#0E1424] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-mono tracking-widest text-[#845E1B] uppercase font-bold">
            Location Selection
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#0E1424] mt-1">
            Choose Your City
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Real theater audis in Chennai, Bangalore, and Mumbai with exact 3D sightline mapping.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="w-full mb-5 py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF0D9] border-2 border-[#CBD5E1] hover:border-[#C8A35B] text-[#0E1424] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 text-[#C8A35B] ${detecting ? 'animate-spin' : ''}`} />
          <span>{detecting ? 'Detecting coordinates...' : 'Use My Current Location'}</span>
        </button>

        {geoNotice && (
          <div className="mb-4 p-3 rounded-lg bg-[#FAF0D9] border border-[#E8D4A8] text-xs text-[#845E1B] flex items-start gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-[#A17424] shrink-0 mt-0.5" />
            <span>{geoNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CITIES.map((city) => {
            const isSelected = city.id === currentCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  onSelectCity(city.id);
                  onClose();
                }}
                className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#C8A35B] bg-[#FAF0D9] shadow-md ring-2 ring-[#C8A35B]'
                    : 'border-[#CBD5E1] bg-white hover:border-[#C8A35B] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <MapPin
                    className={`w-4 h-4 ${isSelected ? 'text-[#845E1B]' : 'text-[#64748B]'}`}
                  />
                  {isSelected && <Check className="w-4 h-4 text-[#845E1B] stroke-[3]" />}
                </div>
                <span className="font-serif text-base font-bold text-[#0E1424]">
                  {city.name}
                </span>
                <span className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                  {city.state}
                </span>
                <span className="mt-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#845E1B]">
                  {city.theatersCount} Theaters
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
