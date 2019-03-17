import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WindowManagerComponent} from './window-manager.component';
import {WindowFrameComponent} from '../window/window-frame.component';
import {NgModule} from '@angular/core';
import {TestWindowComponent} from '../windows/test-window/test-window.component';
import {TerminalComponent} from '../windows/terminal/terminal.component';

describe('WindowManagerComponent', () => {
  let component: WindowManagerComponent;
  let fixture: ComponentFixture<WindowManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EntryComponentsTestModule],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@NgModule({
  declarations: [TestWindowComponent, TerminalComponent],
  entryComponents: [TestWindowComponent, TerminalComponent]
})
class EntryComponentsTestModule {
}
