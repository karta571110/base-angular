const baseFeatureRoute = '/main/dashboard/';

export enum AuthRoute {
  login = 'login',
}
/** 功能ID */
export enum MainFeatureRoute {
  /** 首頁 */
  home = 'home',
  /** 父 */
  testRoot = 'test-root',
  /** ┗ 子-1 */
  testChild1 = 'test-child1',
  /** ┗ 子-2 */
  testChild2 = 'test-child2',
}
export const menuContent = {
  /** 首頁 */
  [MainFeatureRoute.home]: {
    routePath: `${baseFeatureRoute}${MainFeatureRoute.home}`,
  },
  /** 父 */
  [MainFeatureRoute.testRoot]: {
    routePath: MainFeatureRoute.testRoot,
  },
  /** ┗ 子-1 */
  [MainFeatureRoute.testChild1]: {
    routePath: `${baseFeatureRoute}${MainFeatureRoute.testRoot}/${MainFeatureRoute.testChild1}`,
  },
  /** ┗ 子-2 */
  [MainFeatureRoute.testChild2]: {
    routePath: `${baseFeatureRoute}${MainFeatureRoute.testRoot}/${MainFeatureRoute.testChild2}`,
  },
} as const;

export type FeatureId = keyof typeof menuContent;
export type RoutePath<K extends FeatureId> =
  (typeof menuContent)[K]['routePath'];
