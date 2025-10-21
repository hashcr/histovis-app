import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { UploadImagePage } from './upload-image.page';
import { ImageService } from '../../shared/services/image.service';
import { UploadImageFormValueService } from './upload-image.form.value.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { Router, provideRouter } from '@angular/router';

describe('UploadImagePage', () => {
  let component: UploadImagePage;
  let fixture: ComponentFixture<UploadImagePage>;

  // Minimal spies matching the methods used by the component
  const imageServiceSpy = {
    upload: jasmine.createSpy('upload').and.returnValue(of({}))
  } as unknown as Partial<ImageService>;

  const uploadImageFormValueServiceSpy = {
    apply: jasmine.createSpy('apply').and.callFake((form: any) => new FormData())
  } as unknown as Partial<UploadImageFormValueService>;

  // We'll provide a real Router via provideRouter([]) and spy on its navigateByUrl during setup

  const notificationServiceSpy = {
    showSuccess: jasmine.createSpy('showSuccess').and.returnValue(Promise.resolve()),
    showError: jasmine.createSpy('showError').and.returnValue(Promise.resolve())
  } as unknown as Partial<NotificationService>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UploadImagePage],
      providers: [
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: UploadImageFormValueService, useValue: uploadImageFormValueServiceSpy },
        provideRouter([]),
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    // Spy on the actual Router instance so calls are recorded but the method still executes
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.callThrough();

    fixture = TestBed.createComponent(UploadImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
