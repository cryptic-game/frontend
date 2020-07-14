import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopStartmenuComponent } from './desktop-startmenu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DesktopComponent } from '../desktop.component';
import { PXtoViewHeightPipe } from '../../pxto-view-height.pipe';
import { PXtoViewWidthPipe } from '../../pxto-view-width.pipe';
import { WindowManagerComponent } from '../window-manager/window-manager.component';
import { WindowFrameComponent } from '../window/window-frame.component';
import { DesktopMenuComponent } from '../desktop-menu/desktop-menu.component';
import { emptyDevice, windowManagerMock } from '../../test-utils';
import { RouteReuseStrategy } from '@angular/router';

describe('DesktopStartmenuComponent', () => {
  let component: DesktopStartmenuComponent;
  let fixture: ComponentFixture<DesktopStartmenuComponent>;
  let desktop;

  beforeEach(async(() => {
    desktop = jasmine.createSpyObj('DesktopComponent', ['openProgramWindow', 'hideStartMenu']);
    desktop.activeDevice = emptyDevice();
    desktop.devices = [];
    desktop.linkages = [];
    desktop.windowManager = windowManagerMock();

    TestBed.configureTestingModule({
      providers: [
        { provide: RouteReuseStrategy, useValue: {} }
      ],
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
      declarations: [
        DesktopStartmenuComponent,
        DesktopComponent,
        PXtoViewWidthPipe,
        PXtoViewHeightPipe,
        WindowManagerComponent,
        WindowFrameComponent,
        DesktopMenuComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopStartmenuComponent);
    component = fixture.componentInstance;
    component.parent = desktop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
