import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupDirective } from './group.directive';

describe('GroupDirective', () => {
  TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    providers: [],
  });
  it('should create an instance', () => {
    const testFn = (): void => {
      const directive = new GroupDirective();

      // directive.control = new FormControl(null);
      expect(directive).toBeTruthy();
    };

    TestBed.runInInjectionContext(testFn);
  });
});
