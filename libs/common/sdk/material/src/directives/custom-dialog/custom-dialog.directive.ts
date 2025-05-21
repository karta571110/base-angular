import {
  DestroyRef,
  Directive,
  inject,
  Injector,
  input,
  model,
  OnInit,
  output,
  runInInjectionContext,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import isArray from 'lodash-es/isArray';
import isNil from 'lodash-es/isNil';
import isString from 'lodash-es/isString';

@Directive({
  selector: '[commonCustomDialog]',
  standalone: true,
  exportAs: 'commonCustomDialog',
})
export class CustomDialogDirective<T> implements OnInit {
  isOpen = model.required<boolean>();

  config = input<MatDialogConfig>({});

  dialogType = input<keyof typeof this._dialogType>('common');

  afterDialogOpened = output<MatDialogRef<T>>();

  afterDialogClosed = output();

  private _dialogType = {
    common: 'common-dialog',
    notify: 'notify-dialog',
  } as const;

  private _dialog = inject(MatDialog);

  private _destroyRef = inject(DestroyRef);

  private _dialogRef: MatDialogRef<T> | null = null;

  private _injector = inject(Injector);

  private _templateRef = inject(TemplateRef);

  ngOnInit(): void {
    runInInjectionContext(this._injector, () =>
      toObservable(this.isOpen)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(status => {
          if (status && isNil(this._dialogRef)) {
            this._dialogRef = this._openDialog();
          } else {
            this.close();
            this._dialogRef = null;
          }
        })
    );
  }

  close(): void {
    this._dialogRef?.close();
  }

  private _openDialog(): MatDialogRef<T> {
    const panelClass: string[] = [this._dialogType[this.dialogType()]];
    const customPanelClass = this.config().panelClass;

    if (isString(customPanelClass)) {
      panelClass.push(customPanelClass);
    } else if (isArray(customPanelClass)) {
      panelClass.push(...customPanelClass);
    }
    const dialogRef = this._dialog.open(this._templateRef, {
      ...this.config(),
      panelClass,
    });

    const afterOpened = dialogRef
      .afterOpened()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.afterDialogOpened.emit(dialogRef);
      });
    const afterClosed = dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.afterDialogClosed.emit();
        this.isOpen.set(false);
        afterOpened.unsubscribe();
        afterClosed.unsubscribe();
      });

    return dialogRef;
  }
}
