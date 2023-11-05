import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent<unknown>, fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
    });
    fixture = TestBed.createComponent(InputComponent<unknown>);
    component = fixture.componentInstance as InputComponent<unknown>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
