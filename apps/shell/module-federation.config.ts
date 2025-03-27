// import { ModuleFederationConfig } from '@nx/module-federation';

// const config: ModuleFederationConfig = {
//   name: 'shell',
// };

// /**
//  * Nx requires a default export of the config to allow correct resolution of the module federation graph.
//  **/
// export default config;

import type {
  ModuleFederationConfig,
  SharedFunction,
  SharedLibraryConfig,
} from '@nx/module-federation';

const sharedLibraries: SharedFunction = (
  libraryName: string,
  sharedConfig: SharedLibraryConfig
) => {
  return {
    singleton: true,
    strictVersion: false,
    eager: true,
    requiredVersion: '5.11.1',
    ...sharedConfig, // Ensures other shared settings remain flexible
  };
};

const config: ModuleFederationConfig = {
  name: 'shell',
  shared: (libName, libConfigFromNx) => {
    return sharedLibraries(libName, libConfigFromNx)
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
