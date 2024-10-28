import { TestBed } from '@angular/core/testing';

import { I18nChangeManageService } from './i18n-change-manage.service';

describe('I18nChangeManageService', () => {
  let service: I18nChangeManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nChangeManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
