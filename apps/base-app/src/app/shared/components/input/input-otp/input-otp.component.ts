/* eslint-disable max-lines */
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormRecord,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ifBackspace,
  ifDelete,
  ifLeftArrow,
  ifRightArrow,
  ifSpacebar,
  ifTab,
} from '@common/sdk';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isString from 'lodash-es/isString';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { tap } from 'rxjs/internal/operators/tap';
import { InputOtpConfig } from './input-otp.model';
@Component({
  selector: 'app-input-otp',
  imports: [ReactiveFormsModule],
  templateUrl: './input-otp.component.html',
  styleUrl: './input-otp.component.scss',
  hostDirectives: [controlDirectiveProvider],
})
export class InputOtpComponent implements AfterViewInit, OnInit {
  config = input<InputOtpConfig>({
    length: 6,
    allowNumbersOnly: false,
    autoFocusInputIndex: 0,
    letterCase: 'lower',
  });

  initFormRecord = output<FormRecord<FormControl<unknown>>>();

  protected inputType = computed(() =>
    this.config().allowNumbersOnly ? 'tel' : 'text'
  );

  protected inputPattern = computed(() =>
    this.config().allowNumbersOnly
      ? new RegExp('\\d*', 'g')
      : new RegExp('', 'g')
  );

  protected controls;

  protected form;

  private _inputElements = viewChildren<ElementRef<HTMLInputElement>>('input');

  private _inputElementsMap;

  private _controlDirective = inject(
    ControlDirective<string, FormControl<string>>
  );

  private _control: FormControl | FormControl<string> | null = null;

  private _destroyRef = inject(DestroyRef);

  // eslint-disable-next-line max-lines-per-function
  constructor() {
    const fb = inject(FormBuilder).nonNullable;

    this.controls = computed(() =>
      new Array(this.config().length).fill(null).map(() => fb.control(''))
    );

    this.form = computed(() => {
      const record = fb.record({});

      this.controls().forEach((control, index) => {
        record.addControl(index.toString(), control);
      });
      this.initFormRecord.emit(record);

      return record;
    });
    this._inputElementsMap = computed(() => {
      const inputElements = this._inputElements();
      const map = new Map<number, ElementRef<HTMLInputElement>>();

      inputElements.forEach((inputElement, index) => {
        map.set(index, inputElement);
      });

      return map;
    });
    let formSubscription: Subscription | null = null;

    toObservable(this.form)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(form => {
          formSubscription?.unsubscribe();
          formSubscription = form.valueChanges
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
              // eslint-disable-next-line max-nested-callbacks
              this.controls().forEach(control => {
                const controlValue = control.value;

                if (isNil(controlValue) || controlValue.length <= 1) {
                  return;
                }
                if (controlValue.length >= this.config().length) {
                  this._setValue(controlValue);
                } else {
                  this._rebuildValue();
                }
              });
            });
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      const control = this._controlDirective.control;

      this._control = control;
      control.statusChanges
        .pipe(debounceTime(100), takeUntilDestroyed(this._destroyRef))
        .subscribe(status => {
          const form = this.form();

          if (status === 'DISABLED') {
            form.disable({
              onlySelf: true,
              emitEvent: false,
            });
          } else {
            form.enable({
              onlySelf: true,
              emitEvent: false,
            });
          }
        });
    }
  }

  ngAfterViewInit(): void {
    const input = this._inputElementsMap().get(
      this.config().autoFocusInputIndex
    );

    if (!isNil(input)) {
      input.nativeElement.focus();
    }
  }

  protected focusEvent(): void {
    this.form().markAsTouched();
  }

  // eslint-disable-next-line max-statements
  protected inputEvent(event: Event, currentInputIndex: number): void {
    const target = event.target as HTMLInputElement;

    const controlValue = this._control?.value;
    const newVal =
      !isNil(controlValue) && !isEmpty(controlValue)
        ? `${controlValue}${target.value}`
        : target.value;

    if (this.config().allowNumbersOnly && !this._validateNumber(newVal)) {
      target.value = '';
      event.stopPropagation();
      event.preventDefault();
      this._clearInput(currentInputIndex);

      return;
    }

    if (this._ifValidKeyCode(target.value)) {
      const nextInputIndex = currentInputIndex + 1;

      this._setSelected(nextInputIndex);
    } else {
      console.log('not valid key code');

      target.value = '';
      this.controls()[currentInputIndex].setValue('');
    }
    this._rebuildValue();
  }

  protected keyUpEvent(event: KeyboardEvent, inputIndex: number): void {
    if (ifTab(event)) {
      inputIndex -= 1;
    }

    if (ifRightArrow(event)) {
      event.preventDefault();
      this._setSelected(inputIndex + 1);

      return;
    }
    if (ifLeftArrow(event)) {
      event.preventDefault();
      this._setSelected(inputIndex - 1);

      return;
    }
  }

  protected keyDownEvent(
    event: KeyboardEvent,
    inputIndex: number
  ): boolean | undefined {
    if (ifSpacebar(event)) {
      event.preventDefault();

      return false;
    }
    if (ifBackspace(event)) {
      this._backSpaceEvent(inputIndex);

      return undefined;
    }
    if (ifDelete(event)) {
      this._deleteEvent(inputIndex);

      return undefined;
    }

    return undefined;
  }

  protected pasteEvent(e: ClipboardEvent): void {
    const clipboardData = e.clipboardData;

    if (isNil(clipboardData)) {
      return;
    }
    const pastedData = clipboardData.getData('Text');

    e.stopPropagation();
    e.preventDefault();
    if (
      isNil(pastedData) ||
      (this.config().allowNumbersOnly && !this._validateNumber(pastedData))
    ) {
      return;
    }
    this._setValue(pastedData);
  }

  // eslint-disable-next-line max-statements
  private _setValue(value: number | string): void {
    if (this.config().allowNumbersOnly && !isString(value) && isNaN(value)) {
      return;
    }
    const form = this.form();

    form.reset();
    if (isNil(value)) {
      this._rebuildValue();

      return;
    }
    value = value.toString().replace(/\s/g, ''); // remove whitespace
    Array.from(value).forEach((c, index) => {
      const control = this.controls()[index];

      if (!isNil(control)) {
        control.setValue(c);
      }
    });
    const valueLength = value.length;
    const input = this._inputElementsMap().get(valueLength);

    if (!isNil(input)) {
      this._focusTo(valueLength);
    } else {
      this._focusTo(this.controls().length - 1);
    }
    this._rebuildValue();
  }

  private _deleteEvent(currentInputIndex: number): void {
    const currentControl = this.controls()[currentInputIndex];

    if (isEmpty(currentControl.value)) {
      const prevInputIndex = currentInputIndex - 1;

      this._clearInput(prevInputIndex);
      this._setSelected(prevInputIndex);
    } else {
      this._clearInput(currentInputIndex);
    }
    this._rebuildValue();
  }

  private _ifValidKeyCode(val: string): boolean {
    const inp = val;

    if (this.config().allowNumbersOnly) {
      return this._validateNumber(inp);
    }
    const isMobile = new RegExp(/iPhone|iPad|iPod|Android/i).test(
      navigator.userAgent
    );

    return (
      isMobile ||
      (new RegExp(/^[a-zA-Z0-9%*_\-@#$!]$/g).test(inp) && inp.length === 1)
    );
  }

  private _validateNumber(val: string): boolean {
    return !!(val && new RegExp(/^[0-9]+$/).test(val));
  }

  private _backSpaceEvent(currentInputIndex: number): void {
    const currentControl = this.controls()[currentInputIndex];

    if (isEmpty(currentControl.value)) {
      const prevInputIndex = currentInputIndex - 1;

      this._clearInput(prevInputIndex);
      this._setSelected(prevInputIndex);
    } else {
      this._clearInput(currentInputIndex);
    }
    this._rebuildValue();
  }

  private _clearInput(inputIndex: number): void {
    const control = this.controls()[inputIndex];

    if (!isNil(control)) {
      control.setValue('');
    }
  }

  private _focusTo(inputIndex: number): void {
    this._controlDirective.onTouched();
    const input = this._inputElementsMap().get(inputIndex);

    if (!isNil(input)) {
      input.nativeElement.focus();
    }
  }

  private _setSelected(inputIndex: number): void {
    this._focusTo(inputIndex);
    const input = this._inputElementsMap().get(inputIndex);
    const ele = input?.nativeElement;

    if (!isNil(ele)) {
      ele.setSelectionRange(0, 1);
    }
  }

  // eslint-disable-next-line max-statements
  private _rebuildValue(): void {
    let val = '';
    const config = this.config();

    // eslint-disable-next-line max-statements
    this.controls().forEach(control => {
      let controlValue = control.value;

      if (isNil(controlValue) || isEmpty(controlValue)) {
        return;
      }
      const isLengthExceed = controlValue.length > 1;
      let isCaseTransformEnabled =
        !config.allowNumbersOnly && config.letterCase;

      controlValue = controlValue[0];
      const transformedVal = isCaseTransformEnabled
        ? config.letterCase === 'upper'
          ? controlValue.toUpperCase()
          : controlValue.toLowerCase()
        : controlValue;

      if (isCaseTransformEnabled && transformedVal === controlValue) {
        isCaseTransformEnabled = false;
      } else {
        controlValue = transformedVal;
      }

      val += controlValue;

      if (isLengthExceed || isCaseTransformEnabled) {
        control.setValue(controlValue);
      }
    });
    const currentControl = this._control;

    currentControl?.setValue(val, {
      emitEvent: false,
    });
  }
}
