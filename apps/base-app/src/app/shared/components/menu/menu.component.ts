import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Injector,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DefineDataTypeDirective } from '@common/sdk';
import { menuList } from './menu-list';
import { MenuData } from './model';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionModule,
    NgTemplateOutlet,
    DefineDataTypeDirective,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  protected menuList;

  protected isMenuEmpty = computed(() => this.menuList().length === 0);

  /** 鍵值功能清單物件 */
  protected menuObject = computed(() => {
    const obj: Record<string, MenuData> = {};

    this.menuList().forEach(data => {
      obj[data.featureId] = data;
    });

    return obj;
  });

  // 為了context定義型別用
  protected menuDataT!: MenuData;

  private _injector = inject(Injector);

  constructor() {
    this.menuList = signal<MenuData[]>(menuList(this._injector));
  }

  protected afterExpand(isExpand: WritableSignal<boolean>): void {
    isExpand.set(true);
  }

  protected afterCollapse(isExpand: WritableSignal<boolean>): void {
    isExpand.set(false);
  }
}
