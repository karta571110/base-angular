import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DefineDataTypeDirective } from '@common/sdk';
import { controlDirectiveProvider } from '@common/sdk/form';
import { zhTW } from 'date-fns/locale';
import isNil from 'lodash-es/isNil';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { ButtonComponent } from '../../buttons/button/button.component';
import { hasTimePickerFormat } from '../input-date/input-date-custom-format';
import { TimePickerConfig, TimePickerForm } from './input-time-picker.model';
@Component({
  selector: 'app-input-time-picker',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    DefineDataTypeDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './input-time-picker.component.html',
  styleUrl: './input-time-picker.component.scss',
  hostDirectives: [controlDirectiveProvider],
})
export class InputTimePickerComponent implements OnInit {
  config = input<Partial<TimePickerConfig>>({});

  protected inputTemplateType!: { formControlName: keyof TimePickerForm };

  protected defaultConfig = computed<TimePickerConfig>(() => ({
    useHour: true,
    useMinute: true,
    useSecond: true,
    enableMeridian: false,
    format: hasTimePickerFormat.parse.dateInput.split(' ')[1],
    ...this.config(),
  }));

  protected setting = computed(() => ({
    maxHour: this.defaultConfig().enableMeridian ? 12 : 23,
    minHour: this.defaultConfig().enableMeridian ? 1 : 0,
    maxMinute: 59,
    maxSecond: 59,
  }));

  protected isNoonMode = signal(true);

  protected meridianName = computed(() =>
    zhTW.localize.dayPeriod(this.isNoonMode() ? 'am' : 'pm')
  );

  protected timePickerForm;

  private _dateAdapter = inject(DateAdapter);

  private _controlDirective = inject(controlDirectiveProvider.directive);

  private _control: FormControl<string> | null = null;

  private _destroyRef = inject(DestroyRef);

  // eslint-disable-next-line max-lines-per-function
  constructor() {
    const fb = inject(FormBuilder).nonNullable;
    const form = fb.group<TimePickerForm>({
      hour: '00',
      minute: '00',
      second: '59',
    });

    this.timePickerForm = form;
    const controlKey: (keyof TimePickerForm)[] = ['hour', 'minute', 'second'];

    // eslint-disable-next-line max-lines-per-function
    controlKey.forEach(key => {
      const control = form.get(key);

      if (isNil(control)) {
        return;
      }
      let valueChanges$ = control.valueChanges.pipe(
        takeUntilDestroyed(),
        map(time => Number(time)),
        map(time => {
          if (time < 0) {
            return 0;
          }

          return time;
        })
      );
      const { maxHour, minHour, maxMinute, maxSecond } = this.setting();

      if (key === 'hour') {
        valueChanges$ = valueChanges$.pipe(
          tap(hour => {
            if (hour > maxHour) {
              control.setValue(this._timeFormat(maxHour.toString()));
            } else if (this.defaultConfig().enableMeridian && hour < minHour) {
              control.setValue(this._timeFormat(minHour.toString()));
            }
          })
        );
      } else if (key === 'minute') {
        valueChanges$ = valueChanges$.pipe(
          tap(minute => {
            if (minute > maxMinute) {
              control.setValue(this._timeFormat(maxMinute.toString()));
            }
          })
        );
      } else {
        valueChanges$ = valueChanges$.pipe(
          tap(second => {
            if (second > maxSecond) {
              control.setValue(this._timeFormat(maxSecond.toString()));
            }
          })
        );
      }
      valueChanges$.subscribe(() => {
        const outerControl = this._control;
        const form = this.timePickerForm;
        const times = controlKey.map(
          // eslint-disable-next-line max-nested-callbacks
          key => this._timeFormat(form.get(key)?.value ?? '')
        );

        // eslint-disable-next-line max-nested-callbacks
        if (!isNil(outerControl) && times.every(time => !isNil(time))) {
          const [hour, minute, second] = times;

          const afterHourFormat: number = this.defaultConfig().enableMeridian
            ? this._dateAdapter
                .parse(
                  `${hour}${this.defaultConfig().enableMeridian ? ' ' + this.meridianName() : ''}`,
                  'hh a'
                )
                .getHours()
            : hour;

          outerControl.setValue(`${afterHourFormat}:${minute}:${second}`, {
            onlySelf: true,
            emitEvent: false,
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this._control = this._controlDirective.control;
    const control = this._control;

    if (!isNil(control)) {
      // eslint-disable-next-line max-statements
      const format = (): void => {
        const adapter = this._dateAdapter;

        const timeDate: Date = adapter.parse(
          control.value,
          this.defaultConfig().format
        );
        const form = this.timePickerForm;

        if (!isNil(timeDate)) {
          const [hour, minute, second] = [
            timeDate.getHours(),
            timeDate.getMinutes(),
            timeDate.getSeconds(),
          ];

          this.isNoonMode.set(hour < 12);

          form.get('hour')?.setValue(this._timeFormat(hour.toString()));
          form.get('minute')?.setValue(this._timeFormat(minute.toString()));
          form.get('second')?.setValue(this._timeFormat(second.toString()));
        } else {
          form.get('hour')?.setValue('');
          form.get('minute')?.setValue('');
          form.get('second')?.setValue('');
        }
      };

      format();
      control.valueChanges
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => {
          format();
        });
    }
  }

  protected inputBlur(controlName: keyof TimePickerForm): void {
    const control = this.timePickerForm.get(controlName);

    if (!isNil(control)) {
      control.setValue(this._timeFormat(control.value));
    }
  }

  protected onInput(event: Event): void {
    const e = event as InputEvent;
    const inputTarget = e.target as HTMLInputElement;

    inputTarget.value = inputTarget.value.replaceAll(/\D/g, '');
  }

  protected changeMeridian(): void {
    this.isNoonMode.update(status => !status);
  }

  protected plusValue(controlName: keyof TimePickerForm): void {
    const control = this.timePickerForm.get(controlName);

    if (isNil(control)) {
      return;
    }
    const { maxHour, minHour, maxMinute, maxSecond } = this.setting();
    let value = Number(control.value) + 1;

    if (controlName === 'hour' && value > maxHour) {
      value = minHour;
    } else if (
      (controlName === 'minute' && value > maxMinute) ||
      (controlName === 'second' && value > maxSecond)
    ) {
      value = 0;
    }
    control.setValue(this._timeFormat(value.toString()));
  }

  protected minusValue(controlName: keyof TimePickerForm): void {
    const control = this.timePickerForm.get(controlName);

    if (isNil(control)) {
      return;
    }
    const { maxHour, maxMinute, maxSecond, minHour } = this.setting();
    let value = Number(control.value) - 1;

    if (controlName === 'hour' && value < minHour) {
      value = maxHour;
    } else if (controlName === 'minute' && value < 0) {
      value = maxMinute;
    } else if (controlName === 'second' && value < 0) {
      value = maxSecond;
    }

    control.setValue(this._timeFormat(value.toString()));
  }

  private _timeFormat(time: string): string {
    return time.padStart(2, '0');
  }
}
