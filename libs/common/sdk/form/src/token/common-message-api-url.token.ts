import { InjectionToken } from '@angular/core';

export const COMMON_MESSAGE_API_URL_TOKEN = new InjectionToken<string>(
  'COMMON_MESSAGE_API_URL_TOKEN',
  {
    providedIn: 'root',
    factory: () => './assets/validation.json',
  }
);
