import {
  Component,
  Injector,
  OnInit,
  Signal,
  inject,
  input,
  runInInjectionContext,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { isMatch } from 'date-fns/isMatch';
import { zhTW } from 'date-fns/locale';
import isNil from 'lodash-es/isNil';
import { BaseInputComponent } from '../base-input';
import {
  CustomDateFnsFormat,
  hasTimePickerFormat,
  withoutTimePickerFormat,
} from '../input-date/input-date-custom-format';
import { InputDateComponent } from '../input-date/input-date.component';

@Component({
  selector: 'app-input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.scss'],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupName,
    },
  ],
  providers: [
    provideDateFnsAdapter(new CustomDateFnsFormat()),
    {
      provide: MAT_DATE_LOCALE,
      useValue: zhTW,
    },
  ],
  imports: [ReactiveFormsModule, InputDateComponent],
})
export class InputDateRangeComponent
  extends BaseInputComponent
  implements OnInit
{
  startDateFormControlName = input<string>('start');

  startDatePlaceholder = input<string>('');

  endDateFormControlName = input<string>('end');

  endDatePlaceholder = input<string>('');

  useTimePicker = input(true);

  protected dateRangeGroup: FormGroup;

  protected startValue: Signal<string | null> | null = null;

  protected endValue: Signal<string | null> | null = null;

  private _controlContainer = inject(ControlContainer);

  private _adapter = inject(DateAdapter);

  private _injector = inject(Injector);

  constructor() {
    super();
    const fb = inject(FormBuilder).nonNullable;

    this.dateRangeGroup = fb.record({
      start: '',
      end: '',
    });
  }

  // eslint-disable-next-line max-statements
  ngOnInit(): void {
    const group = this._controlContainer.control;

    if (isNil(group)) {
      return;
    }
    this.dateRangeGroup = group as FormGroup;
    const startControl = group.get(this.startDateFormControlName());
    const endControl = group.get(this.endDateFormControlName());
    const format = this.useTimePicker()
      ? hasTimePickerFormat.parse.dateInput
      : withoutTimePickerFormat.parse.dateInput;

    if (!isMatch(startControl?.value, format)) {
      startControl?.setValue(this._adapter.format(new Date(), format));
    }

    if (!isMatch(endControl?.value, format)) {
      endControl?.setValue(
        this._adapter.format(
          new Date().setDate(new Date().getDate() + 1),
          format
        )
      );
    }
    if (!isNil(startControl) && !isNil(endControl)) {
      runInInjectionContext(this._injector, () => {
        this.startValue = toSignal(startControl.valueChanges, {
          initialValue: startControl.value,
        });
        this.endValue = toSignal(endControl.valueChanges, {
          initialValue: endControl.value,
        });
      });
    }
  }
}
