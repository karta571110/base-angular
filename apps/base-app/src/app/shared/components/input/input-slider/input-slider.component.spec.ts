import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { InputSliderComponent } from './input-slider.component';

describe('InputComponent', () => {
  let component: InputSliderComponent;
  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputSliderComponent],
    });
    fixture = TestBed.createComponent(InputSliderComponent);
    component = fixture.componentInstance as InputSliderComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
