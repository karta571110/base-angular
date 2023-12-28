import { Pipe, inject, type PipeTransform } from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import isNull from 'lodash-es/isNull';
import isString from 'lodash-es/isString';
import { type MessageData, type ValidatorErrorMessage } from '../../models';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe<
  customMessageDataT extends Record<string, unknown> = MessageData,
> implements PipeTransform
{
  private _translocoService = inject(TranslocoService);

  transform(control: AbstractControl | null): string[] {
    if (isNull(control)) return [];
    const errors =
      control.errors as ValidatorErrorMessage<customMessageDataT> | null;

    if (isNull(errors)) return [];
    const errorKeys: (keyof ValidatorErrorMessage<customMessageDataT>)[] =
      Object.keys(
        errors
      ) as (keyof ValidatorErrorMessage<customMessageDataT>)[];

    return errorKeys.map(key =>
      this._translocoService.translate(
        isString(key) ? key : key.toString(),
        errors[key] ?? {}
      )
    );
  }
}
