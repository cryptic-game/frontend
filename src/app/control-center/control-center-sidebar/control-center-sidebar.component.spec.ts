import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ControlCenterSidebarComponent } from './control-center-sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouteReuseStrategy } from '@angular/router';

describe('ControlCenterSidebarComponent', () => {
  let component: ControlCenterSidebarComponent;
  let fixture: ComponentFixture<ControlCenterSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: RouteReuseStrategy, useValue: {} }],
      declarations: [ControlCenterSidebarComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
