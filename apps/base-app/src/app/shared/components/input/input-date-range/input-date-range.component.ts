import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatCalendarCellCssClasses,
  MatCalendarView,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import { TranslocoService } from '@jsverse/transloco';
import { Locale, enUS, zhCN, zhTW } from 'date-fns/locale';
import isNull from 'lodash-es/isNull';
import { Subscription } from 'rxjs/internal/Subscription';
import { ValidateMessageComponent } from '../../validate-message/validate-message.component';
import { BaseInputComponent } from '../base-input';
import { CustomDateRange } from './model';
const locale: Record<string, Locale> = {
  zh: zhTW,
  cn: zhCN,
  en: enUS,
};

@Component({
  selector: 'app-input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    ControlDirective,
    ValidateMessageComponent,
  ],
  hostDirectives: [controlDirectiveProvider],
  providers: [
    provideDateFnsAdapter({
      parse: {
        dateInput: 'yyyy/MM/dd',
      },
      display: {
        dateInput: 'yyyy/MM/dd',
        monthYearLabel: 'uuuu LLL',
        dateA11yLabel: 'dd',
        monthYearA11yLabel: 'dd',
      },
    }),
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (translocoService: TranslocoService) =>
        locale[translocoService.getActiveLang()],
      deps: [TranslocoService],
    },
  ],
})
export class InputDateRangeComponent
  extends BaseInputComponent
  implements OnInit, OnDestroy
{
  startDatePlaceholder = input<string>('');

  endDatePlaceholder = input<string>('');

  protected dateRangeGroup;

  protected control: FormControl<CustomDateRange> | null = null;

  private _fb = inject(FormBuilder);

  private _dom = inject(DOCUMENT);

  private _renderer = inject(Renderer2);

  private _controlDirective = inject(
    ControlDirective<CustomDateRange, FormControl<CustomDateRange>>
  );

  private _dateRangeGroupValueChange: Subscription | null = null;

  private _dateClass = 'input-date-range';

  private _changeMonthBtnListen: (() => void) | null = null;

  private _dateAdapter = inject(DateAdapter);

  private _changeLanguage = inject(TranslocoService).langChanges$.subscribe(
    lang => {
      this._dateAdapter.setLocale(locale[lang]);
    }
  );

  constructor() {
    super();
    this.dateRangeGroup = this._fb.group({
      start: new Date(),
      end: new Date(),
    });
  }

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      this.control = this._controlDirective.control;
      const control = this.control;

      this.dateRangeGroup.setValue({
        start: control.value.start,
        end: control.value.end,
      });
      this._dateRangeGroupValueChange =
        this.dateRangeGroup.valueChanges.subscribe(({ start, end }) => {
          if (!isNull(this.control)) {
            console.log(start, end);
            this.control.value;
            this.control.setValue({
              start: start ?? null,
              end: end ?? null,
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (!isNull(this._dateRangeGroupValueChange)) {
      this._dateRangeGroupValueChange.unsubscribe();
    }
    if (!isNull(this._changeMonthBtnListen)) {
      this._changeMonthBtnListen();
    }
    this._changeLanguage.unsubscribe();
  }

  protected dateClass(): MatCalendarCellCssClasses {
    return this._dateClass;
  }

  protected openCalendar(): void {
    // 重新定義日期的日部份模板
    setTimeout(() => {
      ['mat-calendar-next-button', 'mat-calendar-previous-button'].forEach(
        btnClass => {
          const el = this._dom.getElementsByClassName(btnClass)[0];

          this._changeMonthBtnListen = this._renderer.listen(
            el,
            'click',
            // eslint-disable-next-line max-nested-callbacks
            () => {
              this._reRenderDateCell();
            }
          );
        }
      );
      this._reRenderDateCell();
    });
  }

  protected closeCalendar(): void {
    if (!isNull(this._changeMonthBtnListen)) {
      this._changeMonthBtnListen();
    }
  }

  protected viewChange(view: MatCalendarView): void {
    if (view === 'month') {
      this._reRenderDateCell();
    }
  }

  private _reRenderDateCell(): void {
    const nodes = this._dom.getElementsByClassName(this._dateClass);

    for (let i = 0; i < nodes.length; i++) {
      const el = nodes.item(i) as HTMLButtonElement;

      if (!isNull(el)) {
        const label = el.getAttribute('aria-label');
        const contentEl = el.getElementsByClassName(
          'mat-calendar-body-cell-content'
        )[0];

        this._renderer.setProperty(contentEl, 'textContent', Number(label));
      }
    }
  }
}
