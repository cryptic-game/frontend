import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerMenuComponent } from './computer-menu.component';

describe('ComputerMenuComponent', () => {
  let component: ComputerMenuComponent;
  let fixture: ComponentFixture<ComputerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputerMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
