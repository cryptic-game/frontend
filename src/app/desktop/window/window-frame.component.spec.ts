import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WindowFrameComponent} from './window-frame.component';
import {Window} from './window';

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
    component.position = Object.assign({}, Window.prototype.position);
    component.title = 'Test';
    component.icon = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
