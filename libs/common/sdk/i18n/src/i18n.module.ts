import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: navigator.language,
    },
  ],
})
export class I18nModule {}
