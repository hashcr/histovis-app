
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadSharp, buildSharp, settingsSharp, logOutSharp, searchSharp, homeSharp} from 'ionicons/icons';
import { User } from './features/login/model';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  private authService = inject(AuthService);

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Upload', url: '/folder/upload', icon: 'cloud-upload' },
    { title: 'Search', url: '/folder/search', icon: 'search' },
    { title: 'Analyze', url: '/folder/analyze', icon: 'build' },
    { title: 'Admin', url: '/folder/admin', icon: 'settings' },
    { title: 'Logout', url: '/logout', icon: 'log-out' },
  ];

  constructor() {
    addIcons({
      'home-sharp': homeSharp,
      'cloud-upload-sharp': cloudUploadSharp,
      'search-sharp': searchSharp,
      'log-out-sharp': logOutSharp,
      'settings-sharp': settingsSharp,
      'build-sharp': buildSharp,
    });
  }

  loggedUser = computed<User | null>(() => this.authService.user());
}
