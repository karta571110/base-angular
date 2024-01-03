import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { getTranslocoProvide } from '@common/sdk/i18n';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), ...getTranslocoProvide()],
};
