import { Provider } from './types';

export const moviekex: Provider = {
  name: 'MovieKex',
  rank: 6,
  disabled: false,
  getMovie: (id: string) => {
    return `https://moviekex.online/embed/movie/${id}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    return `https://moviekex.online/embed/tv/${id}/${season}/${episode}`;
  },
};
