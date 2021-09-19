import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ControlCenterSoundPageComponent } from './control-center-sound-page.component';

describe('ControlCenterSoundPageComponent', () => {
  let component: ControlCenterSoundPageComponent;
  let fixture: ComponentFixture<ControlCenterSoundPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterSoundPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterSoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
