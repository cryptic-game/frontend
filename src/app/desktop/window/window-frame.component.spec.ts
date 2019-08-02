import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowFrameComponent } from './window-frame.component';
import { WindowDelegate } from './window-delegate';
import { TestWindowComponent } from '../windows/test-window/test-window.component';
import { NgModule } from '@angular/core';
import { WindowPlaceDirective } from './window-place.directive';

describe('WindowFrameComponent', () => {
  let component: WindowFrameComponent;
  let fixture: ComponentFixture<WindowFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EntryComponentsTestModule],
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


@NgModule({
  declarations: [TestWindowComponent],
  entryComponents: [TestWindowComponent]
})
class EntryComponentsTestModule {
}
