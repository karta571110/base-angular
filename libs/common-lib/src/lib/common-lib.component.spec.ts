import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { CommonLibComponent } from './common-lib.component';

describe('CommonLibComponent', () => {
  let component: CommonLibComponent,
    fixture: ComponentFixture<CommonLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
