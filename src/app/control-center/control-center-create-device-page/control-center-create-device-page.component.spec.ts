import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterCreateDevicePageComponent } from './control-center-create-device-page.component';

describe('ControlCenterCreateDevicePageComponent', () => {
  let component: ControlCenterCreateDevicePageComponent;
  let fixture: ComponentFixture<ControlCenterCreateDevicePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterCreateDevicePageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterCreateDevicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
