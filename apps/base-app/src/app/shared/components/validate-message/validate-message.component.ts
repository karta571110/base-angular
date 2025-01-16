import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import { ErrorMessagePipe } from '@common/sdk/form';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-validate-message',
  templateUrl: './validate-message.component.html',
  imports: [AsyncPipe, ErrorMessagePipe, TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'sdk-form',
      multi: true,
    },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'validate-messages',
      multi: true,
    },
  ],
})
export class ValidateMessageComponent {
  control = input.required<AbstractControl>();

  protected i18nScope = inject(TRANSLOCO_SCOPE);
}
