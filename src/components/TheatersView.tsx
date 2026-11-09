import React, { useState, useMemo } from 'react';
import { Movie, Show, Format } from '../types';
import { THEATERS, generateShowsForMovieAndCity, getAvailableDates, CITIES } from '../data/seedData';
import { getMoviePosterDataUrl } from '../utils/posters';
import {
  Clock,
  MapPin,
  ArrowLeft,
  Flame,
} from 'lucide-react';

interface TheatersViewProps {
  movie: Movie;
  cityId: string;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onSelectShow: (show: Show) => void;
  onBack: () => void;
}

export const TheatersView: React.FC<TheatersViewProps> = ({
  movie,
  cityId,
  selectedDate,
  onSelectDate,
  onSelectShow,
  onBack,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<Format | 'All'>('All');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<
    'All' | 'Morning' | 'Afternoon' | 'Evening' | 'Night'
  >('All');

  const availableDates = useMemo(() => getAvailableDates(), []);
  const currentCity = CITIES.find((c) => c.id === cityId) || CITIES[0];

  const allShows = useMemo(() => {
    return generateShowsForMovieAndCity(movie.id, cityId, selectedDate);
  }, [movie.id, cityId, selectedDate]);

  const theatersWithShows = useMemo(() => {
    const cityTheaters = THEATERS.filter((t) => t.cityId === cityId);

    return cityTheaters
      .map((theater) => {
        let shows = allShows.filter((s) => s.theaterId === theater.id);

        if (selectedFormat !== 'All') {
          shows = shows.filter((s) => s.format === selectedFormat);
        }
        if (selectedTimeOfDay !== 'All') {
          shows = shows.filter((s) => s.timeOfDay === selectedTimeOfDay);
        }

        return {
          theater,
          shows,
        };
      })
      .filter((item) => item.shows.length > 0 || selectedFormat === 'All');
  }, [cityId, allShows, selectedFormat, selectedTimeOfDay]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1">
      {/* Back Button */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F1EFEA] border border-[#CBD5E1] text-[#475569] hover:text-[#0E1424] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies</span>
        </button>
      </div>

      {/* Movie Summary Strip */}
      <div className="bg-white border border-[#E2DDD3] rounded-xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-24 rounded-lg overflow-hidden border border-[#CBD5E1] shrink-0 shadow bg-[#FAF8F5]">
            <img
              src={getMoviePosterDataUrl(movie.id)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-[#0E1424]">
                {movie.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#CBD5E1] font-mono font-bold text-[#475569]">
                {movie.certificate}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              {movie.languages.join(', ')} • {movie.genres.join(', ')} • {movie.runtimeMin} mins
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-[#845E1B] font-mono font-bold">★ {movie.rating}/10</span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#475569] font-medium">Theaters in {currentCity.name}</span>
            </div>
          </div>
        </div>

        {/* Formats tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FAF0D9] border border-[#E8D4A8] text-xs font-mono font-bold text-[#845E1B]">
            IMAX 2D with Laser
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FAF0D9] border border-[#E8D4A8] text-xs font-mono font-bold text-[#845E1B]">
            Dolby Atmos 7.1
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FAF0D9] border border-[#E8D4A8] text-xs font-mono font-bold text-[#845E1B]">
            Recliner Lounges
          </span>
        </div>
      </div>

      {/* Date Selector Strip */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {availableDates.map((d) => {
          const isSelected = d.dateStr === selectedDate;
          return (
            <button
              key={d.dateStr}
              type="button"
              onClick={() => onSelectDate(d.dateStr)}
              className={`flex flex-col items-center justify-center min-w-[80px] py-2.5 px-3 rounded-lg border text-xs transition-all shadow-sm ${
                isSelected
                  ? 'bg-[#C8A35B] text-[#0E1424] border-[#C8A35B] font-extrabold shadow-md'
                  : 'bg-white border-[#CBD5E1] text-[#475569] hover:border-[#C8A35B] hover:bg-[#FAF0D9]'
              }`}
            >
              <span className="text-[10px] tracking-wider uppercase font-bold">
                {d.displayDay}
              </span>
              <span className="text-sm font-bold mt-0.5">
                {d.displayDate}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters: Format & Time of Day */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2DDD3] text-xs">
        {/* Format filters */}
        <div className="flex items-center gap-2">
          <span className="text-[#475569] font-bold">Format:</span>
          {(['All', 'IMAX 2D', 'Dolby Atmos', '2D'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm ${
                selectedFormat === fmt
                  ? 'bg-[#0E1424] text-white'
                  : 'bg-white text-[#475569] hover:bg-[#F1EFEA] border border-[#CBD5E1]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Time of Day filters */}
        <div className="flex items-center gap-2">
          <span className="text-[#475569] font-bold">Time:</span>
          {(['All', 'Morning', 'Afternoon', 'Evening', 'Night'] as const).map((tod) => (
            <button
              key={tod}
              type="button"
              onClick={() => setSelectedTimeOfDay(tod)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm ${
                selectedTimeOfDay === tod
                  ? 'bg-[#0E1424] text-white'
                  : 'bg-white text-[#475569] hover:bg-[#F1EFEA] border border-[#CBD5E1]'
              }`}
            >
              {tod}
            </button>
          ))}
        </div>
      </div>

      {/* Theaters List with Showtimes */}
      <div className="space-y-6">
        {theatersWithShows.length === 0 ? (
          <div className="py-16 text-center border border-[#CBD5E1] rounded-xl bg-white shadow-sm">
            <Clock className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0E1424]">No shows matching your filter criteria</p>
            <p className="text-xs text-[#64748B] mt-1">
              Try resetting format or time-of-day filters to see all available theater screenings.
            </p>
          </div>
        ) : (
          theatersWithShows.map(({ theater, shows }) => (
            <div
              key={theater.id}
              className="bg-white border border-[#E2DDD3] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Theater Information */}
              <div className="md:w-1/3">
                <div className="flex items-center gap-1.5 text-xs text-[#845E1B] font-mono font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#C8A35B]" />
                  <span>{theater.area}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0E1424] mt-0.5">
                  {theater.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                  {theater.address}
                </p>
              </div>

              {/* Showtime Pills */}
              <div className="md:w-2/3 flex flex-wrap gap-3 items-center">
                {shows.map((show) => {
                  return (
                    <button
                      key={show.id}
                      type="button"
                      onClick={() => onSelectShow(show)}
                      className="group flex flex-col items-center p-3 min-w-[130px] rounded-lg border-2 border-[#CBD5E1] bg-[#FAF8F5] hover:bg-[#FAF0D9] hover:border-[#C8A35B] transition-all text-left shadow-sm"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-mono text-sm font-extrabold text-[#0E1424] group-hover:text-[#845E1B]">
                          {show.timeStr}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#845E1B] font-bold">
                          {show.format}
                        </span>
                      </div>

                      <div className="w-full flex items-center justify-between text-[11px] text-[#475569] pt-1.5 border-t border-[#E2DDD3] font-medium">
                        <span>{show.availability}</span>
                        {show.availability === 'Almost full' && (
                          <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
