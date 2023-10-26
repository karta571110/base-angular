import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'common-sdk',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>sdk works!</p> `,
  styles: [],
})
export class SdkComponent {}
