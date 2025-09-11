import { Provider } from './types';

export const agent: Provider = {
  name: 'Agent',
  rank: 1,
  disabled: false,
  getMovie: (id: string) => {
    const params = new URLSearchParams();
    params.set('color', 'f59e0b'); // Amber color to match app theme
    console.log(`https://player.videasy.net/movie/${id}?${params.toString()}`);
    return `https://player.videasy.net/movie/${id}?${params.toString()}`;
  },
  getEpisode: (id: string, season: number, episode: number) => {
    const params = new URLSearchParams();
    params.set('color', 'f59e0b'); // Amber color to match app theme
    params.set('autoplayNextEpisode', 'true');
    params.set('episodeSelector', 'true');
    return `https://player.videasy.net/tv/${id}/${season}/${episode}?${params.toString()}`;
  },
};
