import {
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  input,
  linkedSignal,
  OnInit,
  output,
  runInInjectionContext,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ControlDirective, controlDirectiveProvider } from '@common/sdk/form';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import { BaseInputComponent } from '../base-input';
import { SelectOption } from '../input-select/select.model';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';
import { TagList } from './tag-dropdown.model';
@Component({
  selector: 'app-tag-dropdown',
  imports: [SearchDropdownComponent, ReactiveFormsModule, MatChipsModule],
  templateUrl: './tag-dropdown.component.html',
  styleUrl: './tag-dropdown.component.scss',
  hostDirectives: [controlDirectiveProvider],
})
export class TagDropdownComponent extends BaseInputComponent implements OnInit {
  options = input.required<SelectOption<TagList>[]>();

  optionIdField = input.required<keyof TagList>();

  removeTag = output<TagList>();

  addTag = output<TagList>();

  protected filterOptions = linkedSignal<SelectOption<TagList>[]>(() =>
    this.options().filter(o => !this._isRepeat(o.optionValue))
  );

  protected tagList = computed<TagList[]>(() => []);

  protected control: FormControl<TagList[]> | null = null;

  private _controlDirective = inject(
    ControlDirective<TagList[], FormControl<TagList[]>>
  );

  private _injector = inject(Injector);

  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (this._controlDirective.control instanceof FormControl) {
      const control = this._controlDirective.control;

      this.control = control;
      this.control.valueChanges
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => {
          this._setFilterOptions();
        });
      this.tagList = runInInjectionContext(this._injector, () =>
        toSignal(control.valueChanges, {
          initialValue: control.value,
        })
      );
    }
  }

  protected createNewTag(tagName: string): void {
    console.log(tagName);
    // TODO:這裡新增標籤
  }

  protected removeTagEvent(tagId: string): void {
    const value = this.control?.value;

    if (isNil(value)) {
      return;
    }
    const tagIndex = value.findIndex(tag => tag.id === tagId);

    this.removeTag.emit(value.splice(tagIndex, 1)[0]);
    this.control?.setValue(value);
  }

  protected searchChangeEvent(): void {
    this._setFilterOptions();
  }

  protected optionSelectedEvent(optionValue: TagList): void {
    const control = this.control;

    if (!isNil(control) && !this._isRepeat(optionValue)) {
      control.setValue([...control.value, optionValue]);
      this.addTag.emit(optionValue);
    } else {
      console.error('選項已存在');
    }
  }

  private _setFilterOptions(): void {
    this.filterOptions.set(
      this.options().filter(o => !this._isRepeat(o.optionValue))
    );
  }

  private _isRepeat(comparedOption: TagList): boolean {
    const controlValue = this.control?.value;

    if (!isNil(controlValue)) {
      const optionIdField = this.optionIdField();

      return controlValue.some(v =>
        !isNil(optionIdField) &&
        isObject(v) &&
        !isEmpty<object>(v) &&
        isObject(comparedOption) &&
        !isEmpty<object>(comparedOption)
          ? v[optionIdField] === comparedOption[optionIdField]
          : v === comparedOption
      );
    }

    return false;
  }
}
