import { NgClass } from '@angular/common';
import { Component, inject, input, output, type OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import { ValidateMessageComponent } from '../../validate-message/validate-message.component';
import { BaseInputComponent } from '../base-input';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [
    ReactiveFormsModule,
    ValidateMessageComponent,
    NgClass,
    MatAutocompleteModule,
  ],
  hostDirectives: [controlDirectiveProvider],
})
export class InputComponent extends BaseInputComponent implements OnInit {
  canIconClick = input<boolean>(false);

  inputType = input<string>('text');

  autoComplete = input<MatAutocomplete | null>(null);

  iconClick = output();

  inputKeyup = output<KeyboardEvent>();

  inputFocus = output();

  protected control: FormControl<string> | null = null;

  private _controlDirective = inject(
    ControlDirective<string, FormControl<string>>
  );

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      this.control = this._controlDirective.control;
    }
  }

  protected iconClickEvent(): void {
    if (!this.canIconClick()) {
      return;
    }
    this.iconClick.emit();
  }

  protected keyupEvent(event: KeyboardEvent): void {
    this.inputKeyup.emit(event);
  }

  protected inputFocusEvent(): void {
    this.inputFocus.emit();
  }
}
