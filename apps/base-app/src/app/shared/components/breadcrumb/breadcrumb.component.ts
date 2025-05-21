import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '@common/sdk';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, NgClass],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  protected breadcrumbService = inject(BreadcrumbService);
}
