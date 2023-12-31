import {
  ChangeDetectorRef,
  Pipe,
  inject,
  type OnDestroy,
  type PipeTransform,
} from '@angular/core';
import { type AbstractControl } from '@angular/forms';
import {
  TRANSLOCO_SCOPE,
  TranslocoService,
  type OrArray,
  type ProviderScope,
  type Translation,
  type TranslocoScope,
} from '@ngneat/transloco';
import isArray from 'lodash-es/isArray';
import isEmpty from 'lodash-es/isEmpty';
import isNull from 'lodash-es/isNull';
import isString from 'lodash-es/isString';
import { forkJoin, switchMap } from 'rxjs';
import { type Observable } from 'rxjs/internal/Observable';
import { type Subscription } from 'rxjs/internal/Subscription';
import { of } from 'rxjs/internal/observable/of';
import { type MessageData, type ValidatorErrorMessage } from '../../models';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe<
    customMessageDataT extends Record<string, unknown> = MessageData,
  >
  implements PipeTransform, OnDestroy
{
  private _translocoService = inject(TranslocoService);

  private _cdr = inject(ChangeDetectorRef);

  private _localeChangeSub: Subscription | null =
    this._translocoService.langChanges$.subscribe(() => {
      this._cdr.markForCheck();
    });

  private _i18nScope: OrArray<TranslocoScope> = inject(TRANSLOCO_SCOPE);

  private _loadEvent: Subscription | null =
    this._translocoService.events$.subscribe(e => {
      if (e.type === 'translationLoadSuccess') {
        this._cdr.markForCheck();
      }
    });

  transform(control: AbstractControl | null): Observable<string[]> {
    console.log('trans');

    if (isNull(control)) return of([]);
    const errors =
      control.errors as ValidatorErrorMessage<customMessageDataT> | null;

    if (isNull(errors)) return of([]);
    const scopes = this._getScopes().map(scope =>
        this._convertToCamelCase(scope)
      ),
      errorKeys: (keyof ValidatorErrorMessage<customMessageDataT>)[] =
        Object.keys(
          errors
        ) as (keyof ValidatorErrorMessage<customMessageDataT>)[];

    return this._load().pipe(
      switchMap(() =>
        of(
          errorKeys.map(key => {
            let message = '';

            for (const scope of scopes) {
              const translationKey = !isEmpty(scope)
                ? `${scope}.${key as string}`
                : key;

              message = this._translocoService.translate(
                translationKey as string,
                errors[key] ?? {}
              );

              if (message !== translationKey) {
                break;
              }
            }

            return message;
          })
        )
      )
    );
  }

  ngOnDestroy(): void {
    if (!isNull(this._localeChangeSub)) {
      this._localeChangeSub.unsubscribe();
    }
    if (!isNull(this._loadEvent)) {
      this._loadEvent.unsubscribe();
    }

    // Caretaker note: it's important to clean up references to subscriptions since they save the `next`
    // callback within its `destination` property, preventing classes from being GC'd.
    this._localeChangeSub = null;
    this._loadEvent = null;
  }

  private _load(): Observable<Translation[]> {
    const activeLang = this._translocoService.getActiveLang(),
      scopes: string[] = this._getScopes();

    return forkJoin(
      scopes.map(scope => this._translocoService.load(`${scope}/${activeLang}`))
    );
  }

  private _isProviderScope(value: TranslocoScope): value is ProviderScope {
    return !isString(value);
  }

  private _getScopes(): string[] {
    const i18nScope = this._i18nScope;
    let scopes: string[] = [];

    if (isArray(i18nScope)) {
      scopes = i18nScope.map(s =>
        this._isProviderScope(s) ? s.scope : s ?? ''
      );
    } else {
      scopes = [
        this._isProviderScope(i18nScope) ? i18nScope.scope : i18nScope ?? '',
      ];
    }
    const sdkFormIndex = scopes.findIndex(scope => scope === 'sdk-form');

    if (sdkFormIndex !== -1) {
      const sdkFormStr = scopes.splice(sdkFormIndex, 1)[0];

      scopes.push(...['', sdkFormStr]);
    }

    return scopes;
  }

  private _convertToCamelCase(key: string): string {
    return key.replaceAll(/-([a-z])/g, (_match, char: string) =>
      char.toUpperCase()
    );
  }
}
