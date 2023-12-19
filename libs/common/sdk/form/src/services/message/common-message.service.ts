import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { of, shareReplay, switchMap, tap } from 'rxjs';
import { type Observable } from 'rxjs/internal/Observable';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError } from 'rxjs/internal/operators/catchError';
import { type MessageData } from '../../models';
import { COMMON_MESSAGE_API_URL_TOKEN } from '../../token';

@Injectable({
  providedIn: 'root',
})
export class CommonMessageService<
  customMessageDataT extends Record<string, string> = MessageData,
> {
  initMessage$: Observable<customMessageDataT>;

  private _translocoService = inject(TranslocoService);

  // TODO: i18n
  private readonly _defaultMessage: MessageData = {
    required: '請輸入{{fieldName}}',
    'regex-pattern-error': '輸入{{fieldName}}格式錯誤',
    'no-message': '無此訊息',
  };

  private _messageMap = new Map<
    keyof (customMessageDataT & MessageData),
    string
  >();

  private _httpClient = inject(HttpClient);

  private _messageDataUrl = inject(COMMON_MESSAGE_API_URL_TOKEN);

  private _isRegistMessage = false;

  constructor() {
    this.initMessage$ = this._httpClient
      .get<customMessageDataT>(this._messageDataUrl)
      .pipe(
        tap(data => {
          if (!this._isRegistMessage) {
            this.setMessage(data);
            this._isRegistMessage = true;
          }
        }),
        catchError(() => EMPTY),
        shareReplay()
      );

    this.setMessage(this._defaultMessage);
  }

  /**
   * Setting the validation message
   * @param data validation message
   */
  setMessage(data: customMessageDataT | MessageData): void {
    Object.entries(data).forEach(([key, value]) => {
      const dataKey = key as keyof (customMessageDataT & MessageData);

      this._messageMap.set(dataKey, value);
    });
  }

  getMessage(
    messageKey: keyof (customMessageDataT & MessageData)
  ): Observable<string> {
    const message = (): Observable<string> =>
      of(
        this._messageMap.get(messageKey) ??
          this._messageMap.get('no-message') ??
          ''
      );

    if (this._isRegistMessage) {
      return message();
    }

    return this.initMessage$.pipe(switchMap(() => message()));
  }
}
