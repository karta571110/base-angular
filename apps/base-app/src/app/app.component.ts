import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ValidateMessageComponent } from './shared/components/validate-message/validate-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ValidateMessageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'base-app';

  a = new FormControl('d', {
    updateOn: 'change',
  });
}
