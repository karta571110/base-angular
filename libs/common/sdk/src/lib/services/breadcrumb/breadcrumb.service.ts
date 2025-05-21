import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import isUndefined from 'lodash-es/isUndefined';

import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { Breadcrumb, CommonRoute } from '../../models';
/** 麵包屑 服務 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  /** 目前麵包屑資訊主題 */
  breadcrumbs;

  /** 路由服務 */
  private _router = inject(Router);

  constructor() {
    this.breadcrumbs = toSignal(
      this._router.events.pipe(
        filter(event => event instanceof ChildActivationEnd),
        distinctUntilChanged(),
        map(e => this._createBreadcrumbs(e))
      ),
      {
        initialValue: this._createBreadcrumbs(inject(ActivatedRoute)),
      }
    );
  }

  /**
   * 建立麵包屑資訊
   * @param rootRoute - 路由資訊
   * @returns 麵包屑資訊
   */
  // eslint-disable-next-line max-statements
  private _createBreadcrumbs(
    rootRoute: ActivatedRoute | ChildActivationEnd
  ): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];
    let children = rootRoute.snapshot.firstChild;
    let routePath = '';

    while (children !== null) {
      const routeUrl: string = children.url
        .map(segment => segment.path)
        .join('/');

      if (routeUrl.length > 0) {
        routePath += `/${routeUrl}`;
      } else {
        children = children.firstChild;
        continue;
      }

      const routeConfig = children.routeConfig as CommonRoute;
      const title = routeConfig.title;

      if (!isUndefined(title)) {
        breadcrumbs.push({
          breadcrumbLabel: title as string,
          routePath: routePath,
        });
      }
      children = children.firstChild;
    }

    return breadcrumbs;
  }
}
