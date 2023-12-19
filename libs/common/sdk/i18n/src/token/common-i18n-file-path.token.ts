import { InjectionToken } from '@angular/core';

export const COMMON_FILE_PATH_TOKEN = new InjectionToken<string>(
  'COMMON_FILE_PATH_TOKEN',
  {
    providedIn: 'root',
    factory: () => '/assets/i18n',
  }
);
