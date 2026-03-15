import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonAvatar, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadSharp, cloudUploadOutline, buildSharp, buildOutline, settingsSharp, settingsOutline, logOutSharp, logOutOutline, searchSharp, searchOutline, homeSharp, homeOutline, closeCircleOutline, informationCircleOutline, informationCircleSharp, sendSharp, personCircleOutline, trashSharp, mailOutline, logoGithub, globeOutline } from 'ionicons/icons';
import { User } from './core/models/user.model';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList,
    IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonAvatar, IonChip],
})
export class AppComponent {
  private authService = inject(AuthService);

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Upload', url: '/upload', icon: 'cloud-upload' },
    { title: 'Search', url: '/search', icon: 'search' },
    { title: 'Analyze', url: '/analyze', icon: 'build' },
  ];

  constructor() {
    addIcons({
      'home-sharp': homeSharp,
      'home-outline': homeOutline,
      'cloud-upload-sharp': cloudUploadSharp,
      'cloud-upload-outline': cloudUploadOutline,
      'search-sharp': searchSharp,
      'search-outline': searchOutline,
      'log-out-sharp': logOutSharp,
      'log-out-outline': logOutOutline,
      'settings-sharp': settingsSharp,
      'settings-outline': settingsOutline,
      'build-sharp': buildSharp,
      'build-outline': buildOutline,
      'close-circle': closeCircleOutline,
      'information-circle-outline': informationCircleOutline,
      'information-circle-sharp': informationCircleSharp,
      'send-sharp': sendSharp,
      'person-circle-outline': personCircleOutline,
      'trash-sharp': trashSharp,
      'mail-outline': mailOutline,
      'logo-github': logoGithub,
      'globe-outline': globeOutline
    });
  }

  loggedUser = computed<User | null>(() => this.authService.user());
}
