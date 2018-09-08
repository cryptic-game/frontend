import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {DesktopComponent} from './desktop/desktop.component';
import {DesktopSurfaceComponent} from './desktop/desktop-surface/desktop-surface.component';
import {DesktopMenuComponent} from './desktop/desktop-menu/desktop-menu.component';
import {HttpClientModule} from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        LoginComponent,
        DesktopComponent,
        DesktopSurfaceComponent,
        DesktopMenuComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
