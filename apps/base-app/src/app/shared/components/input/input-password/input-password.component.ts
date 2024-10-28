import { Component, computed, input, signal } from '@angular/core';
import { controlDirectiveProvider } from '@common/sdk/form';
import { InputComponent } from '../input-text/input.component';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './input-password.component.html',
  hostDirectives: [controlDirectiveProvider],
})
export class InputPasswordComponent {
  label = input<string>('');

  placeholder = input<string | null>(null);

  protected iconName;

  protected inputType;

  private _isVisible = signal<boolean>(true);

  constructor() {
    this.iconName = computed<string>(() =>
      this._isVisible() ? 'visibility_off' : 'visibility'
    );
    this.inputType = computed<string>(() =>
      this._isVisible() ? 'password' : 'text'
    );
  }

  protected clickIcon(): void {
    this._isVisible.update(status => !status);
  }
}
