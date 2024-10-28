import { InjectionToken } from '@angular/core';

export const COMMON_I18N_FILE_PATH_TOKEN = new InjectionToken<string>(
  'COMMON_I18N_FILE_PATH_TOKEN',
  {
    providedIn: 'root',
    factory: () => 'assets/i18n',
  }
);
