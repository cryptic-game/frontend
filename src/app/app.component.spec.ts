import { AppComponent } from './app.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DesktopMenuComponent } from './desktop/desktop-menu/desktop-menu.component';
import { DesktopStartmenuComponent } from './desktop/desktop-startmenu/desktop-startmenu.component';
import { PXtoViewWidthPipe } from './pxto-view-width.pipe';
import { PXtoViewHeightPipe } from './pxto-view-height.pipe';
import { ContextMenuComponent } from './desktop/context-menu/context-menu.component';
import { WindowManagerComponent } from './desktop/window-manager/window-manager.component';
import { WindowFrameComponent } from './desktop/window/window-frame.component';
import { WebsocketService } from './websocket.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { async, TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        WebsocketService
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent,
        DesktopComponent,
        DesktopMenuComponent,
        DesktopStartmenuComponent,
        PXtoViewWidthPipe,
        PXtoViewHeightPipe,
        ContextMenuComponent,
        WindowManagerComponent,
        WindowFrameComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
