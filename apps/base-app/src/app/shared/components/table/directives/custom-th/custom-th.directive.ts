import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[appCustomTh]',
})
export class CustomThDirective {
  field = input.required<string>({
    alias: 'appCustomTh',
  });

  templateRef = inject(TemplateRef);
}
