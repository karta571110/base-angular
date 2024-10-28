import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonLoaderComponent } from '@common/sdk/ui';
import { ValidateMessageComponent } from './shared/components/validate-message/validate-message.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ValidateMessageComponent, CommonLoaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
