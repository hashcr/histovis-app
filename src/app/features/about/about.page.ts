import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonItem,IonText, IonIcon, IonFooter, IonList, IonLabel, IonCardHeader, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonItem, IonText, IonFooter, IonList, IonIcon, IonCardHeader, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, FormsModule]
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
