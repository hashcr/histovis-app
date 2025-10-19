import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutPage } from './logout.page';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router, provideRouter } from '@angular/router';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let fixture: ComponentFixture<LogoutPage>;

  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);

    await TestBed.configureTestingModule({
      imports: [LogoutPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
      ]
    }).compileComponents();
  });

  it('should create when not logged in', () => {
    authSpy.isLoggedIn.and.returnValue(false);
    fixture = TestBed.createComponent(LogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.loggedOut()).toBeFalse();
    expect(authSpy.logout).not.toHaveBeenCalled();
  });

  it('should call logout and set loggedOut when user is logged in', () => {
    authSpy.isLoggedIn.and.returnValue(true);
    fixture = TestBed.createComponent(LogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(authSpy.logout).toHaveBeenCalled();
    expect(component.loggedOut()).toBeTrue();
  });
});
