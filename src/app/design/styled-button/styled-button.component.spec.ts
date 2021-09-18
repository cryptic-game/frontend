import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyledButtonComponent } from './styled-button.component';

describe('StyledButtonComponent', () => {
  let component: StyledButtonComponent;
  let fixture: ComponentFixture<StyledButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyledButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyledButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
