import { HttpContextToken } from '@angular/common/http';

/**
 * Is enable loader, default true
 */
export const COMMON_IS_LOADER_ENABLE_TOKEN = new HttpContextToken<boolean>(
  () => true
);
