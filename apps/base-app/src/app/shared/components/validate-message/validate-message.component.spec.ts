import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateMessageComponent } from './validate-message.component';

describe('ValidateMessageComponent', () => {
  let component: ValidateMessageComponent,
    fixture: ComponentFixture<ValidateMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateMessageComponent],
    });
    fixture = TestBed.createComponent(ValidateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
