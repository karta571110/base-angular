import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Swiper } from 'swiper';
import { SwiperOptions } from 'swiper/types';
@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
  data = input.required<unknown[]>();

  options = input.required<SwiperOptions>();

  hasPagination = input(false);

  hasNavigation = input(false);

  hasScrollbar = input(false);

  slideTemplate =
    input.required<
      TemplateRef<{ $implicit: unknown; index: number; last: boolean }>
    >();

  private _swiper: Swiper | null = null;

  private _container = viewChild('container', {
    read: ElementRef<HTMLDivElement>,
  });

  private _dataChange = toObservable(this.data).subscribe(() => {
    this._swiper?.update();
  });

  ngAfterViewInit(): void {
    this._swiper = new Swiper(this._container()?.nativeElement, this.options());
  }

  ngOnDestroy(): void {
    this._swiper?.destroy();
    this._dataChange.unsubscribe();
  }
}
