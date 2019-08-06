import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    const router = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldn\'t show an error at the beginning', () => {
    expect(fixture.debugElement.query(By.css('.errorText'))).toBeFalsy('An error was shown at the beginning');
  });

  it('should call performLogin() when the login button is clicked', () => {
    const performLoginSpy = spyOn(component, 'performLogin');
    component.loginButton.nativeElement.click();
    expect(performLoginSpy).toHaveBeenCalled();
  });

  it('#performLogin() should call the login method from the login service', inject([LoginService], (service: LoginService) => {
    const loginSpy = spyOn(service, 'login').and.returnValue({ subscribe: () => new Subscription() } as any);
    component.performLogin();
    expect(loginSpy).toHaveBeenCalledWith(component.model.username, component.model.password);
  }));

  it('#performLogin() should save the token and navigate to / after 500ms ' +
    'if the login was successful', fakeAsync(inject([LoginService, Router], (service: LoginService, router: Router) => {
    const setItemSpy = spyOn(localStorage, 'setItem');
    const testToken = '00000000-0000-0000-0000-000000000000';
    spyOn(service, 'login').and.returnValue(of({ token: testToken }));

    component.performLogin();
    expect(setItemSpy).toHaveBeenCalledWith('token', testToken);
    fixture.detectChanges();
    tick(500);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  })));

  it('#performLogin() should disable the login button for 500ms ' +
    'if the login failed', fakeAsync(inject([LoginService, Router], (service: LoginService, router: Router) => {
    component.model.username = 'somebody';
    component.model.username = '12345';
    spyOn(service, 'login').and.returnValue(of({ error: 'test error' }));

    component.performLogin();
    fixture.detectChanges();
    expect(component.loginButton.nativeElement.disabled).toBeTruthy();
    tick(500);
    fixture.detectChanges();
    expect(component.loginButton.nativeElement.disabled).toBeFalsy();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  })));

});
