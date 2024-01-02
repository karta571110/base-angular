import {
  type HttpEvent,
  type HttpHandler,
  type HttpInterceptor,
  type HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CommonLoaderService } from '../services/loader/common-loader.service';
import { COMMON_IS_LOADER_ENABLE_TOKEN } from '../token/http-context/common-is-loader-enable.token';

@Injectable({
  providedIn: 'root',
})
export class CommonLoaderInterceptor implements HttpInterceptor {
  private _loaderService = inject(CommonLoaderService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.context.get(COMMON_IS_LOADER_ENABLE_TOKEN)) {
      this._loaderService.start();
    }

    return next.handle(request).pipe(
      finalize(() => {
        this._loaderService.stop();
      })
    );
  }
}
