import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterIntroductionPageComponent } from './control-center-introduction-page.component';

describe('ControlCenterIntroductionPageComponent', () => {
  let component: ControlCenterIntroductionPageComponent;
  let fixture: ComponentFixture<ControlCenterIntroductionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCenterIntroductionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterIntroductionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
