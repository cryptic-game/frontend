import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ControlCenterComponent} from './control-center.component';
import {WebsocketService} from '../websocket.service';
import {webSocketMock} from '../test-utils';
import {ControlCenterSidebarComponent} from './control-center-sidebar/control-center-sidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ControlCenterSidebarMenuComponent} from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';
import {ControlCenterService} from './control-center.service';

describe('ControlCenterComponent', () => {
  let component: ControlCenterComponent;
  let fixture: ComponentFixture<ControlCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterComponent, ControlCenterSidebarComponent, ControlCenterSidebarMenuComponent],
      providers: [
        {provide: WebsocketService, useValue: webSocketMock()},
        {provide: RouteReuseStrategy, useValue: {}},
        {provide: ControlCenterService, useValue: {deviceSidebarMenuItems: []}}
      ],
      imports: [RouterTestingModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
