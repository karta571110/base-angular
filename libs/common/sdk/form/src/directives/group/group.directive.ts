import {
  Directive,
  inject,
  output,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormGroupDirective,
  type ControlValueAccessor,
  type FormControlStatus,
} from '@angular/forms';
import isNull from 'lodash-es/isNull';
import { type Subscription } from 'rxjs/internal/Subscription';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Directive({
  selector: '[commonGroup]',
  standalone: true,
})
export class GroupDirective<
    formGroupT extends {
      [K in keyof formGroupT]: AbstractControl | unknown;
    },
  >
  implements ControlValueAccessor, OnInit, OnDestroy
{
  valueChange = output<formGroupT>();

  statusChange = output<FormControlStatus>();

  formGroup: FormGroup | null = null;

  /** 從外部注入的表單服務 */
  private _formGroupDirective = inject(FormGroupDirective);

  private _valueChangeSub!: Subscription;

  private _statusChangeSub!: Subscription;

  /** input 值 */
  private _value?: formGroupT;

  /** 失去焦點後的事件 */
  private _onChange?: (value: formGroupT) => void;

  /** 觸碰後事件 */
  private _onTouched?: () => void;

  ngOnInit(): void {
    const group = this._formGroupDirective.form;

    if (isNull(group)) {
      return;
    }
    this.formGroup = group;

    if (!isNull(group)) {
      this._valueChangeSub = group.valueChanges
        .pipe(debounceTime(100))
        .subscribe(value => {
          this.valueChange.emit(value);
        });
      this._statusChangeSub = group.statusChanges
        .pipe(debounceTime(100))
        .subscribe(status => {
          this.statusChange.emit(status);
        });
    }
  }

  ngOnDestroy(): void {
    this._valueChangeSub.unsubscribe();
    this._statusChangeSub.unsubscribe();
  }

  /**
   * 表單值寫入事件
   * @param value - 欲寫入的值
   */
  writeValue(value: formGroupT): void {
    this._value = value;
  }

  /**
   * 註冊失去焦點事件
   * @param fn - 想要註冊的事件
   */
  registerOnChange(fn: (value: formGroupT) => void): void {
    this._onChange = fn;
  }

  /**
   * 註冊觸碰的事件
   * @param fn - 想要註冊的事件
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
