import { async, inject, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DesktopMenuComponent } from './desktop/desktop-menu/desktop-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PXtoViewWidthPipe } from './pxto-view-width.pipe';
import { PXtoViewHeightPipe } from './pxto-view-height.pipe';
import { ContextMenuComponent } from './desktop/context-menu/context-menu.component';
import { DesktopStartmenuComponent } from './desktop/desktop-startmenu/desktop-startmenu.component';
import { WindowManagerComponent } from './desktop/window-manager/window-manager.component';
import { WindowFrameComponent } from './desktop/window/window-frame.component';
import { WebsocketService } from './websocket.service';

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
        LoginComponent,
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

  it('should close the websocket when it gets destroyed', inject([WebsocketService], (webSocket) => {
    const closeSpy = spyOn(webSocket, 'close');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.destroy();
    expect(closeSpy).toHaveBeenCalled();
  }));

});
