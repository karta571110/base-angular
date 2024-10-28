import { computed, Injectable, signal } from '@angular/core';

/**
 * 管理是否載入中的狀態服務
 * 需與 CommonLoaderInterceptor 一起使用
 */
@Injectable({
  providedIn: 'root',
})
export class CommonLoaderService {
  isLoading = computed<boolean>(() => this._execCounter() > 0);

  private _execCounter = signal(0);

  start(): void {
    this._execCounter.update(value => ++value);
  }

  stop(): void {
    if (this._execCounter() > 0) {
      this._execCounter.update(value => --value);
    }
  }
}
