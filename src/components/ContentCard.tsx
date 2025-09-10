import OptimizedImage from './OptimizedImage';
import Link from 'next/link';
import { Movie, Series } from '@/lib/types';
import { Film, Play, Star } from 'lucide-react';

interface ContentCardProps {
  item: Movie | Series;
  type: 'movie' | 'tv';
  priority?: boolean; // For above-the-fold images
}

export default function ContentCard({ item, type, priority = false }: ContentCardProps) {
  const title = type === 'movie' ? (item as Movie).title : (item as Series).name;
  const releaseDate = type === 'movie' ? (item as Movie).release_date : (item as Series).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  // Ensure URL uses correct plural form for movies
  const baseUrl = type === 'movie' ? '/movies' : '/tv';

  return (
    <Link href={`${baseUrl}/${item.id}`} className="block group">
      <div className="content-card glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105 border border-gray-700/50 hover:border-amber-500/30 animate-fade-in-up">
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <OptimizedImage
              src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
              alt={title}
              className="group-hover:scale-110 transition-transform duration-700 ease-out"
              aspectRatio="2/3"
              width={300}
              height={450}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Film className="w-12 h-12 text-gray-500" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <div className="bg-amber-500/90 backdrop-blur-sm rounded-full p-3 shadow-2xl">
              <Play className="w-8 h-8 text-gray-900" fill="currentColor" />
            </div>
          </div>

          {/* Rating badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-xs font-medium text-white">{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-amber-400 transition-colors duration-300 leading-tight" title={title}>
            {title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400 font-medium">{year}</p>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">{type}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
