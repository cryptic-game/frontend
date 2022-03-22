import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonOutlineComponent } from './button-outline.component';

describe('ButtonOutlineComponent', () => {
  let component: ButtonOutlineComponent;
  let fixture: ComponentFixture<ButtonOutlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonOutlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
