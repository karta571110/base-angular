import { NgStyle } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [NgStyle],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  iconName = input.required<string>();

  config = input<Partial<typeof this._defaultConfig>>({});

  protected configFormat;

  private _defaultConfig = {
    size: '24px',
    color: 'inherit',
  };

  constructor() {
    this.configFormat = computed(() => ({
      ...this._defaultConfig,
      ...this.config(),
    }));
  }
}
