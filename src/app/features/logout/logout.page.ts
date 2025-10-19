import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, CommonModule, FormsModule, RouterLink]
})
export class LogoutPage {

  private authService = inject(AuthService);
  
  loggedOut = signal(false);

  constructor() { 
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
      this.loggedOut.set(true);
    }  
  }
}
