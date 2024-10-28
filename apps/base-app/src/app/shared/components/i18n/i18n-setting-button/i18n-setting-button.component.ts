import { Component, OnDestroy, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { I18nChangeManageService } from '../services/i18n-change-manage/i18n-change-manage.service';

@Component({
  selector: 'app-i18n-setting-button',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './i18n-setting-button.component.html',
  styleUrl: './i18n-setting-button.component.scss',
})
export class I18nSettingButtonComponent implements OnDestroy {
  protected i18nChangeManageService = inject(I18nChangeManageService);

  private _langsChange$ = this.i18nChangeManageService
    .langChange$()
    .subscribe();

  ngOnDestroy(): void {
    this._langsChange$.unsubscribe();
  }
}
