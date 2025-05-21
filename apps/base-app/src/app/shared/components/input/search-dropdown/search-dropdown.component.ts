import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import Fuse from 'fuse.js';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import isString from 'lodash-es/isString';
import { BaseInputComponent } from '../base-input';
import { SelectOption } from '../input-select/select.model';
import { InputComponent } from '../input-text/input.component';

@Component({
  selector: 'app-search-dropdown',
  imports: [InputComponent, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './search-dropdown.component.html',
  hostDirectives: [controlDirectiveProvider],
})
export class SearchDropdownComponent<ValueT>
  extends BaseInputComponent
  implements OnInit
{
  /** 選項 */
  options = input<SelectOption<ValueT>[]>([]);

  /** 關鍵字搜尋欄位 */
  keywords = input<string[] | null>(null);

  /** 選項鍵值 */
  optionIdField = input<string | null>(null);

  searchChange = output<string>();

  optionSelected = output<ValueT>();

  inputEnterKeyup = output<string>();

  protected searchTextControl = new FormControl<string>('', {
    nonNullable: true,
  });

  protected filteredOptions = signal<SelectOption<ValueT>[]>(this.options());

  protected control: FormControl<ValueT[]> | null = null;

  private _controlDirective = inject(
    ControlDirective<ValueT[], FormControl<ValueT[]>>
  );

  private _autoComplete = viewChild.required<MatAutocomplete>('autoComplete');

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      this.control = this._controlDirective.control;
    }
  }

  protected enterHandle(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' &&
      ((this._autoComplete().isOpen &&
        !this._autoComplete().options.some(o => o.active)) ||
        this.options().length <= 0)
    ) {
      this.inputEnterKeyup.emit(this.searchTextControl.value);
      this.searchTextControl.patchValue('');
    }
  }

  // eslint-disable-next-line max-statements
  protected searchChangeEvent(query = this.searchTextControl.value): void {
    this.searchChange.emit(query);
    if (isEmpty(query)) {
      this.filteredOptions.set(this.options());

      return;
    }
    const customKeys = this.keywords();
    const allKeys: string[] = [];

    if (isNil(customKeys)) {
      this.options().forEach(o => {
        const keys = this._findStringKeysRecursive(o);

        allKeys.push(...keys);
      });
    } else {
      allKeys.push(...customKeys);
    }
    const keySet = new Set<string>(allKeys);

    const fuse = new Fuse<SelectOption<ValueT>>(this.options(), {
      keys: Array.from(keySet),
    });

    this.filteredOptions.set(
      fuse.search<SelectOption<ValueT>>(query).map(r => r.item)
    );
  }

  protected optionSelectedEvent(e: MatAutocompleteSelectedEvent): void {
    e.option.deselect();
    const selected = this.filteredOptions().find(
      o => e.option.value === o.optionValue
    );
    const control = this.control;

    if (isNil(selected) || isNil(control)) {
      console.error('Option Not Found');

      return;
    }
    this.optionSelected.emit(selected.optionValue);
    this.searchTextControl.patchValue('');
  }

  private _findStringKeysRecursive(data: unknown, prefix = ''): string[] {
    let keys: string[] = [];

    // 如果是陣列：遍歷所有元素
    if (Array.isArray(data)) {
      data.forEach(element => {
        if (isString(element)) {
          keys.push(prefix);
        } else if (isObject(element) && !isNil(element)) {
          keys = keys.concat(this._findStringKeysRecursive(element, prefix));
        }
      });
    }
    // 如果是物件：遍歷物件內每個屬性
    else if (
      isObject(data) &&
      !isEmpty<object>(data) &&
      !isString(data) &&
      !isNil(data)
    ) {
      Object.keys(data).forEach(key => {
        const value = data[key];
        const currentPath = prefix ? `${prefix}.${key}` : key;

        if (isString(value)) {
          keys.push(currentPath);
        } else if (isObject(value) && !isNil(value)) {
          // 若為物件或陣列則遞迴搜尋
          keys = keys.concat(this._findStringKeysRecursive(value, currentPath));
        }
      });
    }

    return keys;
  }
}
