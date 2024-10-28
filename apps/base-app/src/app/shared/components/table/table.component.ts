import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  computed,
  contentChildren,
  input,
  OnDestroy,
  output,
  TemplateRef,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ContentViewChildTypePipe } from '@common/sdk';
import { TranslocoModule } from '@jsverse/transloco';
import { CustomTdDirective } from './directives/custom-td/custom-td.directive';
import { CustomThDirective } from './directives/custom-th/custom-th.directive';
import { Column } from './table.model';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    ScrollingModule,
    MatTableModule,
    TranslocoModule,
    NgTemplateOutlet,
    ContentViewChildTypePipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<DataT> implements AfterContentInit, OnDestroy {
  rowData = input<DataT[]>([]);

  columns = input<Column[]>([]);

  isSticky = input(false);

  rowClick = output<DataT>();

  protected displayedColumns = computed(() =>
    this.columns().map(column => column.field)
  );

  protected dataSource = new MatTableDataSource(this.rowData());

  protected rowTemplateMap = new Map<string, TemplateRef<DataT>>();

  protected columnTemplateMap = new Map<string, TemplateRef<Column>>();

  private _rowData$ = toObservable(this.rowData).subscribe(data => {
    this.dataSource.data = data;
  });

  private _tdTemplateRefs = contentChildren(CustomTdDirective);

  private _thTemplateRefs = contentChildren(CustomThDirective);

  ngAfterContentInit(): void {
    this._tdTemplateRefs().forEach(d => {
      this.rowTemplateMap.set(d.field(), d.templateRef);
    });

    this._thTemplateRefs().forEach(d => {
      this.columnTemplateMap.set(d.field(), d.templateRef);
    });
  }

  ngOnDestroy(): void {
    this._rowData$.unsubscribe();
  }

  protected rowClickEvent(data: DataT): void {
    this.rowClick.emit(data);
  }
}
