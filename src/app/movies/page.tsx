// /src/app/movies/page.tsx
import Section from '@/components/Section';
import ContentCard from '@/components/ContentCard';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '@/lib/tmdb';
import { Movie } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies | FLIXORA',
  description: 'Explore popular, top-rated, and upcoming movies.',
};

export default async function MoviesPage() {
  const popularMovies = await getPopularMovies();
  const topRatedMovies = await getTopRatedMovies();
  const upcomingMovies = await getUpcomingMovies();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-red-500 to-pink-500">
        Explore Movies
      </h1>

      <Section title="Popular Movies">
        {popularMovies.map((movie: Movie) => (
          <ContentCard key={movie.id} item={movie} type="movie" />
        ))}
      </Section>

      <Section title="Top Rated Movies">
        {topRatedMovies.map((movie: Movie) => (
          <ContentCard key={movie.id} item={movie} type="movie" />
        ))}
      </Section>

      <Section title="Upcoming Movies">
        {upcomingMovies.map((movie: Movie) => (
          <ContentCard key={movie.id} item={movie} type="movie" />
        ))}
      </Section>
    </div>
  );
}
