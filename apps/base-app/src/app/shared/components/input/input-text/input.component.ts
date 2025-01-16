import { NgClass } from '@angular/common';
import { Component, inject, input, output, type OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import { ValidateMessageComponent } from '../../validate-message/validate-message.component';
import { BaseInputComponent } from '../base-input';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [
    ReactiveFormsModule,
    ControlDirective,
    ValidateMessageComponent,
    NgClass,
  ],
  hostDirectives: [controlDirectiveProvider],
})
export class InputComponent extends BaseInputComponent implements OnInit {
  canIconClick = input<boolean>(false);

  inputType = input<string>('text');

  iconClick = output();

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
}
