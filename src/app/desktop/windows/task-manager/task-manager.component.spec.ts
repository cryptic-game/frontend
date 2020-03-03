import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagerComponent, TaskManagerWindowDelegate } from './task-manager.component';
import { DeviceHardware, HardwareService } from '../../../hardware/hardware.service';
import * as rxjs from 'rxjs';
import { Subject } from 'rxjs';
import { WebsocketService } from '../../../websocket.service';

describe('TaskManagerComponent', () => {
  let webSocket;
  let notification_subject;
  let hardwareService;
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(async(() => {
    webSocket = jasmine.createSpyObj('WebsocketService', ['ms', 'register_notification']);
    webSocket.ms.and.returnValue(rxjs.of({}));
    notification_subject = new Subject();
    webSocket.register_notification.and.returnValue(notification_subject);

    hardwareService = jasmine.createSpyObj('HardwareService', ['getDeviceParts']);
    const hardware = new DeviceHardware();
    hardware.ram.push({
      'name': 'test',
      'ramSize': 14,
      'ramTyp': 'testType',
      'frequency': 0,
      'power': 0
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
        expect(webSocket.register_notification).toHaveBeenCalledWith('resource-usage');

        notification_subject.next({ 'device_uuid': deviceUUID, data: { cpu: cpuUtilization } });
        expect(component.utilization.cpu).toEqual(cpuUtilization);
      });
    }));

  it('should not update the utilization if the device uuid does not match', async(() => {
    component.deviceUUID = '123456';
    const cpuUtilBefore = 15;
    component.utilization.cpu = cpuUtilBefore;

    fixture.whenStable().then(() => {
      notification_subject.next({ 'device_uuid': '32692145', data: { cpu: 236723 } });
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
