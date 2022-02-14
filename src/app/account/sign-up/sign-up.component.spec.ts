import {SignUpComponent} from './sign-up.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {AccountPageBaseComponent} from '../account-page-base/account-page-base.component';
import {AccountService} from '../account.service';
import * as rxjs from 'rxjs';
import {throwError} from 'rxjs';

describe('SignUpComponent', () => {
  let accountService;
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(waitForAsync(() => {
    accountService = jasmine.createSpyObj('AccountService', ['checkPassword', 'signUp', 'finalLogin']);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SignUpComponent, AccountPageBaseComponent],
      providers: [
        {provide: AccountService, useValue: accountService}
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

  it('#decayError() should decrease errorLife every second by 1', () => {
    component.decayError(2);
    expect(component.errorLife).toEqual(2);
    jasmine.clock().tick(1001);
    expect(component.errorLife).toEqual(1);
    jasmine.clock().tick(1001);
    expect(component.errorLife).toEqual(0);
  });

  it('#decayError() should reset the error message when errorLife is equal or fewer than 0', () => {
    const testError = 'This is a test error.';
    component.error = testError;
    component.decayError(2);

    jasmine.clock().tick(1001);
    expect(component.error).toEqual(testError);
    jasmine.clock().tick(1001);
    expect(component.error).toBeFalsy();
  });

  it('should call accountService.checkPassword() when a form value gets changed', () => {
    component.form.setValue({username: 'testUsername', password: 'testPassword', passwordConfirm: 'testPassword'});

    expect(accountService.checkPassword).toHaveBeenCalledWith('testPassword');
  });

  it('#signUp() should do nothing if the form is not valid', () => {
    component.form = {valid: false} as any;

    component.signUp();
    expect(accountService.signUp).not.toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
  });

  it('#signUp() should set an error and cancel if the password do not match', () => {
    component.form = {
      valid: true,
      value: {username: 'testUsername', password: 'testPassword', passwordConfirm: 'notMatching'}
    } as any;

    component.signUp();
    expect(component.error).toEqual('The passwords do not match.');
    expect(component.errorLife).toEqual(10);
    expect(accountService.signUp).not.toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
  });

  it('#singUp() should call signUp from the account service if the form is valid', () => {
    component.form = {
      valid: true,
      value: {username: 'testUsername', password: 'testPassword', passwordConfirm: 'testPassword'}
    } as any;

    accountService.signUp.and.returnValue(rxjs.of({}));

    component.signUp();
    expect(accountService.signUp).toHaveBeenCalledWith(
      component.form.value.username,
      component.form.value.password
    );
  });

  it('#singUp() should call finalLogin from the account service if the server responds with no error', () => {
    component.form = {
      valid: true,
      value: {username: 'testUsername', password: 'testPassword', passwordConfirm: 'testPassword'}
    } as any;

    const testToken = '654321123456';
    accountService.signUp.and.returnValue(rxjs.of({token: testToken}));

    component.signUp();
    expect(accountService.signUp).toHaveBeenCalled();
    expect(accountService.finalLogin).toHaveBeenCalledWith(testToken, '/create-device');
  });

  it('#singUp() should set an error message and cancel if the server responds with an error', () => {
    component.form = {
      valid: true,
      value: {username: 'testUsername', password: 'testPassword', passwordConfirm: 'testPassword'}
    } as any;

    const testError = 'This is a non-standard test error.';
    accountService.signUp.and.callFake(() => throwError(new Error(testError)));
    spyOn(component, 'decayError');

    component.signUp();
    expect(accountService.signUp).toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
    expect(component.error).toEqual(testError);


    const knownErrors = {
      'username already exists': 'This username is already taken.'
    };

    for (const [errorName, translation] of Object.entries(knownErrors)) {
      accountService.signUp.and.callFake(() => throwError(new Error(errorName)));
      component.errorLife = 0;

      component.signUp();
      expect(accountService.signUp).toHaveBeenCalled();
      expect(accountService.finalLogin).not.toHaveBeenCalled();
      expect(component.error).toEqual(translation);
      expect(component.decayError).toHaveBeenCalledWith(10);
    }
  });

});
