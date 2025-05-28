import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  input,
  OnInit,
  Renderer2,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatCalendarView,
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { controlDirectiveProvider } from '@common/sdk/form';
import { isSameDay } from 'date-fns/isSameDay';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { zhTW } from 'date-fns/locale';
import isNil from 'lodash-es/isNil';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { Subscription } from 'rxjs/internal/Subscription';
import { ButtonComponent } from '../../buttons/button/button.component';
import { BaseInputComponent } from '../base-input';
import { InputTimePickerComponent } from '../input-time-picker/input-time-picker.component';
import {
  CustomDateFnsFormat,
  hasTimePickerFormat,
} from './input-date-custom-format';
import { InputDateConfig } from './input-date.model';

@Component({
  selector: 'app-input-date',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    ButtonComponent,
    InputTimePickerComponent,
  ],
  providers: [
    provideDateFnsAdapter(new CustomDateFnsFormat()),
    {
      provide: MAT_DATE_LOCALE,
      useValue: zhTW,
    },
  ],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
  hostDirectives: [controlDirectiveProvider],
})
export class InputDateComponent extends BaseInputComponent implements OnInit {
  config = input<Partial<InputDateConfig>>({});

  protected maxView;

  protected minView;

  protected defaultConfig = computed(() => ({
    dateRangeRole: null,
    useTimePicker: true,
    max: null,
    min: null,
    ...this.config(),
  }));

  protected dateControl = new FormControl(new Date());

  protected timerControl = new FormControl('00:00:00', {
    nonNullable: true,
  });

  protected controlDirective = inject(controlDirectiveProvider.directive);

  private _control: FormControl<string> | null = null;

  private _dom = inject(DOCUMENT);

  private _renderer = inject(Renderer2);

  private _injector = inject(Injector);

  private readonly _dateButtonClass = 'input-date-button';

  private _subscription: Subscription[] = [];

  private _adapter = inject(DateAdapter);

  private _destroyRef = inject(DestroyRef);

  private _datePicker = viewChild.required<MatDatepicker<Date>>('datePicker');

  private _matFormat = inject<CustomDateFnsFormat>(MAT_DATE_FORMATS);

  constructor() {
    super();

    const matFormat = this._matFormat;

    toObservable(this.defaultConfig)
      .pipe(
        takeUntilDestroyed(),
        map(config => config.useTimePicker)
      )
      .subscribe(status => {
        matFormat.useTimePicker = status;
      });

    const adapter = this._adapter;

    this.maxView = computed(() =>
      !isNil(this.defaultConfig().max)
        ? adapter.parse(
            this.defaultConfig().max,
            hasTimePickerFormat.parse.dateInput
          )
        : null
    );
    this.minView = computed(() =>
      !isNil(this.defaultConfig().min)
        ? adapter.parse(
            this.defaultConfig().min,
            hasTimePickerFormat.parse.dateInput
          )
        : null
    );
  }

  ngOnInit(): void {
    this._control = this.controlDirective.control;
    const control = this._control;

    if (isNil(control)) {
      return;
    }
    const initValue = (): void => {
      const value = control.value;

      const dateTime = value.split(' ');
      const adapter = this._adapter;
      const time = dateTime[1];

      this.dateControl.setValue(
        adapter.parse(value, hasTimePickerFormat.parse.dateInput)
      );

      this.timerControl.setValue(time);
    };

    initValue();

    control.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(initValue);
  }

  // eslint-disable-next-line max-statements
  protected dateClass = (date: Date): string => {
    const dateRangeRole = this.config().dateRangeRole;
    const [selectedClass, inRangeClass, startDayClass, endDayClass] = [
      'need-mark',
      'in-range',
      'start-day',
      'end-day',
    ];

    if (dateRangeRole === 'start') {
      const selectDate = this.dateControl;

      const inRange = isWithinInterval(date, {
        start: selectDate.value,
        end: this.maxView(),
      });
      const isStartDay = isSameDay(date, selectDate.value ?? '');
      const isEndDay = isSameDay(date, this.maxView() ?? '');

      return (
        this._dateButtonClass +
        (isStartDay || isEndDay ? ` ${selectedClass}` : '') +
        (inRange ? ` ${inRangeClass}` : '') +
        (isStartDay ? ` ${startDayClass}` : '') +
        (isEndDay ? ` ${endDayClass}` : '')
      );
    } else if (dateRangeRole === 'end') {
      const selectDate = this.dateControl;

      const inRange = isWithinInterval(date, {
        start: this.minView(),
        end: selectDate.value,
      });
      const isStartDay = isSameDay(date, this.minView() ?? '');
      const isEndDay = isSameDay(date, selectDate.value ?? '');

      return (
        this._dateButtonClass +
        (isStartDay || isEndDay ? ` ${selectedClass}` : '') +
        (inRange ? ` ${inRangeClass}` : '') +
        (isStartDay ? ` ${startDayClass}` : '') +
        (isEndDay ? ` ${endDayClass}` : '')
      );
    }

    return this._dateButtonClass;
  };

  protected viewChange(view: MatCalendarView): void {
    if (view === 'month') {
      this._reRenderDateCell();
    }
  }

  protected openCalendar(): void {
    // 重新定義日期的日部份模板
    setTimeout(() => {
      ['mat-calendar-next-button', 'mat-calendar-previous-button'].forEach(
        btnClass => {
          const el = this._dom.getElementsByClassName(btnClass)[0];

          // eslint-disable-next-line max-nested-callbacks
          runInInjectionContext(this._injector, () => {
            this._subscription.push(
              fromEvent(el, 'click')
                .pipe(
                  takeUntilDestroyed(inject(DestroyRef)),
                  // eslint-disable-next-line max-nested-callbacks
                  tap(() => {
                    // eslint-disable-next-line max-nested-callbacks
                    setTimeout(() => {
                      this._reRenderDateCell();
                    });
                  })
                )
                .subscribe()
            );
          });
        }
      );

      this._reRenderDateCell();
    });
  }

  protected monthSelected(): void {
    this._reRenderDateCell();
  }

  protected closeCalendar(datepicker: MatDatepicker<Date>): void {
    this._subscription.forEach(s => {
      s.unsubscribe();
    });
    this._subscription = [];
    datepicker._applyPendingSelection();
    this._updateValue();
  }

  protected dateChange(): void {
    this._updateValue();
  }

  // eslint-disable-next-line max-statements
  private _reRenderDateCell(): void {
    const matMonthView = this._dom.getElementsByTagName('mat-month-view')[0];

    if (isNil(matMonthView)) {
      return;
    }
    const nodes = matMonthView.getElementsByClassName(this._dateButtonClass);

    for (let i = 0; i < nodes.length; i++) {
      const el = nodes.item(i) as HTMLButtonElement;

      if (!isNil(el)) {
        const label = el.getAttribute('aria-label');
        const contentEl = el.getElementsByClassName(
          'mat-calendar-body-cell-content'
        )[0];

        this._renderer.addClass(contentEl, 'render-finish');
        this._renderer.setProperty(contentEl, 'textContent', Number(label));
      }
    }
    this._registDateCellClickEvent();
  }

  private _registDateCellClickEvent(): void {
    const nodes = this._dom.getElementsByClassName(this._dateButtonClass);

    for (let i = 0; i < nodes.length; i++) {
      const el = nodes.item(i) as HTMLButtonElement;

      this._subscription.push(
        runInInjectionContext(this._injector, () =>
          fromEvent(el, 'click')
            .pipe(takeUntilDestroyed(inject(DestroyRef)))
            .subscribe(() => {
              this.closeCalendar(this._datePicker());
              this.openCalendar();
              this._adapter.setLocale(zhTW);
            })
        )
      );
    }
  }

  private _updateValue(): void {
    const adapter = this._adapter;
    const timer = this.timerControl.value;
    const format = hasTimePickerFormat.parse.dateInput.split(' ')[0];
    const date = this.dateControl.value;

    const afterFormat = !isNil(date)
      ? `${adapter.format(date, format)} ${timer}`
      : null;

    this._control?.setValue(afterFormat ?? '');

    this.dateControl.setValue(
      adapter.parse(afterFormat, hasTimePickerFormat.parse.dateInput)
    );
  }
}
