import { type Signal, type WritableSignal } from '@angular/core';
import {
  type FeatureId,
  type RoutePath,
} from '@src/app/core/constants/menu-feature-define';

export interface MenuData<K extends FeatureId = FeatureId> {
  title: string;
  featureId: K;
  routePath: RoutePath<K>;
  children: Signal<MenuData[]>;
  isVisible: Signal<boolean>;
  isExpand: WritableSignal<boolean>;
}
