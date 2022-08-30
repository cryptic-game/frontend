import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ControlCenterSidebarMenuComponent, SidebarMenu} from './control-center-sidebar-menu.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('ControlCenterSubMenuComponent', () => {
  let component: ControlCenterSidebarMenuComponent;
  let fixture: ComponentFixture<ControlCenterSidebarMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSidebarMenuComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterSidebarMenuComponent);
    component = fixture.componentInstance;
    component.menu = new SidebarMenu('', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
