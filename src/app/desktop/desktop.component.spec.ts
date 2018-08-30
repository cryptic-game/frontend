import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DesktopComponent} from './desktop.component';
import {DesktopSurfaceComponent} from './desktop-surface/desktop-surface.component';
import {DesktopMenuComponent} from './desktop-menu/desktop-menu.component';
import {HttpClientModule} from '@angular/common/http';

describe('DesktopComponent', () => {
  let component: DesktopComponent;
  let fixture: ComponentFixture<DesktopComponent>;

  localStorage.setItem('token', '');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [DesktopComponent, DesktopSurfaceComponent, DesktopMenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
