import { HttpContextToken } from '@angular/common/http';

/**
 * Is the http request require an additional token, default true
 */
export const COMMON_IS_TOKEN_REQUIRED_TOKEN = new HttpContextToken<boolean>(
  () => true
);
