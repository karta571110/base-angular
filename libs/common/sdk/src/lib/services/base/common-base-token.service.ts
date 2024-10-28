import { type Signal } from '@angular/core';
import { type Observable } from 'rxjs/internal/Observable';

/** Token服務抽象服務 */
export abstract class CommonBaseTokenService<T> {
  /** Token物件 */
  abstract token$: Observable<T>;

  /** 目前作用中的Token */
  abstract accessToken: Signal<string | null>;

  /** 重新取得accessToken的Token */
  abstract refreshToken: Signal<string | null>;

  /** 初始化Token */
  abstract initToken(): void;

  /**
   * 更新Token
   * @param accessToken - 目前作用中的Token
   * @param refreshToken - 重新取得accessToken的Token
   */
  abstract updateToken(accessToken: string, refreshToken: string): void;

  /** 清理Token */
  abstract cleanToken(): void;
}
