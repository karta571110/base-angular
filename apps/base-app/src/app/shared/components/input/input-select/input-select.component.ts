import { NgClass } from '@angular/common';
import { Component, inject, input, type OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import { ValidateMessageComponent } from '../../validate-message/validate-message.component';
import { BaseInputComponent } from '../base-input';
import { SelectOption } from './select.model';
@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  imports: [
    ReactiveFormsModule,
    ControlDirective,
    ValidateMessageComponent,
    MatButton,
    NgClass,
    MatSelectModule,
  ],
  hostDirectives: [controlDirectiveProvider],
})
export class InputSelectComponent<ValueT>
  extends BaseInputComponent
  implements OnInit
{
  /** 選項 */
  options = input<SelectOption<ValueT>[]>([]);

  panelClass = input<string>('');

  protected control: FormControl<ValueT> | null = null;

  private _controlDirective = inject(
    ControlDirective<ValueT, FormControl<ValueT>>
  );

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      const control = this._controlDirective.control;

      this.control = control;
    }
  }
}
