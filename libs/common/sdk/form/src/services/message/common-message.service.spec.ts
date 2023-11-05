import { TestBed } from '@angular/core/testing';

import { CommonMessageService } from './common-message.service';

describe('CommonControlErrorMessageService', () => {
  let service: CommonMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(CommonMessageService);

    console.log(service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
