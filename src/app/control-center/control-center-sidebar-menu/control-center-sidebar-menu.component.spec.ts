import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ControlCenterSidebarMenuComponent, SidebarMenu} from './control-center-sidebar-menu.component';
import {RouterTestingModule} from '@angular/router/testing';
import { IconsModule } from 'src/app/icons/icons.module';

describe('ControlCenterSubMenuComponent', () => {
  let component: ControlCenterSidebarMenuComponent;
  let fixture: ComponentFixture<ControlCenterSidebarMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSidebarMenuComponent],
      imports: [IconsModule, RouterTestingModule]
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
