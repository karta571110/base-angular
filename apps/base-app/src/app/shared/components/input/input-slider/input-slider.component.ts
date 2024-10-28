import { Component, OnInit, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import { ValidateMessageComponent } from '../../validate-message/validate-message.component';
import { BaseInputComponent } from '../base-input';
@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ControlDirective,
    ValidateMessageComponent,
    MatSliderModule,
  ],
  hostDirectives: [controlDirectiveProvider],
})
export class InputSliderComponent extends BaseInputComponent implements OnInit {
  max = input<number>(100);

  min = input<number>(0);

  step = input<number>(1);

  protected control: FormControl<string> | null = null;

  private _controlDirective = inject(
    ControlDirective<string, FormControl<string>>
  );

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      this.control = this._controlDirective.control;
    }
  }
}
