import { Injectable, inject } from '@angular/core';
import {
  CommonApiService,
  CommonBaseAuthenticationService,
  randomCode,
} from '@common/sdk';
import isNull from 'lodash-es/isNull';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { scheduled } from 'rxjs/internal/scheduled/scheduled';
import { asyncScheduler } from 'rxjs/internal/scheduler/async';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends CommonBaseAuthenticationService {
  private _tokenService: TokenService = inject(TokenService);

  private _api = inject(CommonApiService);

  get isLoggedIn$(): Observable<boolean> {
    return this._tokenService.token$.pipe(
      map(token => !isNull(token.accessToken) && !isNull(token.refreshToken))
    );
  }

  login(payload: unknown): Observable<unknown> {
    console.log(payload);

    // return this._api.post();
    return scheduled<{
      accessToken: string;
      refreshToken: string;
    }>(
      of({
        accessToken: randomCode(),
        refreshToken: randomCode(),
      }),
      asyncScheduler
    ).pipe(
      tap(res => {
        this._tokenService.updateToken(res.accessToken, res.refreshToken);
      })
    );
  }

  logout(): Observable<unknown> {
    return scheduled<unknown>(of(undefined), asyncScheduler).pipe(
      tap((): void => {
        this._tokenService.cleanToken();
      })
    );
  }

  refreshToken(payload?: unknown): Observable<unknown> {
    console.log(payload);

    throw new Error('Method not implemented.');
  }

  sessionError(error: unknown): void {
    console.log(error);

    throw new Error('Method not implemented.');
  }
}
