import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonToggle, IonBadge, IonItem,IonText, IonIcon, IonFooter, IonList, IonLabel, IonCardHeader, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonToggle, IonBadge, IonItem, IonText, IonFooter, IonList, IonIcon, IonCardHeader, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, FormsModule]
})
export class AboutPage implements OnInit {

  // Signals
  objectivesToggledOn = signal(false);

  constructor() { }

  ngOnInit() {
  }

}
