import { type Data, type Route } from '@angular/router';

/** 常用路由型別 */
export interface CommonRoute<DataT extends Data = Data> extends Route {
  /** 路由攜帶資料 */
  data?: DataT;
  /** 路由標題 */
  title: Route['title'];
}
/** 常用路由型別陣列 */
export type CommonRoutes<DataT extends Data = Data> = CommonRoute<DataT>[];

/** 路由生成資訊 */
export interface RouteInfo<RouteIdT> {
  /** custom為空route物件 */
  routeId: RouteIdT | 'custom';

  /** 描述頁面用字串(無功能) */
  description: string;

  /** 由於children屬型及loadChildren屬性無法一起使用，因此使用此屬性將會覆蓋 loadChildren屬性 */
  children?: RouteInfo<RouteIdT>[];

  /** 這裡的Route可以覆蓋預設屬性值 */
  routeProperty?: Route;
}

/** 路由鍵植物件 */
export type RouteMap<
  KeyOfRouteIdsT extends string,
  RouteDataT extends Data = Data,
> = {
  [routeId in RouteInfo<KeyOfRouteIdsT>['routeId']]: CommonRoute<RouteDataT>;
};
