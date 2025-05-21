import { Component, input, output } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { IconComponent } from '../../icon/icon.component';
@Component({
  selector: 'app-button',
  imports: [MatRipple, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  isDisabled = input(false);

  buttonType = input<'no-style' | 'normal' | 'primary'>('primary');

  iconName = input<string | null>(null);

  type = input<HTMLButtonElement['type']>('button');

  onclick = output<MouseEvent>();
}
