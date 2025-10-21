import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonImg, IonCardHeader, IonText, IonChip, IonLabel, IonCardContent } from '@ionic/angular/standalone';
import { ImageInfo } from 'src/app/core/models/image.model';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonImg, IonCardHeader, IonText, IonChip, IonLabel, IonCardContent],
})
export class ImageCardComponent  {
  // Input Signals
  image = input.required<ImageInfo>();
}
