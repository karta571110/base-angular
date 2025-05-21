import {
  Component,
  computed,
  inject,
  Injector,
  input,
  runInInjectionContext,
  Signal,
  type OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import isArray from 'lodash-es/isArray';
import { BaseInputComponent } from '../base-input';
import { SelectOption } from './select.model';
@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  imports: [ReactiveFormsModule, MatSelectModule],
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

  protected currentSelect: Signal<string> | null = null;

  private _controlDirective = inject(
    ControlDirective<ValueT, FormControl<ValueT>>
  );

  private _injector = inject(Injector);

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      const control = this._controlDirective.control;

      this.control = control;
      // 將顯示值轉換為選項名稱
      const valueChangeSignal = runInInjectionContext(this._injector, () =>
        toSignal(control.valueChanges, {
          initialValue: control.value,
        })
      );

      this.currentSelect = computed(() => {
        const value = valueChangeSignal();

        if (isArray(value)) {
          return value
            .map(v => {
              // eslint-disable-next-line max-nested-callbacks
              const option = this.options().find(o => o.optionValue === v);

              return option ? option.optionName : v;
            })
            .join(',');
        }

        return valueChangeSignal();
      });
      // value => (isArray(value) ? value.map(v => v) : value)
    }
  }
}
