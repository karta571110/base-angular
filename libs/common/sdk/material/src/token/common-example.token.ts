import { InjectionToken } from '@angular/core';

export const COMMON_EXAMPLE = new InjectionToken<string>('COMMON_EXAMPLE', {
  providedIn: 'root',
  factory: () => 'example',
});
