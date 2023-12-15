import {
  Directive,
  EventEmitter,
  Input,
  Output,
  inject,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import {
  NgControl,
  type AbstractControl,
  type ControlValueAccessor,
  type FormControlStatus,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { type ValidatorErrorMessage } from '@common/sdk/form';
import isEmpty from 'lodash-es/isEmpty';
import isNull from 'lodash-es/isNull';
import isString from 'lodash-es/isString';
import { type Subscription } from 'rxjs/internal/Subscription';

@Directive({
  selector: 'input[commonControl]',
  standalone: true,
})
export class ControlDirective<ValueT>
  implements ControlValueAccessor, OnInit, OnDestroy
{
  /** 正規表達式 */
  @Input() regex: RegExp[] = [];

  /** 是否為必填 */
  @Input() isRequired = false;

  /** 欄位名稱 */
  @Input() fieldName = '';

  @Output() valueChange: EventEmitter<ValueT> = new EventEmitter<ValueT>();

  @Output() statusChange: EventEmitter<FormControlStatus> =
    new EventEmitter<FormControlStatus>();

  control: AbstractControl<ValueT, ValueT> | null = null;

  /** 從外部注入的表單服務 */
  private _ngControl = inject(NgControl);

  private _valueChangeSub!: Subscription;

  private _statusChangeSub!: Subscription;

  /** input 值 */
  private _value?: ValueT;

  /** 失去焦點後的事件 */
  private _onChange?: (value: ValueT) => void;

  /** 觸碰後事件 */
  private _onTouched?: () => void;

  constructor() {
    this._ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control = this._ngControl.control;
    console.log(this.control);
    if (!isNull(this.control)) {
      this._valueChangeSub = this.control.valueChanges.subscribe(value => {
        this.valueChange.emit(value);
      });
      this._statusChangeSub = this.control.statusChanges.subscribe(status => {
        this.statusChange.emit(status);
      });
    } else {
      console.error(`Control Not Bind On "${this.fieldName}"`);
    }

    this._setValidators();
  }

  ngOnDestroy(): void {
    this._valueChangeSub.unsubscribe();
    this._statusChangeSub.unsubscribe();
  }

  /**
   * 表單值寫入事件
   * @param value - 欲寫入的值
   */
  writeValue(value: ValueT): void {
    this._value = value;
  }

  /**
   * 註冊失去焦點事件
   * @param fn - 想要註冊的事件
   */
  registerOnChange(fn: (value: ValueT) => void): void {
    this._onChange = fn;
  }

  /**
   * 註冊觸碰的事件
   * @param fn - 想要註冊的事件
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  private _setValidators(): void {
    const validatorFns: ValidatorFn[] = [this._getValidatorFn.bind(this)];

    if (this.isRequired) {
      validatorFns.unshift(this._getRequireValidatorFn.bind(this));
    }
    this.control?.addValidators(validatorFns);
    this.control?.updateValueAndValidity();
  }

  /**
   * 註冊自訂必填的驗證函式
   * @param control - 表單實體
   * @returns 自訂驗證函式
   */
  private _getRequireValidatorFn(
    control: AbstractControl
  ): (ValidationErrors & ValidatorErrorMessage) | null {
    if (isNull(control.value) || isEmpty(control.value)) {
      return {
        required: {
          fieldName: this.fieldName,
        },
      };
    }

    return null;
  }

  /**
   * 註冊自訂的驗證函式
   * @param control - 表單實體
   * @returns 自訂驗證函式
   */
  private _getValidatorFn(
    control: AbstractControl
  ): (ValidationErrors & ValidatorErrorMessage) | null {
    const value = control.value as ValueT;

    // 某個格式測試沒過觸發
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-call
    if (isString(value) && !this.regex.every(regex => regex.test(value))) {
      return {
        'regex-pattern-error': {
          fieldName: '',
        },
      };
    }

    return null;
  }
}
