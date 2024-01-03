import { TestBed } from '@angular/core/testing';
import { getTranslocoProvide } from '@common/sdk/i18n';
import { ErrorMessagePipe } from './error-message.pipe';

describe('ErrorMessagePipe', () => {
  TestBed.configureTestingModule({
    providers: [...getTranslocoProvide([])],
  });
  it('create an instance', () => {
    const testFn = (): void => {
      const pipe = new ErrorMessagePipe();

      expect(pipe).toBeTruthy();
    };

    TestBed.runInInjectionContext(testFn);
  });
});
