import { type Observable } from 'rxjs/internal/Observable';

/** 身份驗證服務抽象底層 */
export abstract class CommonBaseAuthenticationService {
  /** 是否登入中 */
  abstract isLoggedIn$: Observable<boolean>;

  /**
   *  登入行為
   * @param payload - 登入所需的request
   */
  abstract login(payload: unknown): Observable<unknown>;

  /**
   * 登出行為
   */
  abstract logout(): Observable<unknown>;

  /** 取得refreshToken */
  abstract refreshToken(payload?: unknown): Observable<unknown>;

  /** Token過期行為 */
  abstract sessionError(error: unknown): void;
}
