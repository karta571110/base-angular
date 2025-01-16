import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ScreenService } from '@common/sdk';

@Component({
  selector: 'app-header',
  imports: [NgStyle, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected screenService = inject(ScreenService);
}
