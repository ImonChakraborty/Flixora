export interface Provider {
  name: string;
  rank: number;
  disabled: boolean;
  getMovie: (id: string) => string;
  getEpisode: (id: string, season: number, episode: number) => string;
}
