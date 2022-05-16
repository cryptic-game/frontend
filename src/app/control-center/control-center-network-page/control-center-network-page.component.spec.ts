import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ControlCenterNetworkPageComponent} from './control-center-network-page.component';

describe('ControlCenterNetworkPageComponent', () => {
  let component: ControlCenterNetworkPageComponent;
  let fixture: ComponentFixture<ControlCenterNetworkPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterNetworkPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterNetworkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
