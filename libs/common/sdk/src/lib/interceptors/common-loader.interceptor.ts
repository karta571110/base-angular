import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs/internal/operators/finalize';
import { asapScheduler } from 'rxjs/internal/scheduler/asap';
import { CommonLoaderService } from '../services/loader/common-loader.service';
import { COMMON_IS_LOADER_ENABLE_TOKEN } from '../token/http-context/common-is-loader-enable.token';

export const loaderInterceptor: HttpInterceptorFn = (request, next) => {
  const loaderService = inject(CommonLoaderService);

  asapScheduler.schedule(() => {
    if (request.context.get(COMMON_IS_LOADER_ENABLE_TOKEN)) {
      loaderService.start();
    }
  });

  return next(request).pipe(
    finalize(() => {
      loaderService.stop();
    })
  );
};
