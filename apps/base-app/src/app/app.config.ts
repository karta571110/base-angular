import { isDevMode, type ApplicationConfig } from '@angular/core';
import { provideRouter, type Routes } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslocoLoaderService } from '@common/sdk/i18n';
import { provideTransloco } from '@ngneat/transloco';

const routes: Routes = [
  {
    path: '**',
    redirectTo: '',
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['zh'],
        defaultLang: 'zh',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoLoaderService,
    }),
  ],
};
