import { Provider } from './types';

export const vidsrc: Provider = {
  name: 'VidSrc',
  rank: 2,
  disabled: false,
  getMovie: (id: string) => {
    return `https://vidsrc.net/embed/movie/${id}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    return `https://vidsrc.net/embed/tv/${id}/${season}/${episode}`;
  },
};
