import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslocoLoaderService } from './transloco-loader.service';

describe('TranslocoLoaderService', () => {
  let service: TranslocoLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TranslocoLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
