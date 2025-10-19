import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutPage } from './logout.page';
import { AuthService } from 'src/app/core/auth/auth.service';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let fixture: ComponentFixture<LogoutPage>;

  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);

    await TestBed.configureTestingModule({
      imports: [LogoutPage],
      providers: [
        provideRouter([]),
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

  it('should navigate to /login when "Log in here" is clicked', async () => {
    // ensure component created
    authSpy.isLoggedIn.and.returnValue(false);
    fixture = TestBed.createComponent(LogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callThrough();

    // Find the button by text content
    const buttonDebug = fixture.debugElement.queryAll(By.css('ion-button')).find(de => {
      const el: HTMLElement = de.nativeElement;
      return el.textContent?.trim() === 'Log in here';
    });

    expect(buttonDebug).toBeTruthy();

    // Simulate click
    buttonDebug!.nativeElement.click();
    fixture.detectChanges();

    // RouterTestingModule's default behavior will convert string to UrlTree via navigateByUrl
    expect(navigateSpy).toHaveBeenCalled();
    // If navigateByUrl was called with a string, it may be '/login' or an UrlTree; check call args
    const calledWith = navigateSpy.calls.mostRecent().args[0];
    const calledStr = typeof calledWith === 'string' ? calledWith : calledWith?.toString?.();
    expect(calledStr).toContain('/login');
  });
});
