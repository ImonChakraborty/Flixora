import { Provider } from './types';

export const vidlink: Provider = {
  name: 'VidLink',
  rank: 4,
  disabled: false,
  getMovie: (id: string) => {
    const params = new URLSearchParams();
    params.set('primaryColor', 'f59e0b'); // Amber color to match app theme
    return `https://vidlink.pro/movie/${id}?${params.toString()}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    const params = new URLSearchParams();
    params.set('primaryColor', 'f59e0b'); // Amber color to match app theme
    return `https://vidlink.pro/tv/${id}/${season}/${episode}?${params.toString()}`;
  },
};
