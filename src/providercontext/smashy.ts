import { Provider } from './types';

export const smashy: Provider = {
  name: 'Smashy',
  rank: 5,
  disabled: false,
  getMovie: (id: string) => {
    const params = new URLSearchParams();
    params.set('primaryColor', 'f59e0b'); // Amber color to match app theme
    return `https://player.smashystream.com/movie/${id}?${params.toString()}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    const params = new URLSearchParams();
    params.set('primaryColor', 'f59e0b'); // Amber color to match app theme
    return `https://player.smashystream.com/tv/${id}/${season}/${episode}?${params.toString()}`;
  },
};
