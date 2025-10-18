
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadSharp, buildSharp, settingsSharp, logOutSharp, searchOutline} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Upload', url: '/folder/upload', icon: 'cloud-upload' },
    { title: 'Search', url: '/folder/outbox', icon: 'search' },
    { title: 'Analyze', url: '/folder/favorites', icon: 'build' },
    { title: 'Admin', url: '/folder/archived', icon: 'settings' },
    { title: 'Logout', url: '/folder/trash', icon: 'log-out' },
  ];
  constructor() {
    addIcons({
      'cloud-upload-sharp': cloudUploadSharp,
      'search-sharp': searchOutline,
      'log-out-sharp': logOutSharp,
      'settings-sharp': settingsSharp,
      'build-sharp': buildSharp,
    });
  }
}
