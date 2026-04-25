import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ImageDetailsComponent } from './image-details.component';
import { ImageInfo, Comment } from 'src/app/core/models/image.model';
import { ImageDetailsFormService } from './image-details.form.service';
import { ImageService } from '../../shared/services/image.service';
import { UpdateImageFormValueService } from '../../shared/services/update-image.form.value.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { AuthService } from 'src/app/core/auth/auth.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildDummyImage(overrides: Partial<ImageInfo> = {}): ImageInfo {
  return {
    id: 'img-1',
    fileName: 'example.jpg',
    url: 'http://example.com/image.jpg',
    title: 'Example Image',
    description: 'An example image.',
    tagsList: ['example'],
    imageFile: null,
    notes: '',
    comments: [],
    ...overrides,
  };
}

// ── Test host ─────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  template: `<app-image-details [image]="image"></app-image-details>`,
  imports: [ImageDetailsComponent],
})
class TestHostComponent {
  image!: ImageInfo | null;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('ImageDetailsComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: ImageDetailsComponent;

  let formServiceSpy: jasmine.SpyObj<ImageDetailsFormService>;
  let imageServiceSpy: jasmine.SpyObj<ImageService>;
  let updateImageFormValueServiceSpy: jasmine.SpyObj<UpdateImageFormValueService>;
  let notificationsSpy: jasmine.SpyObj<NotificationService>;
  let authServiceSpy: { user: jasmine.Spy };

  let notesControl: FormControl<string>;
  let commentsControl: FormControl<string>;

  const CURRENT_USER = { username: 'me@example.com', firstName: 'Me', lastName: 'User', token: 'tok', isAdmin: false };

  beforeEach(waitForAsync(() => {
    notesControl    = new FormControl('', { nonNullable: true });
    commentsControl = new FormControl('', { nonNullable: true });

    formServiceSpy = jasmine.createSpyObj('ImageDetailsFormService', ['createNotesFormControl', 'createCommentsFormControl']);
    formServiceSpy.createNotesFormControl.and.returnValue(notesControl);
    formServiceSpy.createCommentsFormControl.and.returnValue(commentsControl);

    imageServiceSpy = jasmine.createSpyObj('ImageService', ['update']);
    imageServiceSpy.update.and.returnValue(of({}));

    updateImageFormValueServiceSpy = jasmine.createSpyObj('UpdateImageFormValueService', ['apply']);
    updateImageFormValueServiceSpy.apply.and.returnValue(new FormData());

    notificationsSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    notificationsSpy.showError.and.returnValue(Promise.resolve());
    notificationsSpy.showSuccess.and.returnValue(Promise.resolve());

    authServiceSpy = {
      user: jasmine.createSpy('user').and.returnValue(CURRENT_USER)
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: ImageDetailsFormService,      useValue: formServiceSpy },
        { provide: ImageService,                 useValue: imageServiceSpy },
        { provide: UpdateImageFormValueService,  useValue: updateImageFormValueServiceSpy },
        { provide: NotificationService,          useValue: notificationsSpy },
        { provide: AuthService,                  useValue: authServiceSpy },
      ]
    });

    hostFixture   = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostComponent.image = buildDummyImage();
    hostFixture.detectChanges();

    component = hostFixture.debugElement
      .query(By.directive(ImageDetailsComponent))
      .componentInstance as ImageDetailsComponent;
  }));

  // ── Creation ────────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── saveNote ────────────────────────────────────────────────────────────────

  it('saveNote: calls imageService.update with updated notes', () => {
    const image = buildDummyImage({ id: 'img-1', notes: '' });
    component.imageInfo.set(image);
    component.noteControl.setValue('My important note');

    component.saveNote();

    expect(updateImageFormValueServiceSpy.apply).toHaveBeenCalledWith(
      jasmine.objectContaining({ notes: 'My important note' })
    );
    expect(imageServiceSpy.update).toHaveBeenCalledWith(jasmine.any(FormData), 'img-1');
  });

  it('saveNote error: shows error notification', async () => {
    const serverError = { error: { message: 'Save failed' } };
    imageServiceSpy.update.and.returnValue(throwError(() => serverError));

    component.imageInfo.set(buildDummyImage());
    component.noteControl.setValue('Note text');
    component.saveNote();

    await hostFixture.whenStable();

    expect(notificationsSpy.showError).toHaveBeenCalledWith('Save failed');
  });

  it('saveNote error: shows generic message when no server message', async () => {
    imageServiceSpy.update.and.returnValue(throwError(() => ({})));

    component.imageInfo.set(buildDummyImage());
    component.noteControl.setValue('Note text');
    component.saveNote();

    await hostFixture.whenStable();

    expect(notificationsSpy.showError).toHaveBeenCalledWith('Could not save the notes try again');
  });

  // ── addComment ──────────────────────────────────────────────────────────────

  it('addComment: calls imageService.update with appended comment', () => {
    const image = buildDummyImage({ comments: [] });
    component.imageInfo.set(image);
    component.commentControl.setValue('Great image!');

    component.addComment();

    expect(updateImageFormValueServiceSpy.apply).toHaveBeenCalledWith(
      jasmine.objectContaining({
        comments: jasmine.arrayContaining([
          jasmine.objectContaining({ text: 'Great image!' })
        ])
      })
    );
    expect(imageServiceSpy.update).toHaveBeenCalled();
  });

  it('addComment success: updates imageInfo signal with new comment', () => {
    const image = buildDummyImage({ comments: [] });
    component.imageInfo.set(image);
    component.commentControl.setValue('Hello world!');

    imageServiceSpy.update.and.returnValue(of({}));
    component.addComment();
    hostFixture.detectChanges();

    const updatedComments = component.imageInfo()?.comments ?? [];
    expect(updatedComments.length).toBe(1);
    expect(updatedComments[0].text).toBe('Hello world!');
  });

  it('addComment success: clears commentControl', () => {
    component.imageInfo.set(buildDummyImage({ comments: [] }));
    component.commentControl.setValue('Clear me');
    imageServiceSpy.update.and.returnValue(of({}));

    component.addComment();
    hostFixture.detectChanges();

    expect(component.commentControl.value).toBe('');
  });

  it('addComment: does nothing when comment is empty', () => {
    component.imageInfo.set(buildDummyImage());
    component.commentControl.setValue('   ');

    component.addComment();

    expect(imageServiceSpy.update).not.toHaveBeenCalled();
  });

  it('addComment error: shows error notification', async () => {
    imageServiceSpy.update.and.returnValue(throwError(() => ({ error: { message: 'Comment failed' } })));
    component.imageInfo.set(buildDummyImage({ comments: [] }));
    component.commentControl.setValue('Bad comment');

    component.addComment();
    await hostFixture.whenStable();

    expect(notificationsSpy.showError).toHaveBeenCalledWith('Comment failed');
  });

  // ── removeComment ───────────────────────────────────────────────────────────

  it('removeComment: calls imageService.update with comment removed', () => {
    const existingComment: Comment = {
      author: 'Test User', email: 'test@example.com', text: 'To remove', date: new Date()
    };
    const image = buildDummyImage({ comments: [existingComment] });
    component.imageInfo.set(image);

    component.removeComment(0);

    expect(updateImageFormValueServiceSpy.apply).toHaveBeenCalledWith(
      jasmine.objectContaining({ comments: [] })
    );
    expect(imageServiceSpy.update).toHaveBeenCalled();
  });

  it('removeComment success: updates imageInfo signal', () => {
    const comment1: Comment = { author: 'A', email: 'a@b.com', text: 'First',  date: new Date() };
    const comment2: Comment = { author: 'B', email: 'b@b.com', text: 'Second', date: new Date() };
    const image = buildDummyImage({ comments: [comment1, comment2] });
    component.imageInfo.set(image);
    imageServiceSpy.update.and.returnValue(of({}));

    component.removeComment(0);
    hostFixture.detectChanges();

    const remaining = component.imageInfo()?.comments ?? [];
    expect(remaining.length).toBe(1);
    expect(remaining[0].text).toBe('Second');
  });

  it('removeComment error: shows error notification', async () => {
    const comment: Comment = { author: 'A', email: 'a@b.com', text: 'Oops', date: new Date() };
    component.imageInfo.set(buildDummyImage({ comments: [comment] }));
    imageServiceSpy.update.and.returnValue(throwError(() => ({ error: { message: 'Remove failed' } })));

    component.removeComment(0);
    await hostFixture.whenStable();

    expect(notificationsSpy.showError).toHaveBeenCalledWith('Remove failed');
  });

  // ── isMine ──────────────────────────────────────────────────────────────────

  it('isMine: returns true when comment email matches current user username', () => {
    const myComment: Comment = { author: 'Me', email: 'me@example.com', text: 'Mine', date: new Date() };
    expect(component.isMine(myComment)).toBeTrue();
  });

  it('isMine: returns false when comment email does not match', () => {
    const otherComment: Comment = { author: 'Other', email: 'other@example.com', text: 'Not mine', date: new Date() };
    expect(component.isMine(otherComment)).toBeFalse();
  });
});
