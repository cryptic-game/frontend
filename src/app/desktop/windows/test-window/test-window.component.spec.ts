import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestWindowComponent } from './test-window.component';

describe('TestWindowComponent', () => {
  let component: TestWindowComponent;
  let fixture: ComponentFixture<TestWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestWindowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
