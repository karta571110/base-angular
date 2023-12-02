import { type ApplicationConfig } from '@angular/core';
import { provideRouter, type Routes } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: '**',
    redirectTo: '',
  },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()],
};
