import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    const router = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SignUpComponent],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldn\'t show an error at the beginning', () => {
    expect(fixture.debugElement.query(By.css('.errorText'))).toBeFalsy('An error was shown at the beginning');
  });

  it('should call performSignup() when the sign-up button is clicked', () => {
    const performSignupSpy = spyOn(component, 'performSignup');
    component.signUpButton.nativeElement.click();
    expect(performSignupSpy).toHaveBeenCalled();
  });

  it('#performSignup() should call the sign-up method from the sign-up service', inject([SignUpService], (service: SignUpService) => {
    const loginSpy = spyOn(service, 'signUp').and.returnValue({ subscribe: () => new Subscription() } as any);
    component.performSignup();
    expect(loginSpy).toHaveBeenCalledWith(component.model.username, component.model.email, component.model.password);
  }));

  it('#performSignup() should save the token and navigate to / after 500ms ' +
    'if the sign-up was successful', fakeAsync(inject([SignUpService, Router], (service: SignUpService, router: Router) => {
    const setItemSpy = spyOn(localStorage, 'setItem');
    const testToken = '00000000-0000-0000-0000-000000000000';
    spyOn(service, 'signUp').and.returnValue(of({ token: testToken }));

    component.performSignup();
    expect(setItemSpy).toHaveBeenCalledWith('token', testToken);
    fixture.detectChanges();
    tick(500);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  })));


  it('#performSignup() should disable the sign-up button for 500ms ' +
    'if the sign-up failed', fakeAsync(inject([SignUpService, Router], (service: SignUpService, router: Router) => {
    component.model.username = 'somebody';
    component.model.username = '12345';
    spyOn(service, 'signUp').and.returnValue(of({ error: 'test error' }));

    component.performSignup();
    fixture.detectChanges();
    expect(component.signUpButton.nativeElement.disabled).toBeTruthy();
    tick(500);
    fixture.detectChanges();
    expect(component.signUpButton.nativeElement.disabled).toBeFalsy();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  })));

});
