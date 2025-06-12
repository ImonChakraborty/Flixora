import { getTVShowDetails, getSeasonDetails } from '@/lib/tmdb';
import { Episode } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface WatchTVPageProps {
    params: Promise<{ id: string; season: string; episode: string }>;
}

export default async function WatchTVPage({ params }: WatchTVPageProps) {
    const { id, season, episode } = await params;
    const tvId = parseInt(id);
    const seasonNumber = parseInt(season);
    const episodeNumber = parseInt(episode);
    
    try {
        const [show, seasonDetails] = await Promise.all([
            getTVShowDetails(tvId),
            getSeasonDetails(tvId, seasonNumber)
        ]);

        if (!show || !seasonDetails) {
            notFound();
        }

        const currentEpisode = seasonDetails.episodes.find(
            (ep: Episode) => ep.episode_number === episodeNumber
        );

        if (!currentEpisode) {
            notFound();
        }

        return (
            <div className="relative h-screen w-screen bg-black">
                {/* Floating Navigation Bar */}
                <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex items-center justify-between p-4">
                        <Link 
                            href={`/tv/${id}/season/${season}`}
                            className="flex items-center space-x-2 text-white hover:text-amber-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back to Episodes</span>
                        </Link>
                        
                        <div className="text-white text-center">
                            <h1 className="text-lg md:text-xl font-bold">{show.name}</h1>
                            <p className="text-sm text-gray-300">
                                S{seasonNumber.toString().padStart(2, '0')}E{episodeNumber.toString().padStart(2, '0')} • {currentEpisode.name}
                            </p>
                            {currentEpisode.runtime && (
                                <p className="text-xs text-gray-400">{currentEpisode.runtime}m</p>
                            )}
                        </div>
                        
                        <div className="w-24"></div> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Video Player - Full Screen */}
                <VideoPlayer
                    type="tv"
                    tmdbId={tvId}
                    season={seasonNumber}
                    episode={episodeNumber}
                    className="h-screen w-screen"
                    color="F59E0B"
                    nextEpisode={true}
                    episodeSelector={true}
                    autoplayNextEpisode={true}
                    backdropPath={show.backdrop_path}
                    title={`${show.name} - S${seasonNumber.toString().padStart(2, '0')}E${episodeNumber.toString().padStart(2, '0')}`}
                    autoStart={true}
                />
            </div>
        );
    } catch (error) {
        console.error('Error loading TV show details:', error);
        notFound();
    }
}
