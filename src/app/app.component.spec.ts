import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(5);
    expect(menuItems[0].textContent).toContain('Guest');
    expect(menuItems[1].textContent).toContain('Home');
    expect(menuItems[2].textContent).toContain('Upload');
    expect(menuItems[3].textContent).toContain('Search');
    expect(menuItems[4].textContent).toContain('Analyze');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].getAttribute('href')).toEqual(
      '/home'
    );
    expect(menuItems[1].getAttribute('href')).toEqual(
      '/upload'
    );
    expect(menuItems[2].getAttribute('href')).toEqual(
      '/search'
    );
    expect(menuItems[3].getAttribute('href')).toEqual(
      '/analyze'
    );
  });
});
