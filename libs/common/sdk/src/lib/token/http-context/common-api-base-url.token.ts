import { InjectionToken } from '@angular/core';

export const COMMON_API_BASE_URL_TOKEN = new InjectionToken<string>(
  'COMMON_API_BASE_URL_TOKEN',
  {
    providedIn: 'root',
    factory: () => '',
  }
);
