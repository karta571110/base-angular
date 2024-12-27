import {
  HttpClient,
  HttpContext,
  type HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import isNumber from 'lodash-es/isNumber';
import isString from 'lodash-es/isString';
import isUndefined from 'lodash-es/isUndefined';
import { type Observable } from 'rxjs/internal/Observable';
import urlJoin from 'url-join';
import { type ApiOptions } from '../../models';
import { COMMON_API_BASE_URL_TOKEN } from '../../token/http-context/common-api-base-url.token';
import { COMMON_IS_LOADER_ENABLE_TOKEN } from '../../token/http-context/common-is-loader-enable.token';
import { COMMON_IS_TOKEN_REQUIRED_TOKEN } from '../../token/http-context/common-is-token-required.token';

@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  private _http = inject(HttpClient);

  private _apiBaseUrl = inject(COMMON_API_BASE_URL_TOKEN);

  get<resT>(
    url: string,
    params?: ApiOptions['params'] | number | string,
    options?: ApiOptions
  ): Observable<resT> {
    const urlTemp = this._isPathParams(params) ? this._getUrl(params) : url;
    const paramsTemp = this._isPathParams(params) ? undefined : params;
    const apiUrl = urlJoin(this._apiBaseUrl, urlTemp);

    return this._http.get<resT>(apiUrl, {
      params: paramsTemp,
      ...this._getHttpClientOptions(options),
      observe: 'body',
      responseType: 'json',
    });
  }

  post<reqT, resT>(
    url: string,
    body?: reqT,
    options?: ApiOptions
  ): Observable<resT> {
    const apiUrl = urlJoin(this._apiBaseUrl, url);

    return this._http.post<resT>(apiUrl, body, {
      ...this._getHttpClientOptions(options),
      observe: 'body',
      responseType: 'json',
    });
  }

  postBlob<reqT>(
    url: string,
    body?: reqT,
    options?: ApiOptions
  ): Observable<HttpResponse<Blob>> {
    const apiUrl = urlJoin(this._apiBaseUrl, url);

    return this._http.post(apiUrl, body, {
      ...this._getHttpClientOptions(options),
      observe: 'response',
      responseType: 'blob',
    });
  }

  put<reqT, resT>(
    url: string,
    body?: reqT,
    options?: ApiOptions
  ): Observable<resT> {
    const apiUrl = urlJoin(this._apiBaseUrl, url);

    return this._http.put<resT>(apiUrl, body, {
      ...this._getHttpClientOptions(options),
      observe: 'body',
      responseType: 'json',
    });
  }

  delete<resT>(url: string, options?: ApiOptions): Observable<resT> {
    const apiUrl = urlJoin(this._apiBaseUrl, url);

    return this._http.delete<resT>(apiUrl, {
      ...this._getHttpClientOptions(options),
      observe: 'body',
      responseType: 'json',
    });
  }

  customRequest<reqT, resT>(
    method: 'delete' | 'get' | 'post' | 'put',
    url: string,
    options?:
      | ApiOptions<reqT>
      | {
          observe: 'body' | 'response';
          responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
        }
  ): Observable<resT> {
    return this._http.request(method, url, options);
  }

  private _getHttpClientOptions(options?: ApiOptions): ApiOptions | undefined {
    if (isUndefined(options)) return options;
    const context = new HttpContext();

    if (!isUndefined(options.ignoreToken) && options.ignoreToken) {
      context.set(COMMON_IS_TOKEN_REQUIRED_TOKEN, false);
    }

    if (!isUndefined(options.ignoreLoader) && options.ignoreLoader) {
      context.set(COMMON_IS_LOADER_ENABLE_TOKEN, false);
    }

    return {
      context,
      ...options,
    } as ApiOptions;
  }

  private _isPathParams(
    params?: ApiOptions['params'] | number | string
  ): params is number | string {
    return isString(params) || isNumber(params);
  }

  private _getUrl(key: number | string): string {
    return urlJoin(this._apiBaseUrl, String(key));
  }
}
