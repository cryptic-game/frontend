import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterDevicePageComponent } from './control-center-device-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from '../../websocket.service';
import { webSocketMock } from '../../test-utils';
import { DeviceSidebarMenuItem } from '../control-center.component';
import { DeviceHardware } from '../../api/hardware/hardware.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ControlCenterDevicePageComponent', () => {
  let component: ControlCenterDevicePageComponent;
  let fixture: ComponentFixture<ControlCenterDevicePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterDevicePageComponent],
      imports: [RouterTestingModule, NoopAnimationsModule],
      providers: [{ provide: WebsocketService, useValue: webSocketMock() }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterDevicePageComponent);
    component = fixture.componentInstance;
    component['_device'] = new DeviceSidebarMenuItem({ name: '', owner: '', powered_on: false, uuid: '' }, new DeviceHardware());
    component.device.hardware.cpu.push({ name: '' } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
