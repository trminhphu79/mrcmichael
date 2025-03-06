import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { ReactWrapperComponent } from './wrapper/react/react-wrapper.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      loadRemote<typeof import('michael/Routes')>('michael/Routes').then(
        (m) => m!.remoteRoutes
      ),
  },
  {
    path: 'blog',
    component: ReactWrapperComponent,
    data: {
      elementName: 'blog-react',
      loadChildren: () => import('blog/Module').then((m) => m!.default),
    },
  },
  {
    path: 'admin',
    component: ReactWrapperComponent,
    data: {
      elementName: 'admin-react',
      loadChildren: () => import('admin/Module').then((m) => m!.default),
    },
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
