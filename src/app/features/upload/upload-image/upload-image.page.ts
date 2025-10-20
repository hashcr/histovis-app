import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ImageInfo } from '../../../core/models/image.model';
import { ImageFormComponent } from '../image-form/image-form.component';
import { ImageFormValue } from '../image-form/image-form.types';
import { createDefaultImageInfo } from './utils';
import { ImageService } from '../services/image.service';
import { UploadImageFormValueService } from './upload-image.form.value.service';
import { ImageFormFormService } from '../image-form/image-form.form.service';

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

  // Signals
  resetTrigger = signal(false); //  Signal to ImageFormComponent to reset the form

  // The empty model passed as required input to ImageFormComponent
  defaultImage = createDefaultImageInfo();

  onSave(formValue: ImageFormValue) {
    const request = this.uploadImageFormValueService.apply(formValue);
    this.imageService.upload(request).subscribe({
      next: async () => {
        this.resetTrigger.set(true);
        this.router.navigateByUrl('/upload', { replaceUrl: true })
      },
      error: err => console.error('Upload failed:', err),
    });
  }
}
