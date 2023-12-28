import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Translation, type TranslocoLoader } from '@ngneat/transloco';
import { type Observable } from 'rxjs/internal/Observable';
import { COMMON_FILE_PATH_TOKEN } from '../../token';

@Injectable({
  providedIn: 'root',
})
export class TranslocoLoaderService implements TranslocoLoader {
  private _http = inject(HttpClient);

  private _i18nFilePath = inject(COMMON_FILE_PATH_TOKEN);

  getTranslation<T extends Translation>(lang: string): Observable<T> {
    return this._http.get<T>(`${this._i18nFilePath}/${lang}.json`);
  }
}
