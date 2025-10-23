import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { of } from 'rxjs';

import { ImageDetailsComponent } from './image-details.component';
import { ImageInfo } from 'src/app/core/models/image.model';
import { ImageDetailsFormService } from './image-details.form.service';
import { ImageService } from '../../shared/services/image.service';
import { UpdateImageFormValueService } from '../../shared/services/update-image.form.value.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { AuthService } from 'src/app/core/auth/auth.service';

describe('ImageDetailsComponent', () => {
  let fixture: ComponentFixture<any>;
  let hostComponent: TestHostComponent;

  beforeEach(waitForAsync(() => {
    // Create spy objects for injected services used by ImageDetailsComponent
    const formServiceSpy = jasmine.createSpyObj('ImageDetailsFormService', ['createNotesFormControl', 'createCommentsFormControl']);
    const notesControl = new FormControl('');
    const commentsControl = new FormControl('');
    formServiceSpy.createNotesFormControl.and.returnValue(notesControl);
    formServiceSpy.createCommentsFormControl.and.returnValue(commentsControl);

    const imageServiceSpy = jasmine.createSpyObj('ImageService', ['update']);
    imageServiceSpy.update.and.returnValue(of({}));

    const updateImageFormValueServiceSpy = jasmine.createSpyObj('UpdateImageFormValueService', ['apply']);
    updateImageFormValueServiceSpy.apply.and.returnValue(new FormData());

    const notificationsSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    notificationsSpy.showError.and.returnValue(Promise.resolve());
    notificationsSpy.showSuccess.and.returnValue(Promise.resolve());

    // AuthService exposes a signal-like function 'user' which the component calls as user()
    const authServiceSpy: Partial<AuthService> = {
      user: jasmine.createSpy('user').and.returnValue({ email: 'test@example.com', name: 'Test User', token: '' }) as any
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: ImageDetailsFormService, useValue: formServiceSpy },
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: UpdateImageFormValueService, useValue: updateImageFormValueServiceSpy },
        { provide: NotificationService, useValue: notificationsSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    const dummyImage: ImageInfo = {
      id: '1',
      fileName: 'example.jpg',
      url: 'http://example.com/image.jpg',
      title: 'Example Image',
      description: 'This is an example image.',
      tagsList: ['example', 'image'],
      imageFile: null,
    };
    hostComponent.image = dummyImage;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });
});

@Component({
  standalone: true,
  template: ` <app-image-details [image]="image"></app-image-details>`,
  imports: [ImageDetailsComponent],
})
class TestHostComponent {
  image!: ImageInfo;
}
