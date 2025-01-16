import { Component, inject, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonLoaderService } from '@common/sdk';

@Component({
  selector: 'common-loader',
  imports: [MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './common-loader.component.html',
  styleUrl: './common-loader.component.scss',
})
export class CommonLoaderComponent {
  isDisplayLoader = input(false);

  isLoadApi = input(true);

  loaderType = input<'progressbar' | 'spinner'>('spinner');

  position = input<'bottom' | 'center' | 'top'>('center');

  protected commonLoaderService: CommonLoaderService =
    inject(CommonLoaderService);

  protected contextEvent(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
  }
}
