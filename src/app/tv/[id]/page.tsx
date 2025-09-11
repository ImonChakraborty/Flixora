import { getTVShowDetails } from '@/lib/tmdb';
import { TVShowDetails, CastMember, Video, Genre, ProductionCompany, CreatedBy, Season, Network } from '@/lib/types';
import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';
import { Star, Play, Film, Disc } from 'lucide-react';

interface TVShowDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function TVShowDetailsPage({ params }: TVShowDetailsPageProps) {
    const { id } = await params;
    const show: TVShowDetails = await getTVShowDetails(parseInt(id));

    if (!show) {
        return <div className="container mx-auto px-4 py-8 text-white">TV Show not found</div>;
    }

    const creators = show.created_by || [];
    const trailer = show.videos.results.find((video: Video) => video.type === 'Trailer' && video.site === 'YouTube');
    const startYear = show.first_air_date?.substring(0, 4);
    const endYear = show.last_air_date?.substring(0, 4);
    const yearRange = startYear && endYear && startYear !== endYear ? `${startYear}-${endYear}` : startYear;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section with Background Image */}
            <div
                className="relative h-[50vh] md:h-[70vh] bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.5), rgba(17, 24, 39, 1)), url(https://image.tmdb.org/t/p/w1280${show.backdrop_path})`,
                }}
            >
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{show.name}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="text-lg">{yearRange}</span>
                        {show.number_of_seasons && (
                            <span className="text-lg">
                                {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                            </span>
                        )}
                        {/* Add content rating if available in your API and types */}
                        <span className="border border-white px-2 py-0.5 rounded text-sm">
                            {show.adult ? '18+' : 'TV-14'}
                        </span>
                        <div className="flex items-center space-x-1">
                            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                            <span className="text-lg">{show.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                    <p className="text-lg md:w-2/3 lg:w-1/2 mb-6 hidden md:block">{show.overview}</p>
                    <div className="flex space-x-4">
                        <Link href={`/watch/tv/${show.id}/1/1`}>
                            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25">
                                <Play className="w-6 h-6" fill="currentColor" />
                                <span>Play Latest</span>
                            </button>
                        </Link>
                        {trailer && (
                            <Link href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank">
                                <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-all duration-300">
                                    <Disc className="w-6 h-6" />
                                    <span>Trailer</span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 md:px-8 py-8">
                {/* Overview for mobile */}
                <div className="md:hidden mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                    <p className="text-base">{show.overview}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column / Main Info */}
                    <div className="lg:col-span-3">
                        {/* Seasons */}
                        {show.seasons && show.seasons.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold mb-4">Seasons</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {show.seasons
                                        .filter((season: Season) => season.season_number > 0) // Filter out specials
                                        .sort((a: Season, b: Season) => a.season_number - b.season_number)
                                        .map((season: Season) => (
                                        <Link key={season.id} href={`/tv/${show.id}/season/${season.season_number}`} className="block group">
                                            <div className="glass rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105 border border-gray-700/50 hover:border-amber-500/30">
                                                <div className="relative aspect-[2/3] overflow-hidden">
                                                    {season.poster_path ? (
                                                        <OptimizedImage
                                                            src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                                                            alt={season.name}
                                                            width={300}
                                                            height={450}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
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
                                                            <Play className="w-8 h-8 text-gray-900" />
                                                        </div>
                                                    </div>

                                                    {/* Episode count badge */}
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V10.125c0-.621.504-1.125 1.125-1.125m2.25 0h3.75c.621 0 1.125.504 1.125 1.125M9.375 8.25H11.25c.621 0 1.125.504 1.125 1.125v4.75c0 .621-.504 1.125-1.125 1.125H9.375A1.125 1.125 0 0 1 8.25 14V9.375c0-.621.504-1.125 1.125-1.125Z" />
                                                        </svg>
                                                        <span className="text-xs font-medium text-white">{season.episode_count}</span>
                                                    </div>
                                                </div>

                                                <div className="p-4 space-y-2">
                                                    <h4 className="font-semibold text-white truncate group-hover:text-amber-400 transition-colors duration-300 leading-tight" title={season.name}>
                                                        {season.name}
                                                    </h4>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-gray-400 font-medium">
                                                            {season.episode_count} Episode{season.episode_count !== 1 ? 's' : ''}
                                                        </p>
                                                        {season.air_date && (
                                                            <p className="text-xs text-gray-500 font-medium">{season.air_date.substring(0, 4)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                            <p className="text-base">{show.overview}</p>
                        </div>

                        {/* Seasons and Episodes can be added here if desired */}
                    </div>

                    {/* Right Column / Additional Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Status:</strong> {show.status}</p>
                            <p><strong>First Air Date:</strong> {show.first_air_date}</p>
                            {show.last_air_date && show.last_air_date !== show.first_air_date && (
                                <p><strong>Last Air Date:</strong> {show.last_air_date}</p>
                            )}
                            {show.number_of_episodes && <p><strong>Total Episodes:</strong> {show.number_of_episodes}</p>}
                            {show.number_of_seasons && <p><strong>Seasons:</strong> {show.number_of_seasons}</p>}
                            {show.episode_run_time && show.episode_run_time.length > 0 && (
                                <p><strong>Episode Runtime:</strong> {show.episode_run_time[0]} min</p>
                            )}
                            <p><strong>Original Language:</strong> {show.original_language?.toUpperCase()}</p>
                            {show.in_production !== undefined && (
                                <p><strong>In Production:</strong> {show.in_production ? 'Yes' : 'No'}</p>
                            )}
                            {show.homepage && <p><strong>Homepage:</strong> <Link href={show.homepage} target="_blank" className="text-red-400 hover:underline">Visit</Link></p>}
                        </div>

                        {/* Networks */}
                        {show.networks && show.networks.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Networks</h3>
                                <div className="flex flex-wrap gap-2">
                                    {show.networks.map((network: Network) => (
                                        network.logo_path ? (
                                            <div key={network.id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors" title={network.name}>
                                                <OptimizedImage
                                                    src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                                                    alt={network.name}
                                                    width={20}
                                                    height={20}
                                                    className="object-contain h-4 w-auto max-w-6"
                                                />
                                                <span className="text-xs font-medium text-gray-200">{network.name}</span>
                                            </div>
                                        ) : (
                                            <span key={network.id} className="text-xs px-2 py-1 bg-gray-800 rounded-md font-medium text-gray-200 hover:bg-gray-700 transition-colors">
                                                {network.name}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Production Companies */}
                        {show.production_companies && show.production_companies.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Production</h3>
                                <div className="flex flex-wrap gap-2">
                                    {show.production_companies.map((company: ProductionCompany) => (
                                        company.logo_path ? (
                                            <div key={company.id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors" title={company.name}>
                                                <OptimizedImage
                                                    src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                                    alt={company.name}
                                                    width={20}
                                                    height={20}
                                                    className="object-contain h-4 w-auto max-w-6"
                                                />
                                                <span className="text-xs font-medium text-gray-200">{company.name}</span>
                                            </div>
                                        ) : (
                                            <span key={company.id} className="text-xs px-2 py-1 bg-gray-800 rounded-md font-medium text-gray-200 hover:bg-gray-700 transition-colors">
                                                {company.name}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Last Episode */}
                        {show.last_episode_to_air && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Latest Episode</h3>
                                <div className="bg-gray-800 rounded-lg p-3">
                                    <h4 className="font-semibold text-sm">{show.last_episode_to_air.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Season {show.last_episode_to_air.season_number}, Episode {show.last_episode_to_air.episode_number}
                                    </p>
                                    <p className="text-xs text-gray-400">{show.last_episode_to_air.air_date}</p>
                                </div>
                            </div>
                        )}

                        {/* Next Episode */}
                        {show.next_episode_to_air && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Next Episode</h3>
                                <div className="bg-gray-800 rounded-lg p-3">
                                    <h4 className="font-semibold text-sm">{show.next_episode_to_air.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Season {show.next_episode_to_air.season_number}, Episode {show.next_episode_to_air.episode_number}
                                    </p>
                                    <p className="text-xs text-gray-400">{show.next_episode_to_air.air_date}</p>
                                </div>
                            </div>
                        )}

                        {/* Creators */}
                        {creators && creators.length > 0 && (
                            <div className="mb-6 mt-8">
                                <h3 className="text-xl font-semibold mb-2">Created by</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {creators.map((creator: CreatedBy) => (
                                        <p key={creator.id}>{creator.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Genres */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {show.genres.map((genre: Genre) => (
                                    <span key={genre.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Cast */}
                        {show.credits.cast && show.credits.cast.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">Top Cast</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {show.credits.cast.slice(0, 10).map((actor: CastMember) => (
                                        <div key={actor.credit_id} className="text-center">
                                            {actor.profile_path ? (
                                                <div className="w-[100px] h-[150px] mx-auto mb-1">
                                                    <OptimizedImage
                                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                        alt={actor.name}
                                                        width={185}
                                                        height={278}
                                                        className="rounded-lg"
                                                        aspectRatio="2/3"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-[100px] h-[150px] bg-gray-700 rounded-lg mx-auto flex items-center justify-center mb-1">
                                                    <span className="text-xs text-gray-400">No Image</span>
                                                </div>
                                            )}
                                            <p className="text-sm font-medium">{actor.name}</p>
                                            <p className="text-xs text-gray-400">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
