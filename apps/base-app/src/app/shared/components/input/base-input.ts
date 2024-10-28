import { Component, input } from '@angular/core';

@Component({
  template: '',
})
export class BaseInputComponent {
  label = input<string>('');

  placeholder = input<string | null>(null);

  iconName = input<string | null>(null);
}
