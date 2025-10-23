import { Component, effect, inject, Input, input, signal } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonChip, IonTextarea, IonAvatar, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ImageInfo, Comment } from 'src/app/core/models/image.model';
import { ImageDetailsFormService } from './image-details.form.service';
import { ImageService } from '../../shared/services/image.service';
import { UpdateImageFormValueService } from '../../shared/services/update-image.form.value.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { getAuthor } from '../../shared/utils/user.utils';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { removeAtIndex } from '../../shared/utils/utils';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
  standalone: true,
  imports: [DatePipe, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonChip, IonTextarea, IonAvatar, IonInput, IonButton, IonIcon, ReactiveFormsModule]
})
export class ImageDetailsComponent {
  // Services
  formService = inject(ImageDetailsFormService);
  imageService = inject(ImageService);
  updateImageFormValueService = inject(UpdateImageFormValueService);
  notifications = inject(NotificationService);
  authService = inject(AuthService);

  // Signals
  imageInfo = signal<ImageInfo | null>(null);

  @Input({ required: true })
  set image(value: ImageInfo | null) {
    this.imageInfo.set(value);
  }

  get image(): ImageInfo | null {
    return this.imageInfo();
  }

  // Form controls
  noteControl = this.formService.createNotesFormControl();
  commentControl = this.formService.createCommentsFormControl();

  constructor() {
    effect(() => {
      const info = this.imageInfo();
      if (info) {
        this.noteControl.setValue(info.notes ?? '', { emitEvent: false })
      }
    });
  }

  saveNote() {
    const notes = this.noteControl.value.trim();
    const imageInfo = this.imageInfo();
    if (imageInfo) {
      const newImageInfo = this.cloneAndPatchNotes(imageInfo, notes);
      const formDataRequest = this.updateImageFormValueService.apply(newImageInfo);
      this.imageService.update(formDataRequest, newImageInfo.id).subscribe({
        error: async (err) => {
          await this.notifications.showError(err.error?.message || 'Could not save the notes try again');
        }
      });
    }
  }

  addComment() {
    const newComment = this.commentControl.value.trim();
    if (newComment) {
      const imageInfo = this.imageInfo();
      if (imageInfo) {
        const newImageInfo = this.cloneAndAppendComment(imageInfo, newComment);
        const formDataRequest = this.updateImageFormValueService.apply(newImageInfo);
        this.imageService.update(formDataRequest, newImageInfo.id).subscribe({
          next: async (response) => {
            this.imageInfo.set(newImageInfo);
            this.commentControl.setValue("");
          },
          error: async (err) => {
            await this.notifications.showError(err.error?.message || 'Could not save the comments try again');
          }
        });
      }
    }
  }

  removeComment(index: number) {
    const imageInfo = this.imageInfo();
    if (imageInfo) {
      const newImageInfo = this.removeCommentFromImage(imageInfo, index);
      const formDataRequest = this.updateImageFormValueService.apply(newImageInfo);
      this.imageService.update(formDataRequest, newImageInfo.id).subscribe({
        next: async (response) => {
          this.imageInfo.set(newImageInfo);
        },
        error: async (err) => {
          await this.notifications.showError(err.error?.message || 'Could not remove the comment try again');
        }
      });
    }
  }

  isMine(c: Comment): boolean {
    return this.authService.user()?.email === c.email;
  }

  private removeCommentFromImage(newImageInfo: ImageInfo, index: number) {
    if (!newImageInfo.comments || newImageInfo.comments.length == 0 || newImageInfo.comments.length <= index)
      return newImageInfo;

    return {
      ...newImageInfo,
      comments: removeAtIndex<Comment>(newImageInfo.comments, index)
    }
  }

  private cloneAndPatchNotes(currentImageInfo: ImageInfo, notes: string): ImageInfo {
    const patched = {
      ...currentImageInfo,
      notes: notes
    }
    return patched;
  }

  private cloneAndAppendComment(currentImageInfo: ImageInfo, newComment: string): ImageInfo {
    if (!currentImageInfo)
      return currentImageInfo;

    const patched = {
      ...currentImageInfo,
      comments: [...currentImageInfo.comments ?? [], this.createComment(newComment)]
    }
    return patched;
  }

  private createComment(newComment: string): Comment {
    return {
      author: getAuthor(this.authService.user()),
      email: this.authService.user()?.email ?? "",
      text: newComment,
      date: new Date()
    };
  }

}
