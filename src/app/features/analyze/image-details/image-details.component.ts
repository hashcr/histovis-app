import { Component, computed, input, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonChip, IonTextarea, IonAvatar, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ImageInfo } from 'src/app/core/models/image.model';


@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonChip, IonTextarea, IonAvatar, IonInput, IonButton, IonIcon]
})
export class ImageDetailsComponent {
  // Signals
  imageInfo = input.required<ImageInfo | null>();

  notes = computed(() => {
    const imageInfo = this.imageInfo();
    if (imageInfo) {
      return imageInfo.notes ?? '';
    }
    return '';
  });

  constructor() { }

  addComment() {
  }

}
