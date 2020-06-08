import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterComponent } from './control-center.component';
import { WebsocketService } from '../websocket.service';
import { webSocketMock } from '../test-utils';
import { ControlCenterSidebarComponent } from './control-center-sidebar/control-center-sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlCenterSidebarMenuComponent } from './control-center-sidebar-menu/control-center-sidebar-menu.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

describe('ControlCenterComponent', () => {
  let component: ControlCenterComponent;
  let fixture: ComponentFixture<ControlCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterComponent, ControlCenterSidebarComponent, ControlCenterSidebarMenuComponent],
      providers: [
        { provide: WebsocketService, useValue: webSocketMock() },
        { provide: RouteReuseStrategy, useValue: {} }
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
