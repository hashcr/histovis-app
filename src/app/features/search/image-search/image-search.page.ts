import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ImageService } from '../../upload/services/image.service';
import { ImageInfo } from 'src/app/core/models/image.model';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.page.html',
  styleUrls: ['./image-search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ImageSearchPage {
  // Services
  private imageService = inject(ImageService);
  
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
    // This method will fetch images from the ImageService
  }
}
