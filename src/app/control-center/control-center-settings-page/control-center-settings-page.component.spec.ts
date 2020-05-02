import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterSettingsPageComponent } from './control-center-settings-page.component';

describe('ControlCenterSettingsPageComponent', () => {
  let component: ControlCenterSettingsPageComponent;
  let fixture: ComponentFixture<ControlCenterSettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSettingsPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
