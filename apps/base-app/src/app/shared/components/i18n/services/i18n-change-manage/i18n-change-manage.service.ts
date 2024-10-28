import { Injectable, inject, signal } from '@angular/core';
import {
  LangDefinition,
  TranslocoEvents,
  TranslocoService,
} from '@jsverse/transloco';
import { Observable } from 'rxjs/internal/Observable';
import { filter } from 'rxjs/internal/operators/filter';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class I18nChangeManageService {
  availableLangs = signal<LangDefinition[]>([]);

  activeLang = signal<LangDefinition | null>(null);

  private _i18n = inject(TranslocoService);

  constructor() {
    this.availableLangs.set(this._i18n.getAvailableLangs() as LangDefinition[]);
    this._changeLangs();
  }

  langChange$(): Observable<TranslocoEvents> {
    return this._i18n.events$.pipe(
      filter(event => event.type === 'langChanged'),
      tap(() => {
        this._changeLangs();
      })
    );
  }

  langChange(lang: LangDefinition): void {
    this._i18n.setActiveLang(lang.id);
  }

  private _changeLangs(): void {
    this.activeLang.set(
      this.availableLangs().find(
        item => item.id === this._i18n.getActiveLang()
      ) ?? null
    );
  }
}
