import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowFrameComponent } from './window-frame.component';

describe('WindowFrameComponent', () => {
  let component: WindowFrameComponent;
  let fixture: ComponentFixture<WindowFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
