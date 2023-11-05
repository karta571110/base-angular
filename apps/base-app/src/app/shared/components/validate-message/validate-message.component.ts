import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import { ErrorMessagePipe } from '@common/sdk/form';

@Component({
  selector: 'app-validate-message',
  templateUrl: './validate-message.component.html',
  styleUrls: ['./validate-message.component.scss'],
  standalone: true,
  imports: [CommonModule, ErrorMessagePipe],
})
export class ValidateMessageComponent {
  @Input() control: AbstractControl | null = null;
}
