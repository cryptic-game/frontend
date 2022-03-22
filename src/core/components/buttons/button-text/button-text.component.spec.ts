import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTextComponent } from './button-text.component';

describe('ButtonTextComponent', () => {
  let component: ButtonTextComponent;
  let fixture: ComponentFixture<ButtonTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
