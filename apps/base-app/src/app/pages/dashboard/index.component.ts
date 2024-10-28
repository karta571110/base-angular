import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-index',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './index.component.html',
})
export class IndexComponent {}
