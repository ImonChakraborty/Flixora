import { Provider } from './types';

export const vidsrc: Provider = {
  name: 'VidSrc',
  rank: 2,
  disabled: false,
  getMovie: (id: string) => {
    return `https://vsrc.su/embed/movie/${id}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    return `https://vsrc.su/embed/tv/${id}/${season}/${episode}`;
  },
};
