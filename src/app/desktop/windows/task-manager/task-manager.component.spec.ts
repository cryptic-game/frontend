import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagerComponent, TaskManagerWindowDelegate } from './task-manager.component';
import { HardwareService } from '../../../api/hardware/hardware.service';
import * as rxjs from 'rxjs';
import { Subject } from 'rxjs';
import { WebsocketService } from '../../../websocket.service';
import { DeviceHardware } from '../../../api/hardware/device-hardware';

describe('TaskManagerComponent', () => {
  let webSocket;
  let notification_subject;
  let hardwareService;
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(async(() => {
    webSocket = jasmine.createSpyObj('WebsocketService', ['ms', 'subscribe_notification']);
    webSocket.ms.and.returnValue(rxjs.of({}));
    notification_subject = new Subject();
    webSocket.subscribe_notification.and.returnValue(notification_subject);

    hardwareService = jasmine.createSpyObj('HardwareService', ['getDeviceParts']);
    const hardware = new DeviceHardware(null);
    hardware.cpu.push({
      name: '',
      cores: 0,
      frequencyMax: 0,
      frequencyMin: 0,
      id: 0,
      maxTemperature: 0,
      overClock: false,
      power: 0,
      socket: '',
      turboSpeed: false
    });
    hardware.ram.push({
      id: 156,
      ramSize: 987,
      ramTyp: ['test-type', 4],
      frequency: 123,
      power: 321,
    });
    hardwareService.getDeviceParts.and.returnValue(rxjs.of(hardware));

    spyOn(sessionStorage, 'getItem').and.returnValue('{}');

    TestBed.configureTestingModule({
      declarations: [TaskManagerComponent],
      providers: [
        { provide: WebsocketService, useValue: webSocket },
        { provide: HardwareService, useValue: hardwareService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a notification handler for "resource-usage" and update the utilization if the device uuid matches',
    async(() => {
      const deviceUUID = 'test123-456';
      const cpuUtilization = 6226;

      component.deviceUUID = deviceUUID;

      fixture.whenStable().then(() => {
        expect(webSocket.subscribe_notification).toHaveBeenCalledWith('resource-usage');

        notification_subject.next({ 'device_uuid': deviceUUID, 'data': { cpu: cpuUtilization } });
        expect(component.utilization.cpu).toEqual(cpuUtilization);
      });
    }));

  it('should not update the utilization if the device uuid does not match', async(() => {
    component.deviceUUID = '123456';
    const cpuUtilBefore = 15;
    component.utilization.cpu = cpuUtilBefore;

    fixture.whenStable().then(() => {
      notification_subject.next({ 'device_uuid': '32692145', 'data': { cpu: 236723 } });
      expect(component.utilization.cpu).toEqual(cpuUtilBefore);
    });
  }));

  it('should unsubscribe the notification when it gets destroyed', () => {
    component.resourceNotifySubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']) as any;
    fixture.destroy();
    expect(component.resourceNotifySubscription.unsubscribe).toHaveBeenCalled();
  });


});

describe('TaskManagerWindowDelegate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskManagerComponent]
    });
  });

  it('should create', () => {
    const windowDelegate = new TaskManagerWindowDelegate();
    expect(windowDelegate).toBeTruthy();
  });
});
