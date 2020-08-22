import { LoginComponent } from './login.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountPageBaseComponent } from '../account-page-base/account-page-base.component';
import { AccountService } from '../account.service';
import * as rxjs from 'rxjs';
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let accountService;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    accountService = jasmine.createSpyObj('AccountService', ['login', 'finalLogin']);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent, AccountPageBaseComponent],
      providers: [
        { provide: AccountService, useValue: accountService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    fixture = TestBed.createComponent(LoginComponent);
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

  it('#login() should call login from the account service if the form is valid', () => {
    component.form = { valid: true, value: { username: 'testUser', password: 'testPassword' } } as any;

    accountService.login.and.returnValue(rxjs.of({}));

    component.login();
    expect(accountService.login).toHaveBeenCalledWith(component.form.value.username, component.form.value.password);
  });

  it('#login() should set an error message if the server responds with an error', () => {
    component.form = { valid: true, value: { username: 'testUser', password: 'testPassword' } } as any;

    accountService.login.and.callFake(() => throwError(new Error('permissions denied')));

    component.login();
    expect(accountService.login).toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
    expect(component.error).toEqual('This username and password could not be found.');
    expect(component.errorLive).toEqual(10);

    const testError = 'This is a non-standard test error.';
    accountService.login.and.callFake(() => throwError(new Error(testError)));

    component.login();
    expect(accountService.login).toHaveBeenCalled();
    expect(accountService.finalLogin).not.toHaveBeenCalled();
    expect(component.error).toEqual(testError);
    expect(component.errorLive).toEqual(10);
  });

  it('#login() should call finalLogin with the received token if the server responds with no error', () => {
    component.form = { valid: true, value: { username: 'testUser', password: 'testPassword' } } as any;

    const testToken = '12356654321';
    accountService.login.and.returnValue(rxjs.of({ token: testToken }));

    component.login();
    expect(accountService.finalLogin).toHaveBeenCalledWith(testToken, '/');
  });

  it('#login() should do nothing if the form is not valid', () => {
    component.form = { valid: false, value: { username: 'testUser', password: 'testPassword' } } as any;

    accountService.login.and.returnValue(rxjs.of({}));

    component.login();
    expect(accountService.login).not.toHaveBeenCalled();
  });


});
