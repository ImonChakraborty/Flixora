import { Provider } from './types';

export const embedsu: Provider = {
  name: 'EmbedSu',
  rank: 3,
  disabled: false,
  getMovie: (id: string) => {
    return `https://embed.su/embed/movie/${id}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
  },
};
