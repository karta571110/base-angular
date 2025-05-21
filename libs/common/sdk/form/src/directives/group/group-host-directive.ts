import { GroupDirective } from './group.directive';

export const groupDirectiveProvider = {
  directive: GroupDirective,
  outputs: ['valueChange', 'statusChange'],
};
