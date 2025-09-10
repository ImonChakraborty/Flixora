'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import SearchSuggestions from './SearchSuggestions';
import { Search, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSuggestionSelect = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.trim().length >= 2);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-700/50 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group" title="Go to Homepage">
              <div className="relative">
                <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:via-orange-300 group-hover:to-red-400 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] group-hover:scale-105 transform inline-block font-mono">
                  FLIX
                </span>
                <span className="text-3xl font-black tracking-tight text-white group-hover:text-gray-200 transition-all duration-300 font-mono">
                  ORA
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </Link>
          </div>

          {/* Centered Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4 lg:px-8">
            <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Search movies, TV shows..."
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all duration-300 text-sm shadow-lg focus:shadow-amber-500/25 pl-12 backdrop-blur-sm"
                />
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-110" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              
              <SearchSuggestions
                query={searchQuery}
                onSelect={handleSuggestionSelect}
                onClose={() => setShowSuggestions(false)}
                isVisible={showSuggestions && isFocused}
              />
            </div>
          </div>

          {/* Navigation Links (Right side) */}
          <div className="hidden md:flex items-center space-x-1 flex-shrink-0">
            <Link href="/movies" className="text-gray-300 hover:text-amber-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm">
              Movies
            </Link>
            <Link href="/tv" className="text-gray-300 hover:text-amber-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm">
              TV Shows
            </Link>
          </div>
        </div>

        {/* Mobile Search Form */}
        <div ref={mobileSearchRef} className="md:hidden pt-3 pb-4 border-t border-gray-700/30 relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search movies or TV shows..."
                className="w-full p-4 pl-12 rounded-xl glass text-white placeholder-gray-300 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all duration-300 text-sm shadow-lg"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <Search className="w-5 h-5" />
              </div>
            </div>
          </form>
          
          <SearchSuggestions
            query={searchQuery}
            onSelect={handleSuggestionSelect}
            onClose={() => setShowSuggestions(false)}
            isVisible={showSuggestions && isFocused}
          />
        </div>
      </div>
    </nav>
  );
}
