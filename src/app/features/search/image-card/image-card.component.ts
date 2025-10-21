import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonImg, IonCardHeader, IonText, IonChip, IonLabel, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonImg, IonCardHeader, IonText, IonChip, IonLabel, IonCardContent],
})
export class ImageCardComponent  {

  get image() {
    return { 
      url: "", 
      title: "Sample Image", 
      description: "This is a sample image description.", 
      tags: ["sample", "image"] 
    };
  }
}
