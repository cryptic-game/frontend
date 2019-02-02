import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DesktopStartmenuComponent} from './desktop-startmenu.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {DesktopComponent} from '../desktop.component';
import {PXtoViewHeightPipe} from '../../pxto-view-height.pipe';
import {PXtoViewWidthPipe} from '../../pxto-view-width.pipe';
import {WindowManagerComponent} from '../window-manager/window-manager.component';
import {ContextMenuComponent} from '../context-menu/context-menu.component';
import {WindowFrameComponent} from '../window/window-frame.component';
import {DesktopMenuComponent} from '../desktop-menu/desktop-menu.component';

describe('DesktopStartmenuComponent', () => {
  let component: DesktopStartmenuComponent;
  let fixture: ComponentFixture<DesktopStartmenuComponent>;

  localStorage.setItem('token', '');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
      declarations: [
        DesktopStartmenuComponent,
        DesktopComponent,
        PXtoViewWidthPipe,
        PXtoViewHeightPipe,
        WindowManagerComponent,
        ContextMenuComponent,
        WindowFrameComponent,
        DesktopMenuComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopStartmenuComponent);
    component = fixture.componentInstance;
    component.parent = TestBed.createComponent(DesktopComponent).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
