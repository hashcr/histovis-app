import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { UploadImagePage } from './upload-image.page';
import { ImageService } from '../../shared/services/image.service';
import { UploadImageFormValueService } from './upload-image.form.value.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { provideRouter } from '@angular/router';
import { ImageFormValue } from '../image-form/image-form.types';

function buildImageFormValue(): ImageFormValue {
  return new FormGroup({
    id: new FormControl('', { nonNullable: true }),
    fileName: new FormControl('photo.jpg', { nonNullable: true }),
    url: new FormControl('http://example.com/photo.jpg', { nonNullable: true }),
    title: new FormControl('Test Title', { nonNullable: true }),
    description: new FormControl('A description', { nonNullable: true }),
    tagsList: new FormArray<FormControl<string>>([new FormControl('tag1', { nonNullable: true })]),
    imageFile: new FormControl<File | null>(null),
  }) as ImageFormValue;
}

describe('UploadImagePage', () => {
  let component: UploadImagePage;
  let fixture: ComponentFixture<UploadImagePage>;

  let imageServiceSpy: jasmine.SpyObj<ImageService>;
  let uploadImageFormValueServiceSpy: jasmine.SpyObj<UploadImageFormValueService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(waitForAsync(() => {
    imageServiceSpy = jasmine.createSpyObj('ImageService', ['upload']);
    uploadImageFormValueServiceSpy = jasmine.createSpyObj('UploadImageFormValueService', ['apply']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

    imageServiceSpy.upload.and.returnValue(of({ id: 'new-image-id' }));
    uploadImageFormValueServiceSpy.apply.and.returnValue(new FormData());
    notificationServiceSpy.showSuccess.and.returnValue(Promise.resolve());
    notificationServiceSpy.showError.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [UploadImagePage],
      providers: [
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: UploadImageFormValueService, useValue: uploadImageFormValueServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSave: calls formValueService.apply with the form value', () => {
    const formValue = buildImageFormValue();
    component.onSave(formValue);

    expect(uploadImageFormValueServiceSpy.apply).toHaveBeenCalledWith(formValue);
  });

  it('onSave: calls imageService.upload with the FormData result', () => {
    const fakeFormData = new FormData();
    uploadImageFormValueServiceSpy.apply.and.returnValue(fakeFormData);

    const formValue = buildImageFormValue();
    component.onSave(formValue);

    expect(imageServiceSpy.upload).toHaveBeenCalledWith(fakeFormData);
  });

  it('onSave success: shows success notification', async () => {
    imageServiceSpy.upload.and.returnValue(of({ id: 'new-image-id' }));

    const formValue = buildImageFormValue();
    component.onSave(formValue);

    // Wait for async notification call
    await fixture.whenStable();

    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Image uploaded successfully.');
  });

  it('onSave success: sets resetTrigger to true', async () => {
    imageServiceSpy.upload.and.returnValue(of({ id: 'new-image-id' }));
    expect(component.resetTrigger()).toBeFalse();

    const formValue = buildImageFormValue();
    component.onSave(formValue);

    await fixture.whenStable();

    expect(component.resetTrigger()).toBeTrue();
  });

  it('onSave error: shows error notification with server message', async () => {
    const serverError = { error: { message: 'File too large' } };
    imageServiceSpy.upload.and.returnValue(throwError(() => serverError));

    const formValue = buildImageFormValue();
    component.onSave(formValue);

    await fixture.whenStable();

    expect(notificationServiceSpy.showError).toHaveBeenCalledWith('File too large');
  });

  it('onSave error: shows generic error when no server message', async () => {
    imageServiceSpy.upload.and.returnValue(throwError(() => ({})));

    const formValue = buildImageFormValue();
    component.onSave(formValue);

    await fixture.whenStable();

    expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Could not save item');
  });
});
