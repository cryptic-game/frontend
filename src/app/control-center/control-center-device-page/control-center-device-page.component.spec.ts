import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ControlCenterDevicePageComponent } from './control-center-device-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from '../../websocket.service';
import { webSocketMock } from '../../test-utils';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceHardware } from '../../api/hardware/device-hardware';
import { ActivatedRoute } from '@angular/router';

describe('ControlCenterDevicePageComponent', () => {
  let component: ControlCenterDevicePageComponent;
  let fixture: ComponentFixture<ControlCenterDevicePageComponent>;
  let activatedRoute;

  beforeEach(waitForAsync(() => {
    activatedRoute = { queryParamMap: jasmine.createSpyObj(['subscribe']), data: jasmine.createSpyObj(['subscribe']) };
    TestBed.configureTestingModule({
      declarations: [ControlCenterDevicePageComponent],
      imports: [RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: WebsocketService, useValue: webSocketMock() },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterDevicePageComponent);
    component = fixture.componentInstance;
    component.device = { name: '', owner: '', powered_on: false, uuid: '', starter_device: false };
    component.hardware = new DeviceHardware(component.device);
    component.hardware.cpu.push({ name: '' } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
