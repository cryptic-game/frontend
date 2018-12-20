import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WindowFrameComponent} from './window-frame.component';
import {WindowDelegate} from './window-delegate.class';

describe('WindowFrameComponent', () => {
  let component: WindowFrameComponent;
  let fixture: ComponentFixture<WindowFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WindowFrameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowFrameComponent);
    component = fixture.componentInstance;
    component.delegate = new class extends WindowDelegate {
      title = 'Test';
      icon = '';
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
