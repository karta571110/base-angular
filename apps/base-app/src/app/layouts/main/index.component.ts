import { Component, inject, OnDestroy, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScreenService } from '@common/sdk';
import isUndefined from 'lodash-es/isUndefined';
import { from } from 'rxjs/internal/observable/from';
import { of } from 'rxjs/internal/observable/of';
import { filter } from 'rxjs/internal/operators/filter';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-main-index',
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent implements OnDestroy {
  protected screenService = inject(ScreenService);

  private _router = inject(Router);

  private _drawer = viewChild('drawer', {
    read: MatDrawer,
  });

  private _drawerCloseFullscreen = toObservable(this.screenService.isFullScreen)
    .pipe(
      filter(res => res),
      switchMap(() => {
        const drawer = this._drawer();

        if (!isUndefined(drawer)) {
          return from(drawer.close());
        }

        return of();
      })
    )
    .subscribe();

  private _drawerCloseRoute = this._router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const drawer = this._drawer();

      if (drawer) {
        drawer.opened = false;
      }
    }
  });

  ngOnDestroy(): void {
    this._drawerCloseRoute.unsubscribe();
    this._drawerCloseFullscreen.unsubscribe();
  }
}
