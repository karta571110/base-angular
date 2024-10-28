import { DOCUMENT } from '@angular/common';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import isNull from 'lodash-es/isNull';
import { from } from 'rxjs/internal/observable/from';

@Injectable({
  providedIn: 'root',
})
export class ScreenService implements OnDestroy {
  isFullScreen;

  private _dom = inject(DOCUMENT);

  constructor() {
    this.isFullScreen = signal(!isNull(this._dom.fullscreenElement));
    this._dom.addEventListener(
      'fullscreenchange',
      this._updateIsFullScreen.bind(this),
      false
    );
  }

  ngOnDestroy(): void {
    this._dom.removeEventListener(
      'fullscreenchange',
      this._updateIsFullScreen.bind(this)
    );
  }

  activeFullScreen(el = this._dom.body): void {
    from(el.requestFullscreen()).subscribe(() => {
      this._updateIsFullScreen();
    });
  }

  exitFullScreen(): void {
    if (this._dom.fullscreenElement) {
      from(this._dom.exitFullscreen()).subscribe(() => {
        this._updateIsFullScreen();
      });
    }
  }

  private _updateIsFullScreen(): void {
    this.isFullScreen.set(!isNull(this._dom.fullscreenElement));
  }
}
