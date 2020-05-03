import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterSidebarMenuComponent, SidebarMenu } from './control-center-sidebar-menu.component';

describe('ControlCenterSubMenuComponent', () => {
  let component: ControlCenterSidebarMenuComponent;
  let fixture: ComponentFixture<ControlCenterSidebarMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSidebarMenuComponent]
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
