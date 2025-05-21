import { NgClass } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs/internal/operators/map';
import { pairwise } from 'rxjs/internal/operators/pairwise';
import { tap } from 'rxjs/internal/operators/tap';
import { ButtonComponent } from '../buttons/button/button.component';
import { IconComponent } from '../icon/icon.component';
import { SelectOption } from '../input/input-select/select.model';
@Component({
  selector: 'app-paginator',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    ButtonComponent,
    IconComponent,
    NgClass,
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  dataLength = input<number>(0);

  pageSizeOptions = input<number[]>([5, 10, 25]);

  pageIndex = model(0);

  previousPageIndex;

  pageEvent = output<PageEvent>();

  protected pageSizeControl = new FormControl(this.pageSizeOptions()[0], {
    nonNullable: true,
  });

  protected pageSizeOptionsFormat = computed<SelectOption<number>[]>(() =>
    this.pageSizeOptions().map(value => ({
      optionName: `${value} / 頁`,
      optionValue: value,
    }))
  );

  protected centerPageButton = computed<number[]>(() => {
    let startPageIndex = this.pageIndex() - 2;

    return new Array(5).fill(null).map(() => startPageIndex++);
  });

  protected totalPage;

  private _pageSizeValueChange = toSignal(
    this.pageSizeControl.valueChanges.pipe(
      tap(() => {
        this.pageIndex.set(0);
        this.pageEvent.emit(this._getPageEvent());
      })
    ),
    {
      initialValue: this.pageSizeControl.value,
    }
  );

  constructor() {
    this.previousPageIndex = computed(() =>
      toSignal(
        toObservable(this.pageIndex).pipe(
          takeUntilDestroyed(),
          pairwise(),
          map(([oldVal]) => oldVal)
        ),
        {
          initialValue: this.pageIndex(),
        }
      )
    );

    this.totalPage = computed(() => {
      const pageSize = this._pageSizeValueChange();

      return Math.ceil(this.dataLength() / pageSize);
    });
  }

  protected handlePageEvent(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPage()) {
      return;
    }
    this.pageIndex.set(pageIndex);
    this.pageEvent.emit(this._getPageEvent());
  }

  private _getPageEvent(): PageEvent {
    return {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSizeControl.value,
      length:
        this.pageIndex() === this.totalPage() - 1
          ? this.dataLength() % this._pageSizeValueChange()
          : this.pageSizeControl.value,
    };
  }
}
