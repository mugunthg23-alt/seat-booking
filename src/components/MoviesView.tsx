import React, { useState, useMemo } from 'react';
import { Movie, Language, Genre } from '../types';
import { MOVIES } from '../data/seedData';
import { getMoviePosterDataUrl } from '../utils/posters';
import { Search, Star, Clock, Filter, Eye } from 'lucide-react';

interface MoviesViewProps {
  onSelectMovie: (movie: Movie) => void;
  cityName: string;
  onOpenCityModal: () => void;
}

const ALL_LANGUAGES: Language[] = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'];
const ALL_GENRES: Genre[] = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Romance', 'Comedy'];

export const MoviesView: React.FC<MoviesViewProps> = ({
  onSelectMovie,
  cityName,
  onOpenCityModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesGenre = movie.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesGenre) return false;
      }
      if (selectedLanguage !== 'All' && !movie.languages.includes(selectedLanguage)) {
        return false;
      }
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedLanguage, selectedGenre]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
      {/* Hero Banner / Pitch */}
      <div className="mb-10 text-left border-b border-[#E2DDD3] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0D9] border border-[#E8D4A8] text-xs text-[#845E1B] font-mono font-bold mb-4 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-[#C8A35B]" />
            <span>Interactive 3D Sightline Engine Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#0E1424] leading-[1.15]">
            See the screen from your seat before you pay.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed">
            Real cinema auditoriums in <span className="text-[#845E1B] font-bold underline decoration-[#C8A35B] underline-offset-4">{cityName}</span> with photorealistic seated perspective, distance metrics, and live seat hold sync.
          </p>
        </div>

        {/* Change City Banner Callout */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCityModal}
            className="px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#C8A35B] text-xs font-semibold text-[#0E1424] hover:text-[#845E1B] transition-colors shadow-sm"
          >
            Location: <span className="font-bold text-[#845E1B]">{cityName}</span> (Change)
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies by title, genre..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs sm:text-sm text-[#0E1424] placeholder-[#94A3B8] focus:outline-none focus:border-[#C8A35B] shadow-sm transition-colors"
            />
          </div>

          <div className="text-xs text-[#64748B] font-mono font-medium">
            Showing {filteredMovies.length} of {MOVIES.length} titles
          </div>
        </div>

        {/* Language Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#475569] shrink-0 font-bold mr-1">Language:</span>
          <button
            type="button"
            onClick={() => setSelectedLanguage('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedLanguage === 'All'
                ? 'bg-[#0E1424] text-white'
                : 'bg-white text-[#475569] hover:bg-[#F1EFEA] border border-[#CBD5E1]'
            }`}
          >
            All
          </button>
          {ALL_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                selectedLanguage === lang
                  ? 'bg-[#0E1424] text-white'
                  : 'bg-white text-[#475569] hover:bg-[#F1EFEA] border border-[#CBD5E1]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Genre Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#475569] shrink-0 font-bold mr-1">Genre:</span>
          <button
            type="button"
            onClick={() => setSelectedGenre('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedGenre === 'All'
                ? 'bg-[#0E1424] text-white'
                : 'bg-white text-[#475569] hover:bg-[#F1EFEA] border border-[#CBD5E1]'
            }`}
          >
            All Genres
          </button>
          {ALL_GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                selectedGenre === genre
                  ? 'bg-[#0E1424] text-white'
                  : 'bg-white text-[#475569] hover:bg-[#F1EFEA] border border-[#CBD5E1]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Poster Grid */}
      {filteredMovies.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-[#CBD5E1] rounded-xl bg-white">
          <Filter className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#0E1424] font-bold">No movies found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Try adjusting your search query or language filter to discover available releases.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('All');
              setSelectedGenre('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#C8A35B] text-[#0E1424] text-xs font-bold shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {filteredMovies.map((movie) => {
            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group flex flex-col bg-white border border-[#E2DDD3] hover:border-[#C8A35B] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Poster 2:3 Aspect Ratio Card */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={getMoviePosterDataUrl(movie.id)}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/75 text-white backdrop-blur-sm border border-white/20 shadow-sm">
                      {movie.certificate}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/75 text-[#C8A35B] backdrop-blur-sm border border-[#C8A35B]/40 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-[#C8A35B]" />
                      <span>{movie.rating}</span>
                    </span>
                  </div>

                  {/* Bottom Strip Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-6 z-10 flex items-center justify-between text-[11px] font-mono text-white">
                    <span className="text-[#C8A35B] font-bold">{movie.primaryLanguage}</span>
                    <span className="flex items-center gap-1 text-white/90">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{movie.runtimeMin}m</span>
                    </span>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#0E1424] group-hover:text-[#845E1B] transition-colors truncate">
                      {movie.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5 font-medium">
                      {movie.genres.join(', ')}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 px-3 rounded-lg bg-[#FAF0D9] group-hover:bg-[#C8A35B] group-hover:text-[#0E1424] border border-[#E8D4A8] group-hover:border-[#C8A35B] text-xs font-bold text-[#845E1B] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Select & View in 3D</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
