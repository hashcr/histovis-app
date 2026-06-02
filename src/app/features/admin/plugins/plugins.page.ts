import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.page.html',
  styleUrls: ['./plugins.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class PluginsPage {}
