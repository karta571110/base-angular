import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { Router } from '@angular/router';
import { CommonBaseAuthenticationService } from '@common/sdk';
import { TRANSLOCO_SCOPE, TranslocoPipe } from '@jsverse/transloco';
import { HeaderComponent } from '@src/app/layouts/header/header.component';
import { I18nSettingButtonComponent } from '@src/app/shared/components/i18n/i18n-setting-button/i18n-setting-button.component';
import { InputPasswordComponent } from '@src/app/shared/components/input/input-password/input-password.component';
import { InputComponent } from '@src/app/shared/components/input/input-text/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    HeaderComponent,
    I18nSettingButtonComponent,
    TranslocoPipe,
    MatRipple,
    InputPasswordComponent,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'pages/login-index',
        alias: 'li',
      },
      multi: true,
    },
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  protected form;

  private _fb = inject(FormBuilder);

  private _router = inject(Router);

  private _authService = inject(CommonBaseAuthenticationService);

  constructor() {
    this.form = this._fb.group({
      account: '',
      password: '',
    });
  }

  submit(): void {
    const login = this._authService.login({}).subscribe(async () => {
      await this._router.navigate(['main/dashboard/diagrams']);
      login.unsubscribe();
    });
  }
}
