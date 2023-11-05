import { Pipe, inject, type PipeTransform } from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import { type Observable } from 'rxjs';
import { CommonValidationService } from '../../services';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe<customMessageDataT extends Record<string, string>>
  implements PipeTransform
{
  private _validatorService = inject(
    CommonValidationService<customMessageDataT>
  );

  transform(control: AbstractControl): Observable<string>[] {
    return this._validatorService.getValidationMessage(control);
  }
}
