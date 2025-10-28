import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ImageInfo } from '../../../core/models/image.model';
import { ImageFormComponent } from '../image-form/image-form.component';
import { ImageFormValue } from '../image-form/image-form.types';
import { createDefaultImageInfo } from './utils';
import { ImageService } from '../../shared/services/image.service';
import { UploadImageFormValueService } from './upload-image.form.value.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';

@Component({
  standalone: true,
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
  imports: [CommonModule, IonicModule, ImageFormComponent, RouterModule],
})
export class UploadImagePage {
  // Services
  private imageService = inject(ImageService);
  private uploadImageFormValueService = inject(UploadImageFormValueService);
  private router = inject(Router);
  private notifications = inject(NotificationService);

  // Signals
  resetTrigger = signal(false); //  Signal to ImageFormComponent to reset the form

  // The empty model passed as required input to ImageFormComponent
  defaultImage = createDefaultImageInfo();

  onSave(formValue: ImageFormValue) {
    const request = this.uploadImageFormValueService.apply(formValue);
    this.imageService.upload(request).subscribe({
      next: async () => {
        this.resetTrigger.set(true);
        //await this.router.navigateByUrl('/upload', { replaceUrl: true });
        await this.notifications.showSuccess('Image uploaded successfully.');
      },
      error: async (err) => {
        await this.notifications.showError(err.error?.message || 'Could not save item');
      },
    });
  }
}
