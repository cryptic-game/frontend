import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSurfaceComponent } from './desktop-surface.component';

describe('DesktopSurfaceComponent', () => {
  let component: DesktopSurfaceComponent;
  let fixture: ComponentFixture<DesktopSurfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
