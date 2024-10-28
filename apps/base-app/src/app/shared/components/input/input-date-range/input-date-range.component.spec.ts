import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { InputDateRangeComponent } from './input-date-range.component';

describe('InputComponent', () => {
  let component: InputDateRangeComponent;
  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputDateRangeComponent],
    });
    fixture = TestBed.createComponent(InputDateRangeComponent);
    component = fixture.componentInstance as InputDateRangeComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
