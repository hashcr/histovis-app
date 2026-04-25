import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ImageService } from '../../shared/services/image.service';
import { ImageInfo } from 'src/app/core/models/image.model';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { ImageCardComponent } from 'src/app/features/search/image-card/image-card.component'
import { ImageSearchRequest } from '../../shared/services/image.service.types';
import { TagsSelectorComponent } from '../../shared/components/tags-selector/tags-selector.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.page.html',
  styleUrls: ['./image-search.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonGrid, IonRow, IonCol, CommonModule, ReactiveFormsModule, ImageCardComponent, TagsSelectorComponent]
})
export class ImageSearchPage {
  // Services
  private imageService = inject(ImageService);
  private notifications = inject(NotificationService);

  // Form controls
  tagsArray = new FormArray<FormControl<string>>([]);

  // Signals

  filteredImages = signal<ImageInfo[]>([]);
  searchTerm = signal<string>('');
  tagsChanges = toSignal(this.tagsArray.valueChanges, { initialValue: [] });

  constructor() {
    effect(() => {
      const term = this.searchTerm().toLowerCase();
      const tagsComp = this.tagsChanges();
      const tagsList =  tagsComp.filter(tag => tag).map(tag => tag!.toLowerCase());
      const request = this.createSearchRequest(term, tagsList);
      this.retrieveImages(request);
    });
  }

  async retrieveImages(request: ImageSearchRequest) {
    this.imageService.search(request).subscribe({
      next: async (imagesResponse) => {
        this.filteredImages.set(imagesResponse.images);
      },
      error: async (err) => {
        await this.notifications.showError(err.error?.message || 'Could not retrieve images');
      }
    });
  }

  createSearchRequest(term: string, tagsList: string[]) {
    return {
      query: term,
      tagsList: tagsList
    };
  }

  onSearch(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
