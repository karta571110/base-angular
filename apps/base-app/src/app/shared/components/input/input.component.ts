import { Component, inject, type OnInit } from '@angular/core';
import { ReactiveFormsModule, type FormControl } from '@angular/forms';
import { ControlDirective } from '@common/sdk/form';
import { ValidateMessageComponent } from '../validate-message/validate-message.component';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, ControlDirective, ValidateMessageComponent],
  hostDirectives: [ControlDirective],
})
export class InputComponent<ValueT> implements OnInit {
  protected control: FormControl<ValueT> | null = null;

  private _controlDirective = inject(ControlDirective);

  ngOnInit(): void {
    this.control = this._controlDirective.control as FormControl<ValueT>;
  }
}
