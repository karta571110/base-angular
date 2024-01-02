import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { CommonLoaderService } from '@common/sdk';
import { type Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'common-loader',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './common-loader.component.html',
  styleUrl: './common-loader.component.scss',
})
export class CommonLoaderComponent {
  @Input() isDisplayLoader = true;

  protected isLoading$: Observable<boolean> =
    inject(CommonLoaderService).loading$;
}
