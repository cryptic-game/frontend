import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ControlCenterComputerMenuComponent } from './control-center-computer-menu.component';

describe('ControlCenterComputerMenuComponent', () => {
  let component: ControlCenterComputerMenuComponent;
  let fixture: ComponentFixture<ControlCenterComputerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlCenterComputerMenuComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterComputerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
