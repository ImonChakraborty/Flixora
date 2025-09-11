'use client';

import OptimizedImage from './OptimizedImage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Film, Star, ArrowRight, Search } from 'lucide-react';

interface Suggestion {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  year: number | null;
  poster_path: string | null;
  vote_average: number;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: Suggestion) => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function SearchSuggestions({ query, onSelect, onClose, isVisible }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isVisible || (!loading && suggestions.length === 0 && query.trim().length >= 2)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-gray-700/50 shadow-2xl backdrop-blur-lg z-50 max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm">Searching...</span>
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion) => {
            const href = suggestion.type === 'movie' ? `/movies/${suggestion.id}` : `/tv/${suggestion.id}`;
            return (
              <Link
                key={`${suggestion.type}-${suggestion.id}`}
                href={href}
                onClick={() => {
                  onSelect(suggestion);
                  onClose();
                }}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-all duration-200 border-b border-gray-700/30 last:border-b-0 group"
              >
                <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                  {suggestion.poster_path ? (
                    <OptimizedImage
                      src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                      alt={suggestion.title}
                      className="object-cover w-full h-full"
                      width={92}
                      height={138}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                      <Film className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors duration-200 truncate text-sm">
                    {suggestion.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {suggestion.year || 'N/A'}
                    </span>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <span className="text-xs text-gray-400 uppercase">
                      {suggestion.type}
                    </span>
                    {suggestion.vote_average > 0 && (
                      <>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                          <span className="text-xs text-yellow-400">
                            {suggestion.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              </Link>
            );
          })}
          
          {query.trim().length >= 2 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-center space-x-2 px-4 py-3 hover:bg-white/5 transition-all duration-200 border-t border-gray-700/30 text-amber-400 hover:text-amber-300 group"
            >
              <span className="text-sm font-medium">See all results for &quot;{query}&quot;</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="p-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Search className="w-8 h-8 text-gray-500" />
            <span className="text-gray-400 text-sm">No suggestions found</span>
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-amber-400 hover:text-amber-300 text-sm font-medium hover:underline transition-colors duration-200"
            >
              Search anyway
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
