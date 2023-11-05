import { Injectable, inject } from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import get from 'lodash-es/get';
import isNull from 'lodash-es/isNull';
import isString from 'lodash-es/isString';
import isUndefined from 'lodash-es/isUndefined';
import { map, type Observable } from 'rxjs';
import { type MessageData, type ValidatorErrorMessage } from '../../models';
import { CommonMessageService } from '../message/common-message.service';
export interface Template {
  start: string;
  end: string;
}
/**
 * 驗證訊息服務
 * @template customMessage - 自訂訊息型別
 */
@Injectable({
  providedIn: 'root',
})
export class CommonValidationService<
  customMessage extends Record<string, string> = MessageData,
> {
  private _messageService = inject(CommonMessageService<customMessage>);

  /**
   * 取得Control內的錯誤訊息
   * @param control - 表單控制項
   * @returns 驗證錯誤訊息
   */
  getValidationMessage(control: AbstractControl): Observable<string>[] {
    const errors =
      control.errors as ValidatorErrorMessage<customMessage> | null;

    if (isNull(errors)) return [];
    const errorKeys: (keyof customMessage)[] = Object.keys(
      errors
    ) as (keyof customMessage)[];

    return errorKeys.map(key =>
      this._messageService.getMessage(key).pipe(
        map(message => {
          const messageData = errors[key] as
            | ValidatorErrorMessage<customMessage>
            | undefined;

          if (!isUndefined(messageData)) {
            return this._formatTemplate(message, messageData);
          }

          return message;
        })
      )
    );
  }

  // if (!isUndefined(messageData)) {
  //   return this._formatTemplate(message,messageData)
  // }
  /**
   * 格式化樣板文字
   * @param text 文字樣版
   * @param data 替換的資料
   * @param template 樣版開頭與結尾
   * @example
   * Normal:
   * ```typescript
   * formatTemplate('hello {{name}}!', {
   *   name: 'world',
   * }); // => 'hello world!
   *
   * ```
   * Nest:
   * ```typescript
   * formatTemplate('hello {{greeting.bar}}!', {
   *  greeting: {
   *     bar: 'bar',
   *   },
   * }); // => 'hello bar!
   * ```
   * @returns 格式化後文字
   */
  private _formatTemplate(
    text: string,
    data: ValidatorErrorMessage<customMessage>,
    template: Template = {
      start: '{{',
      end: '}}',
    }
  ): string {
    const regex = new RegExp(`${template.start}(.+?)${template.end}`, 'g');

    return text.replace(regex, (_match, key: string) =>
      // Use the split function to split the key by '.'
      // and reduce the data object to get the value of the key.
      {
        const result = get(data, key);

        return isString(result) ? result : key;
      }
    );
  }
}
