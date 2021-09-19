import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WindowFrameComponent } from './window-frame.component';
import { WindowDelegate } from './window-delegate';
import { TestWindowComponent } from '../windows/test-window/test-window.component';
import { WindowPlaceDirective } from './window-place.directive';

describe('WindowFrameComponent', () => {
  let component: WindowFrameComponent;
  let fixture: ComponentFixture<WindowFrameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WindowFrameComponent, WindowPlaceDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowFrameComponent);
    component = fixture.componentInstance;
    component.delegate = new class extends WindowDelegate {
      title = 'Test';
      type = TestWindowComponent;
      icon = '';
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
