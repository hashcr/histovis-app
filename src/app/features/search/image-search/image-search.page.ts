import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ImageService } from '../../shared/services/image.service';
import { ImageInfo } from 'src/app/core/models/image.model';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { ImageCardComponent } from 'src/app/features/search/image-card/image-card.component'

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.page.html',
  styleUrls: ['./image-search.page.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonTitle,IonContent, IonSearchbar, IonGrid, IonRow, IonCol, CommonModule, FormsModule, ImageCardComponent]
})
export class ImageSearchPage {
  // Services
  private imageService = inject(ImageService);
  private notifications = inject(NotificationService);

  // Signals

  retrievedImages = signal<ImageInfo[]>([]);
  searchTerm = signal<string>('');
  filteredImages = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.retrievedImages().filter(image => image.title.toLowerCase().includes(term));
  });

  constructor() {
    this.retrieveImages();
  }

  async retrieveImages() {
    this.imageService.getAll().subscribe({
      next: async (imagesResponse) => {
        this.retrievedImages.set(imagesResponse.images);
      },
      error: async (err) => {
        await this.notifications.showError(err.error?.message || 'Could not retrieve images');
      }
    });
  }

  onSearch(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
