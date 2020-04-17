import { SignUpComponent } from './sign-up.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountPageBaseComponent } from '../account-page-base/account-page-base.component';
import { AccountService } from '../account.service';
import * as rxjs from 'rxjs';

describe('SignUpComponent', () => {
  let accountService;
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    accountService = jasmine.createSpyObj('AccountService', ['checkPassword', 'signUp', 'finalLogin']);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SignUpComponent, AccountPageBaseComponent],
      providers: [
        { provide: AccountService, useValue: accountService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should decrease errorLive every second by 1', () => {
    component.errorLive = 2;
    jasmine.clock().tick(1001);
    expect(component.errorLive).toEqual(1);
    jasmine.clock().tick(1001);
    expect(component.errorLive).toEqual(0);
  });

  it('should reset the error message when errorLive is equal or fewer than 0', () => {
    const testError = 'This is a test error.';
    component.error = testError;
    component.errorLive = 2;

    jasmine.clock().tick(1001);
    expect(component.error).toEqual(testError);
    jasmine.clock().tick(1001);
    expect(component.error).toBeFalsy();
  });

  it('should call accountService.checkPassword() when a form value gets changed', () => {
    component.form.setValue({ username: 'testUsername', email: 'testEmail', password: 'testPassword', passwordConfirm: 'testPassword' });

    expect(accountService.checkPassword).toHaveBeenCalledWith('testPassword');
  });

  it('#signUp() should do nothing if the form is not valid', () => {
    component.form = { valid: false } as any;

    component.signUp();
    expect(accountService.signUp).not.toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
  });

  it('#signUp() should set an error and cancel if the password do not match', () => {
    component.form = {
      valid: true,
      value: { username: 'testUsername', email: 'testEmail', password: 'testPassword', passwordConfirm: 'notMatching' }
    } as any;

    component.signUp();
    expect(component.error).toEqual('The passwords do not match.');
    expect(component.errorLive).toEqual(10);
    expect(accountService.signUp).not.toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
  });

  it('#singUp() should call signUp from the account service if the form is valid', () => {
    component.form = {
      valid: true,
      value: { username: 'testUsername', email: 'testEmail', password: 'testPassword', passwordConfirm: 'testPassword' }
    } as any;

    accountService.signUp.and.returnValue(rxjs.of({}));

    component.signUp();
    expect(accountService.signUp).toHaveBeenCalledWith(
      component.form.value.username,
      component.form.value.email,
      component.form.value.password
    );
  });

  it('#singUp() should call finalLogin from the account service if the server responds with no error', () => {
    component.form = {
      valid: true,
      value: { username: 'testUsername', email: 'testEmail', password: 'testPassword', passwordConfirm: 'testPassword' }
    } as any;

    const testToken = '654321123456';
    accountService.signUp.and.returnValue(rxjs.of({ token: testToken }));

    component.signUp();
    expect(accountService.signUp).toHaveBeenCalled();
    expect(accountService.finalLogin).toHaveBeenCalledWith(testToken);
  });

  it('#singUp() should set an error message and cancel if the server responds with an error', () => {
    component.form = {
      valid: true,
      value: { username: 'testUsername', email: 'testEmail', password: 'testPassword', passwordConfirm: 'testPassword' }
    } as any;

    const testError = 'This is a non-standard test error.';
    accountService.signUp.and.returnValue(rxjs.of({ error: testError }));

    component.signUp();
    expect(accountService.signUp).toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
    expect(component.error).toEqual(testError);


    const knownErrors = {
      'invalid email': 'The email address is not valid.',
      'username already exists': 'This username is already taken.'
    };

    for (const [errorName, translation] of Object.entries(knownErrors)) {
      accountService.signUp.and.returnValue(rxjs.of({ error: errorName }));
      component.errorLive = 0;

      component.signUp();
      expect(accountService.signUp).toHaveBeenCalled();
      expect(accountService.finalLogin).not.toHaveBeenCalled();
      expect(component.error).toEqual(translation);
      expect(component.errorLive).toEqual(10);
    }
  });

});
