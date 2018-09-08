import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSurfaceComponent } from './desktop-surface.component';
import {HttpClientModule} from '@angular/common/http';

describe('DesktopSurfaceComponent', () => {
  let component: DesktopSurfaceComponent;
  let fixture: ComponentFixture<DesktopSurfaceComponent>;

  localStorage.setItem('token', '');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ DesktopSurfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
