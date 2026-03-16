import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { LoginFormService } from './login.form.service';
import { LoginFormValueService } from './login.form.value.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  // Spies
  let loginFormServiceSpy: jasmine.SpyObj<LoginFormService>;
  let loginFormValueServiceSpy: jasmine.SpyObj<LoginFormValueService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loginFormServiceSpy = jasmine.createSpyObj('LoginFormService', ['createForm']);
    loginFormValueServiceSpy = jasmine.createSpyObj('LoginFormValueService', ['toModel']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // default form
    const form = new FormGroup({ username: new FormControl(''), password: new FormControl('') });
    loginFormServiceSpy.createForm.and.returnValue(form);
    loginFormValueServiceSpy.toModel.and.callFake((f: FormGroup) => ({ username: f.get('username')?.value, password: f.get('password')?.value }));
    loginServiceSpy.login.and.returnValue(of({ user: { username: 'a@b.com', firstName: 'A', lastName: 'B', token: 'tok', isAdmin: false } }));

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: LoginFormService, useValue: loginFormServiceSpy },
        { provide: LoginFormValueService, useValue: loginFormValueServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success', async () => {
    component.form.patchValue({ username: 'a@b.com', password: 'pw' });
    await component.onSubmit();

    expect(loginFormValueServiceSpy.toModel).toHaveBeenCalled();
    expect(loginServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home', { replaceUrl: true });
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('should set error when login fails', async () => {
    loginServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));
    component.form.patchValue({ username: 'a@b.com', password: 'pw' });

    await component.onSubmit();

    expect(loginServiceSpy.login).toHaveBeenCalled();
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Login failed');
  });
});
