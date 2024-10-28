import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nSettingButtonComponent } from './i18n-setting-button.component';

describe('I18nSettingButtonComponent', () => {
  let component: I18nSettingButtonComponent;
  let fixture: ComponentFixture<I18nSettingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nSettingButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(I18nSettingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
