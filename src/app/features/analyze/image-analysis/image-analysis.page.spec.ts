import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageAnalysisPage } from './image-analysis.page';
import { ImageService } from '../../shared/services/image.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { provideRouter, withComponentInputBinding  } from '@angular/router';
import { NgZone } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

describe('ImageAnalysisPage', () => {
  let component: ImageAnalysisPage;
  let fixture: ComponentFixture<ImageAnalysisPage>;
  let imageSearchServiceMock: jasmine.SpyObj<ImageService>;
  let notificactionsServiceMock: jasmine.SpyObj<NotificationService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    imageSearchServiceMock = jasmine.createSpyObj('ImageService', ['get']);
    notificactionsServiceMock = jasmine.createSpyObj('NotificationService', ['showError']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['user']);
    TestBed.configureTestingModule({
      imports: [ImageAnalysisPage],
      providers: [
        provideRouter(
          [
            { path: 'analyze/:id', component: ImageAnalysisPage },
          ],
          withComponentInputBinding(),),
        { provide: ImageService, useValue: imageSearchServiceMock },
        { provide: NotificationService, useValue: notificactionsServiceMock }
      ]
    });
    const zone = TestBed.inject(NgZone);
    spyOn(zone, 'run').and.callFake(fn => fn());

    fixture = TestBed.createComponent(ImageAnalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
