import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  computed,
  contentChildren,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ContentViewChildTypePipe } from '@common/sdk';
import isNil from 'lodash-es/isNil';
import { ButtonComponent } from '../buttons/button/button.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CustomTdDirective } from './directives/custom-td/custom-td.directive';
import { CustomThDirective } from './directives/custom-th/custom-th.directive';
import { Column } from './table.model';
@Component({
  selector: 'app-table',
  imports: [
    ScrollingModule,
    MatTableModule,
    NgTemplateOutlet,
    ContentViewChildTypePipe,
    NgStyle,
    ButtonComponent,
    PaginatorComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<DataT> implements AfterContentInit {
  rowData = input.required<DataT[]>();

  columns = input.required<Column[]>();

  isSticky = input(false);

  usePaginator = input(true);

  rowClick = output<DataT>();

  columnSortClick = output<Column>();

  pageEvent = output<PageEvent>();

  protected sortModeStep = ['swap_vert', 'south', 'north'] as const;

  protected displayedColumns = computed(() =>
    this.columns().map(column => column.field)
  );

  protected dataSource = new MatTableDataSource<DataT>([]);

  protected rowTemplateMap = new Map<
    string,
    TemplateRef<DataT & { $implicit: DataT }>
  >();

  protected columnsForRender = computed(() =>
    this.columns().map(column => ({
      $implicit: column,
      ...column,
    }))
  );

  protected columnSettingKeyMap = computed(() => {
    const map = new Map<string, Column>();
    const columns = this.columns();

    columns.forEach(column => {
      map.set(column.field, column);
    });

    return map;
  });

  protected columnTemplateMap = new Map<string, TemplateRef<Column>>();

  private _tdTemplateRefs = contentChildren(CustomTdDirective);

  private _thTemplateRefs = contentChildren(CustomThDirective);

  constructor() {
    toObservable(this.rowData)
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.dataSource.data = data.map(d => ({
          $implicit: d,
          ...d,
        }));
      });
  }

  ngAfterContentInit(): void {
    this._tdTemplateRefs().forEach(d => {
      this.rowTemplateMap.set(d.field(), d.templateRef);
    });

    this._thTemplateRefs().forEach(d => {
      this.columnTemplateMap.set(d.field(), d.templateRef);
    });
  }

  protected rowClickEvent(data: DataT): void {
    this.rowClick.emit(data);
  }

  protected nextSortStep(column: Column): void {
    if (!isNil(column.sort)) {
      const sort = column.sort + 1;

      column.sort =
        sort >= this.sortModeStep.length ? 0 : (sort as Column['sort']);
      this.columnSortClick.emit(column);
    }
  }
}
