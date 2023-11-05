import { TestBed } from '@angular/core/testing';

import { CommonValidationService } from './common-validation.service';

describe('CommonValidationService', () => {
  let service: CommonValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
