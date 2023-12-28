import { type ApplicationConfig } from '@angular/core';
import { type Routes } from '@angular/router';

import { getTranslocoProvide } from '@common/sdk/i18n';

const routes: Routes = [
    {
      path: '**',
      redirectTo: '',
    },
  ],
  supportLangs = [
    {
      id: 'zh',
      label: '繁體中文',
    },
    {
      id: 'en',
      label: 'English',
    },
  ];

export const appConfig: ApplicationConfig = {
  providers: [
    ...getTranslocoProvide(routes, {
      availableLangs: supportLangs,
      defaultLang: localStorage.getItem('lang') ?? 'en',
    }),
  ],
};
