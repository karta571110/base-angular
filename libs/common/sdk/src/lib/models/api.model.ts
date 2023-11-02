import {
  type HttpContext,
  type HttpHeaders,
  type HttpParams,
} from '@angular/common/http';

export interface ApiOptions {
  body?: unknown;
  params?:
    | HttpParams
    | Record<
        string,
        boolean | number | string | readonly (boolean | number | string)[]
      >;
  headers?: HttpHeaders | Record<string, string[] | string>;
  context?: HttpContext;
  ignoreToken?: boolean;
  ignoreErrorHandle?: boolean;
  ignoreLoader?: boolean;
  ignoreTrim?: boolean;
  ignoreRemoveEmptyParams?: boolean;
  ignoreRequestHeader?: boolean;
  apiNo?: string;
}
