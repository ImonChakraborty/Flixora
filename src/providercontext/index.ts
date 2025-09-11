import { Provider } from './types';
import { agent } from './agent';
import { vidsrc } from './vidsrc';
import { embedsu } from './embedsu';
import { vidlink } from './vidlink';
import { smashy } from './smashy';
import { moviekex } from './moviekex';

const allProviders: Provider[] = [agent, vidsrc, embedsu, vidlink, smashy, moviekex];

// export { allProviders as providers };
export default allProviders;
