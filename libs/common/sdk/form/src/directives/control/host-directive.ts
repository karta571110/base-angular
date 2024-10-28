import { ControlDirective } from './control.directive';

export const controlDirectiveProvider = {
  directive: ControlDirective,
  inputs: ['regex', 'isRequired', 'fieldName'],
  outputs: ['valueChange', 'statusChange'],
};
