import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { InputSelectComponent } from './input-select.component';

describe('InputComponent', () => {
  let component: InputSelectComponent<unknown>;
  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputSelectComponent],
    });
    fixture = TestBed.createComponent(InputSelectComponent);
    component = fixture.componentInstance as InputSelectComponent<unknown>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
