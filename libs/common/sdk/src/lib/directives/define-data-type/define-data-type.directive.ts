import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
  selector: 'ng-template[commonDefineDataType]',
  standalone: true,
})
export class DefineDataTypeDirective<TypeToken> {
  // how you tell the directive what the type should be

  typeToken = input.required<TypeToken>({
    alias: 'commonDefineDataType',
  });

  // the directive gets the template from Angular
  constructor(private _contentTemplate: TemplateRef<TypeToken> | null) {}

  // this magic is how we tell Angular the context type for this directive, which then propagates down to the type of the template
  static ngTemplateContextGuard<TypeToken>(
    dir: DefineDataTypeDirective<TypeToken>,
    ctx: unknown
  ): ctx is TypeToken {
    return true;
  }
}
