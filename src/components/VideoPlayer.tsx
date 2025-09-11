'use client';

import { useEffect, useState } from 'react';
import { Provider } from '@/providercontext/types';
import { agent } from '@/providercontext/agent';
import { vidsrc } from '@/providercontext/vidsrc';
import { embedsu } from '@/providercontext/embedsu';
import { vidlink } from '@/providercontext/vidlink';
import { smashy } from '@/providercontext/smashy';
import { moviekex } from '@/providercontext/moviekex';
import { Play, Star, Film } from 'lucide-react';

// Create providers array directly
const allProviders: Provider[] = [agent, vidsrc, embedsu, vidlink, smashy, moviekex];

// Debug log to check if providers are loaded
console.log('Providers loaded:', allProviders);

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  className?: string;
  color?: string;
  autoplayNextEpisode?: boolean;
  episodeSelector?: boolean;
  nextEpisode?: boolean;
  startTime?: number;
  backdropPath?: string | null;
  title?: string;
  autoStart?: boolean;
  genres?: Array<{ id: number; name: string }>;
}

interface ProgressData {
  id: number;
  type: string;
  progress: number;
  timestamp: number;
  duration: number;
  season?: number;
  episode?: number;
}

export default function VideoPlayer({
  type,
  tmdbId,
  season,
  episode,
  className = '',
  color = '8B5CF6',
  autoplayNextEpisode = false,
  episodeSelector = false,
  nextEpisode = false,
  startTime,
  backdropPath,
  title,
  autoStart = false,
  genres = [],
}: VideoPlayerProps) {
  const [isVisible, setIsVisible] = useState(autoStart);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Set the first provider when providers are loaded
  useEffect(() => {
    console.log('useEffect - allProviders:', allProviders);
    console.log('useEffect - allProviders length:', allProviders?.length);
    console.log('useEffect - selectedProvider:', selectedProvider);
    
    if (allProviders && allProviders.length > 0 && !selectedProvider) {
      console.log('Setting first provider:', allProviders[0]);
      setSelectedProvider(allProviders[0]);
    }
  }, [selectedProvider]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const endpoint = type === 'movie' ? 'movie' : 'tv';
        const response = await fetch(`/api/recommendations/${endpoint}/${tmdbId}`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.results || []);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      }
    };

    if (tmdbId) {
      fetchRecommendations();
    }
  }, [tmdbId, type]);

  const getPlayerUrl = () => {
    if (!selectedProvider) return '';
    
    if (type === 'movie') {
      return selectedProvider.getMovie(String(tmdbId));
    }
    if (type === 'tv' && season && episode) {
      return selectedProvider.getEpisode(String(tmdbId), season, episode);
    }
    return '';
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!selectedProvider) return;
      
      try {
        if (typeof event.data === 'string') {
          const data: ProgressData = JSON.parse(event.data);
          console.log(`Progress received from ${selectedProvider.name} player:`, data);
          const key = type === 'movie' ? `movie_${tmdbId}` : `tv_${tmdbId}_${data.season}_${data.episode}`;
          localStorage.setItem(`${selectedProvider.name}_progress_${key}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error parsing message from player:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tmdbId, type, selectedProvider]);

  const playerUrl = getPlayerUrl();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="w-full">
        {/* Cinema Mode Video Player Container */}
        <div className="w-full bg-black pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="aspect-video w-full max-w-6xl mx-auto">
              {isVisible ? (
                <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl">
                  {playerUrl && (
                    <iframe
                      src={playerUrl}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="w-full h-full border-0"
                    ></iframe>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full bg-cover bg-center rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden group"
                  style={{ 
                    backgroundImage: backdropPath ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${backdropPath})` : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  }}
                  onClick={() => setIsVisible(true)}
                >
                  <div className="text-center z-10">
                    {title && <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">{title}</h2>}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500 hover:bg-amber-600 rounded-full transition-all duration-300 group-hover:scale-110 shadow-2xl">
                      <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                    </div>
                    <p className="text-xl text-white mt-6 drop-shadow">Click to play</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Container - Scrollable */}
        <div className="bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            
            {/* Movie Title */}
            {title && (
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                  {title}
                </h1>
                <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
              </div>
            )}
            
            {/* Sources Section - Cinema Style */}
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Choose Your Source</h3>
                <p className="text-gray-400">Select a streaming server to begin watching</p>
              </div>
              
              {/* Horizontally Scrollable Sources */}
              <div className="overflow-x-auto pb-2 pt-2">
                <div className="flex gap-4 min-w-max px-4">
                  {allProviders && allProviders.length > 0 ? (
                    allProviders.map((provider: Provider, index: number) => (
                      <div
                        key={provider.name}
                        onClick={() => setSelectedProvider(provider)}
                        className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                          selectedProvider?.name === provider.name ? 'scale-105' : 'hover:scale-102'
                        }`}
                        style={{ aspectRatio: '3/2' }}
                      >
                        <div className={`w-48 h-32 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                          selectedProvider?.name === provider.name
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black'
                            : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 border border-gray-600/50'
                        }`}>
                          {/* Server Icon */}
                          <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center ${
                            selectedProvider?.name === provider.name ? 'bg-black/20' : 'bg-amber-500/20'
                          }`}>
                            <Star className={`w-4 h-4 ${selectedProvider?.name === provider.name ? 'text-black' : 'text-amber-500'}`} fill="currentColor" />
                          </div>
                          
                          {/* Provider Name */}
                          <h4 className="text-lg font-bold mb-1">{provider.name}</h4>
                          <p className={`text-xs ${selectedProvider?.name === provider.name ? 'text-black/70' : 'text-gray-400'}`}>
                            Server {index + 1}
                          </p>
                          
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-48 h-32 rounded-xl bg-gray-800 border border-gray-600/50 flex items-center justify-center">
                      <p className="text-gray-400 text-sm text-center">No sources available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Content Section */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">More Like This</h2>
                <p className="text-gray-400">Discover similar content you might enjoy</p>
              </div>
              
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {recommendations.map((item) => (
                    <a
                      key={item.id}
                      href={`/${type}/${item.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border border-gray-700/30">
                        {item.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-300 mt-3 group-hover:text-white transition-colors line-clamp-2 text-center">
                        {item.title || item.name}
                      </h3>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="group animate-pulse">
                      <div className="aspect-[2/3] bg-gray-800 rounded-xl border border-gray-700/30"></div>
                      <div className="h-4 bg-gray-800 rounded mt-3 mx-auto w-3/4"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}