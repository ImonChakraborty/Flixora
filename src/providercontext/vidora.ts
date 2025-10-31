import { Provider } from './types';

export const vidora: Provider = {
  name: 'Vidora',
  rank: 7,
  disabled: false,
  getMovie: (id: string) => {
    const params = new URLSearchParams();
    params.set('colour', 'f59e0b'); // Amber color to match app theme
    return `https://vidora.su/movie/${id}?${params.toString()}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    const params = new URLSearchParams();
    params.set('colour', 'f59e0b'); // Amber color to match app theme
    params.set('pausescreen', 'false'); // By default pause screen will be like an actual pause screen
    return `https://vidora.su/tv/${id}/${season}/${episode}?${params.toString()}`;
  },
};
