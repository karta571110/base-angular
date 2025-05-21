import { CustomDialogDirective } from '..';

export const customDialogDirectiveProvider = {
  directive: CustomDialogDirective,
  inputs: ['commonCustomDialog', 'isOpen'],
  outputs: ['afterDialogOpened', 'afterDialogClosed'],
};
