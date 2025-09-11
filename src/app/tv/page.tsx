// /src/app/tv/page.tsx
import Section from '@/components/Section';
import ContentCard from '@/components/ContentCard';
import { getPopularTvShows, getTopRatedTvShows, getAiringTodayTvShows } from '@/lib/tmdb';
import { Series } from '@/lib/types';

export const metadata = {
  title: 'TV Shows | FLIXORA',
  description: 'Discover popular, top-rated, and airing today TV shows.',
};

export default async function TvShowsPage() {
  const popularTvShows = await getPopularTvShows();
  const topRatedTvShows = await getTopRatedTvShows();
  const airingTodayTvShows = await getAiringTodayTvShows();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-red-500 to-pink-500">
        Discover TV Shows
      </h1>

      <Section title="Popular TV Shows">
        {popularTvShows.map((show: Series) => (
          <ContentCard key={show.id} item={show} type="tv" />
        ))}
      </Section>

      <Section title="Top Rated TV Shows">
        {topRatedTvShows.map((show: Series) => (
          <ContentCard key={show.id} item={show} type="tv" />
        ))}
      </Section>

      <Section title="Airing Today">
        {airingTodayTvShows.map((show: Series) => (
          <ContentCard key={show.id} item={show} type="tv" />
        ))}
      </Section>
    </div>
  );
}
