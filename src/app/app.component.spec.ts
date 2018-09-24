import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {DesktopComponent} from './desktop/desktop.component';
import {DesktopMenuComponent} from './desktop/desktop-menu/desktop-menu.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {PXtoViewWidthPipe} from './pxto-view-width.pipe';
import {PXtoViewHeightPipe} from './pxto-view-height.pipe';
import {ContextMenuComponent} from './desktop/context-menu/context-menu.component';
import {DesktopStartmenuComponent} from './desktop/desktop-startmenu/desktop-startmenu.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        ContextMenuComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
