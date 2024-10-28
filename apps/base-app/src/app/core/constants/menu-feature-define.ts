export interface MenuContent {
  i18nTitle: string;
  routePath?: string;
}

// 注入以下項目後即可翻譯
// {
//   provide: TRANSLOCO_SCOPE,
//   useValue: {
//     scope: 'components/menu',
//     alias: 'm',
//   },
//   multi: true,
// },
export const menuContent = {
  menu1: {
    i18nTitle: 'm.menu1',
    routePath: null,
  },
  diagram: {
    i18nTitle: 'm.diagram',
    routePath: '/main/dashboard/diagrams',
  },
  menu2: {
    i18nTitle: 'm.menu1',
    routePath: null,
  },
  sankey: {
    i18nTitle: 'm.sankey',
    routePath: '/main/dashboard/sankey',
  },
  menu3: {
    i18nTitle: 'm.menu1',
    routePath: null,
  },
  sankey1: {
    i18nTitle: 'm.sankey',
    routePath: '/main/dashboard/sankey',
  },
} as const;

export type FeatureId = keyof typeof menuContent;
export type RoutePath = (typeof menuContent)[FeatureId]['routePath'];
