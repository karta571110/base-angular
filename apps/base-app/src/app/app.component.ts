import { Component, Injector, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonLoaderComponent } from '@common/sdk/ui';
import { ValidateMessageComponent } from './shared/components/validate-message/validate-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ValidateMessageComponent, CommonLoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'base-app';

  i = inject(Injector);

  a = new FormControl('d', {
    updateOn: 'change',
  });

  constructor() {
    this.a.setErrors({
      required: {
        fieldName: 'a欄位',
      },
    });
    console.log(this.a);
  }
}

interface A {}
