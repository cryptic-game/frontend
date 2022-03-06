import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {WindowManagerComponent} from './window-manager.component';
import {WindowFrameComponent} from '../window/window-frame.component';
import {windowManagerMock} from '../../test-utils';

describe('WindowManagerComponent', () => {
  let component: WindowManagerComponent;
  let fixture: ComponentFixture<WindowManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WindowManagerComponent,
        WindowFrameComponent
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowManagerComponent);
    component = fixture.componentInstance;
    component.windowManager = windowManagerMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
