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
    eager: true, // mấu chốt nằm ở dây
    singleton: true,
    strictVersion: false,
    requiredVersion: '5.11.1',
    ...sharedConfig,
  };
};

const config: ModuleFederationConfig = {
  name: 'angular',
  exposes: {
    './Routes': 'apps/angular/src/app/remote-entry/entry.routes.ts',
  },
  shared: (libraryName: string, sharedConfig: SharedLibraryConfig) => {
    const sharedDeps: Record<string, SharedLibraryConfig> = {
      '@amcharts/amcharts5': {
        singleton: true,
        eager: true,
        strictVersion: true,
        requiredVersion: '5.11.1',
      },
    };
    return sharedDeps[libraryName];
  },
  disableNxRuntimeLibraryControlPlugin: true,
};
export default config;
