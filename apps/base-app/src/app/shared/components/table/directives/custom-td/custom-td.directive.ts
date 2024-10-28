import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[appCustomTd]',
})
export class CustomTdDirective {
  field = input.required<string>({
    alias: 'appCustomTd',
  });

  templateRef = inject(TemplateRef);
}
