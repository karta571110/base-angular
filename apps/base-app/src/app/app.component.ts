import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonLoaderComponent } from '@common/sdk/ui';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonLoaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
