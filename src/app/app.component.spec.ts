import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DesktopMenuComponent } from './desktop/desktop-menu/desktop-menu.component';
import { DesktopStartmenuComponent } from './desktop/desktop-startmenu/desktop-startmenu.component';
import { PXtoViewWidthPipe } from './pxto-view-width.pipe';
import { PXtoViewHeightPipe } from './pxto-view-height.pipe';
import { WindowManagerComponent } from './desktop/window-manager/window-manager.component';
import { WindowFrameComponent } from './desktop/window/window-frame.component';
import { WebsocketService } from './websocket.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { swUpdateMock, webSocketMock } from './test-utils';
import { SwUpdate } from '@angular/service-worker';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WebsocketService, useValue: webSocketMock() },
        { provide: SwUpdate, useValue: swUpdateMock() }
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

  it('should initialize the websocket', inject([WebsocketService], (webSocket: WebsocketService) => {
    TestBed.createComponent(AppComponent);
    expect(webSocket.init).toHaveBeenCalled();
  }));

  it('should close the websocket when it gets destroyed', inject([WebsocketService], (webSocket: WebsocketService) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.destroy();
    expect(webSocket.close).toHaveBeenCalled();
  }));

});
