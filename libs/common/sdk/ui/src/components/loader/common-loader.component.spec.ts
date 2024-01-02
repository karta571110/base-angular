import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { CommonLoaderComponent } from './common-loader.component';

describe('CommonLoaderComponent', () => {
  let component: CommonLoaderComponent,
    fixture: ComponentFixture<CommonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
