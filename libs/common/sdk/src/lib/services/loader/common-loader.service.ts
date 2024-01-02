import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { type Observable } from 'rxjs/internal/Observable';

/**
 * 管理是否載入中的狀態服務
 * 需與 CommonLoaderInterceptor 一起使用
 */
@Injectable({
  providedIn: 'root',
})
export class CommonLoaderService {
  loading$: Observable<boolean>;

  private _execCounter = 0;

  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {
    this.loading$ = this._loading.asObservable();
  }

  start(): void {
    this._execCounter++;

    if (this._execCounter > 0) {
      this._loading.next(true);
    }
  }

  stop(): void {
    if (this._execCounter > 0) {
      this._execCounter--;
    }

    if (this._execCounter <= 0) {
      this._loading.next(false);
    }
  }
}
