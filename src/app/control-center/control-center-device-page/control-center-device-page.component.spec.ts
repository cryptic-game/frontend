import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterDevicePageComponent } from './control-center-device-page.component';

describe('ControlCenterDevicePageComponent', () => {
  let component: ControlCenterDevicePageComponent;
  let fixture: ComponentFixture<ControlCenterDevicePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterDevicePageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterDevicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
