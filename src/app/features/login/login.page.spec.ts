import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { LoginFormService } from './login.form.service';
import { LoginFormValueService } from './login.form.value.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  let loginFormServiceSpy: jasmine.SpyObj<LoginFormService>;
  let loginFormValueServiceSpy: jasmine.SpyObj<LoginFormValueService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  function buildForm() {
    return new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  beforeEach(async () => {
    loginFormServiceSpy = jasmine.createSpyObj('LoginFormService', ['createForm']);
    loginFormValueServiceSpy = jasmine.createSpyObj('LoginFormValueService', ['toModel']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    loginFormServiceSpy.createForm.and.callFake(() => buildForm());
    loginFormValueServiceSpy.toModel.and.callFake((f: FormGroup) => ({
      username: f.get('username')?.value,
      password: f.get('password')?.value
    }));
    loginServiceSpy.login.and.returnValue(
      of({ user: { username: 'a@b.com', firstName: 'A', lastName: 'B', token: 'tok', isAdmin: false } })
    );
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

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

  it('should show error when username field is invalid (empty)', () => {
    component.form.get('username')!.setValue('');
    component.form.get('username')!.markAsTouched();
    fixture.detectChanges();

    expect(component.form.get('username')!.invalid).toBeTrue();
    expect(component.form.get('username')!.errors?.['required']).toBeTrue();
  });

  it('should show error when password field is invalid (empty)', () => {
    component.form.get('password')!.setValue('');
    component.form.get('password')!.markAsTouched();
    fixture.detectChanges();

    expect(component.form.get('password')!.invalid).toBeTrue();
    expect(component.form.get('password')!.errors?.['required']).toBeTrue();
  });

  it('should set loading true during login, false after success', async () => {
    component.form.patchValue({ username: 'a@b.com', password: 'pw' });

    // Capture loading state synchronously during the subscribe setup
    let loadingDuringCall = false;
    loginServiceSpy.login.and.callFake(() => {
      loadingDuringCall = component.loading();
      return of({ user: { username: 'a@b.com', firstName: 'A', lastName: 'B', token: 'tok', isAdmin: false } });
    });

    await component.onSubmit();

    expect(loadingDuringCall).toBeTrue();
    expect(component.loading()).toBeFalse();
  });

  it('should call login and navigate to /home on success', async () => {
    component.form.patchValue({ username: 'a@b.com', password: 'pw' });

    await component.onSubmit();

    expect(loginFormValueServiceSpy.toModel).toHaveBeenCalledWith(component.form);
    expect(loginServiceSpy.login).toHaveBeenCalledWith({ username: 'a@b.com', password: 'pw' });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home', { replaceUrl: true });
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('should set error signal when login fails', async () => {
    loginServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));
    component.form.patchValue({ username: 'a@b.com', password: 'pw' });

    await component.onSubmit();

    expect(loginServiceSpy.login).toHaveBeenCalled();
    expect(component.error()).toBe('Login failed');
    expect(component.loading()).toBeFalse();
  });

  it('should clear error on new submit attempt', async () => {
    // First submit fails, sets error
    loginServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));
    component.form.patchValue({ username: 'a@b.com', password: 'pw' });
    await component.onSubmit();
    expect(component.error()).toBe('Login failed');

    // Second submit should clear the error before the call
    loginServiceSpy.login.and.returnValue(
      of({ user: { username: 'a@b.com', firstName: 'A', lastName: 'B', token: 'tok', isAdmin: false } })
    );

    let errorDuringSecondCall = 'not-checked';
    loginServiceSpy.login.and.callFake(() => {
      errorDuringSecondCall = component.error();
      return of({ user: { username: 'a@b.com', firstName: 'A', lastName: 'B', token: 'tok', isAdmin: false } });
    });

    await component.onSubmit();

    // Error must be cleared at the start of onSubmit before login is called
    expect(errorDuringSecondCall).toBe('');
  });
});
