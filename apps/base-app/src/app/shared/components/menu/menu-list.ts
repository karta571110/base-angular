import {
  type Injector,
  linkedSignal,
  runInInjectionContext,
  signal,
  type WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { randomCode } from '@common/sdk';

import {
  type FeatureId,
  MainFeatureRoute,
  menuContent,
} from '@src/app/core/constants/menu-feature-define';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { type MenuData } from './model';

/**
 * 功能清單是否需要展開
 * @param routePaths - 路由路徑
 * @param injector - 注射器
 * @param expandMap - menu展開狀態
 * @returns 結果
 */
function shouldExpand(
  routePaths: MainFeatureRoute[],
  injector: Injector,
  expandMap: Map<string, WritableSignal<boolean>>
): WritableSignal<boolean> {
  const randomId = randomCode();
  const router = injector.get(Router);
  const shouldExpand = (): boolean =>
    routePaths.some(routePath => location.href.includes(routePath));
  const routerEnd = runInInjectionContext(injector, () =>
    toSignal(
      router.events.pipe(
        // eslint-disable-next-line max-nested-callbacks
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        // eslint-disable-next-line max-nested-callbacks
        map(() => {
          const isExpand = expandMap.get(randomId) ?? signal(false);

          return isExpand() || shouldExpand();
        })
      ),
      {
        initialValue: shouldExpand(),
      }
    )
  );
  const isExpand = linkedSignal(() => routerEnd());

  expandMap.set(randomId, isExpand);

  return isExpand;
}

/**
 * 創建功能清單物件
 * @param featureId - 功能ID
 * @param options - 欲覆蓋選項
 * @returns 功能清單物件
 */
function createMenuData<K extends FeatureId>(
  featureId: K,
  options?: Partial<MenuData<K>>
): MenuData<K> {
  return {
    title: '未定義',
    featureId,
    children: signal<MenuData[]>([]),
    routePath: menuContent[featureId].routePath,
    isVisible: signal(false),
    isExpand: signal(false),
    ...options,
  };
}
// eslint-disable-next-line max-lines-per-function
export const menuList: (injector: Injector) => MenuData[] = (
  injector: Injector
) => {
  const expandSignal = new Map<string, WritableSignal<boolean>>();

  return [
    createMenuData(MainFeatureRoute.home, {
      title: '首頁',
    }),
    createMenuData(MainFeatureRoute.testRoot, {
      title: '測試根目錄',
      isExpand: shouldExpand(
        [MainFeatureRoute.testChild1, MainFeatureRoute.testChild2],
        injector,
        expandSignal
      ),
      children: signal([
        createMenuData(MainFeatureRoute.testChild1, {
          title: '測試子1',
        }),
        createMenuData(MainFeatureRoute.testChild2, {
          title: '測試子2',
        }),
      ]),
    }),
  ];
};
