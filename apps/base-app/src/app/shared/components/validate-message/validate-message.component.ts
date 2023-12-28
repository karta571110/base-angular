import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import { ErrorMessagePipe } from '@common/sdk/form';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-validate-message',
  templateUrl: './validate-message.component.html',
  styleUrls: ['./validate-message.component.scss'],
  standalone: true,
  imports: [CommonModule, ErrorMessagePipe, TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: ['sdk-form', 'validate-messages'],
    },
  ],
})
export class ValidateMessageComponent {
  @Input() control: AbstractControl | null = null;
}
