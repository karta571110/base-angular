import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'base-app';

  a = new FormControl('d', {
    updateOn: 'change',
  });
}
