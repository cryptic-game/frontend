import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [SignUpComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
