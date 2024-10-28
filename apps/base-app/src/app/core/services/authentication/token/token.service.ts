import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonBaseTokenService, PickObj } from '@common/sdk';
import isNull from 'lodash-es/isNull';
import { Observable } from 'rxjs/internal/Observable';

interface AuthenticationToken {
  accessToken: string | null;
  refreshToken: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService
  extends CommonBaseTokenService<AuthenticationToken>
  implements OnDestroy
{
  token$: Observable<AuthenticationToken>;

  accessToken;

  refreshToken;

  private _sessionAccessTokenKey = 't392321c895a54135852a6d5eb66e2d69';

  private _sessionRefreshTokenKey = 'r02e826a95c2b4694b08ee8a2d764f30a';

  private _token = signal<AuthenticationToken>({
    accessToken: null,
    refreshToken: null,
  });

  private _tokenChange = toObservable(this._token).subscribe(token => {
    const accessToken = token.accessToken;
    const refreshToken = token.refreshToken;

    if (!isNull(accessToken)) {
      sessionStorage.setItem(this._sessionAccessTokenKey, accessToken);
    } else {
      sessionStorage.removeItem(this._sessionAccessTokenKey);
    }

    if (!isNull(refreshToken)) {
      sessionStorage.setItem(this._sessionRefreshTokenKey, refreshToken);
    } else {
      sessionStorage.removeItem(this._sessionRefreshTokenKey);
    }
  });

  constructor() {
    super();
    this.token$ = toObservable(this._token);
    this.accessToken = computed(() => this._token().accessToken);
    this.refreshToken = computed(() => this._token().refreshToken);
  }

  initToken(): void {
    this._token.set({
      accessToken: this._getAccessTokenFromSessionStorage(),
      refreshToken: this._getRefreshTokenFromSessionStorage(),
    });
  }

  updateToken(
    accessToken: PickObj<AuthenticationToken, 'accessToken'>,
    refreshToken: PickObj<AuthenticationToken, 'refreshToken'>
  ): void {
    this._token.set({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  cleanToken(): void {
    this._token.set({
      accessToken: null,
      refreshToken: null,
    });
  }

  ngOnDestroy(): void {
    this._tokenChange.unsubscribe();
  }

  private _getAccessTokenFromSessionStorage(): PickObj<
    AuthenticationToken,
    'accessToken'
  > {
    return sessionStorage.getItem(this._sessionAccessTokenKey);
  }

  private _getRefreshTokenFromSessionStorage(): PickObj<
    AuthenticationToken,
    'refreshToken'
  > {
    return sessionStorage.getItem(this._sessionRefreshTokenKey);
  }
}
