import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DefineDataTypeDirective } from './define-data-type.directive';

describe('ControlDirective', () => {
  TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    providers: [],
  });
  it('should create an instance', () => {
    const testFn = (): void => {
      const directive = new DefineDataTypeDirective(null);

      // directive.control = new FormControl(null);
      expect(directive).toBeTruthy();
    };

    TestBed.runInInjectionContext(testFn);
  });
});
