import {
  CSP_NONCE,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
  type ApplicationConfig,
} from '@angular/core';
import { provideRouter, type Routes } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  COMMON_API_BASE_URL_TOKEN,
  CommonBaseAuthenticationService,
  CommonBaseTokenService,
  loaderInterceptor,
  styleElementCsp,
} from '@common/sdk';
import { getTranslocoProvide } from '@common/sdk/i18n';
import { AuthRoute } from './core/constants/menu-feature-define';
import { AuthenticationService } from './core/services/authentication/authentication/authentication.service';
import { TokenService } from './core/services/authentication/token/token.service';

/**
 *  取得伺服器隨機碼
 * @returns 隨機碼
 */
// eslint-disable-next-line max-statements
function getCspNonce(): string {
  const metaEls = document.head.querySelectorAll('meta');

  for (let i = 0; i < metaEls.length; i++) {
    const meta = metaEls.item(i);

    if (meta.name === 'CSP-NONCE') {
      const content = meta.content;

      meta.remove();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const originalAppendChild = Element.prototype.appendChild;

      Element.prototype.appendChild = function newAppendChild<T extends Node>(
        node: T
      ) {
        const originalAppendChildBind = originalAppendChild.bind(this);
        const el = node;

        if (el.nodeName.toLowerCase() === 'style') {
          (el as unknown as Element).setAttribute('nonce', content);
        }

        return originalAppendChildBind(node);
      };
      styleElementCsp(content);

      return content;
    }
  }

  return '';
}
const supportLangs = [
  {
    id: 'zh',
    label: '繁體中文',
  },
  {
    id: 'en',
    label: 'English',
  },
  {
    id: 'cn',
    label: '简体中文',
  },
];
const routes: Routes = [
  {
    path: AuthRoute.login,
    loadComponent: () =>
      import('./pages/login/index.component').then(c => c.IndexComponent),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./layouts/main/index.component').then(c => c.IndexComponent),
    providers: [],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/index.component').then(
            c => c.IndexComponent
          ),
        children: [],
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AuthRoute.login,
  },
  {
    path: '**',
    redirectTo: AuthRoute.login,
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideRouter(routes),
    ...getTranslocoProvide({
      availableLangs: supportLangs,
      defaultLang:
        localStorage.getItem('lang') ??
        (() => {
          const defaultLang = 'zh';

          localStorage.setItem('lang', defaultLang);

          return defaultLang;
        })(),
    }),
    provideAnimationsAsync(),
    {
      provide: COMMON_API_BASE_URL_TOKEN,
      useValue: window.location.origin + '/api',
    },
    TokenService,
    {
      provide: CommonBaseTokenService,
      useExisting: TokenService,
    },
    {
      provide: CommonBaseAuthenticationService,
      useExisting: AuthenticationService,
    },
    provideAppInitializer(() => {
      const tokenService = inject(TokenService);

      tokenService.initToken();
    }),
    {
      provide: CSP_NONCE,
      useValue: getCspNonce(),
    },
  ],
};
