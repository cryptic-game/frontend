import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterCreateDevicePageComponent } from './control-center-create-device-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ControlCenterCreateDevicePageComponent', () => {
  let component: ControlCenterCreateDevicePageComponent;
  let fixture: ComponentFixture<ControlCenterCreateDevicePageComponent>;
  let activatedRoute;

  beforeEach(async(() => {
    activatedRoute = { data: jasmine.createSpyObj(['subscribe']) };

    TestBed.configureTestingModule({
      declarations: [ControlCenterCreateDevicePageComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterCreateDevicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
