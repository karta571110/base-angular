import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTimePickerComponent } from './input-time-picker.component';

describe('InputTimePickerComponent', () => {
  let component: InputTimePickerComponent;
  let fixture: ComponentFixture<InputTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
