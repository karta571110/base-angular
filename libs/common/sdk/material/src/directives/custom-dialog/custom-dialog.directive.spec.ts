import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomDialogDirective } from './custom-dialog.directive';

describe('CustomDialogDirective', () => {
  TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    providers: [],
  });
  it('should create an instance', () => {
    const testFn = (): void => {
      const directive = new CustomDialogDirective<unknown>();

      // directive.control = new FormControl(null);
      expect(directive).toBeTruthy();
    };

    TestBed.runInInjectionContext(testFn);
  });
});
