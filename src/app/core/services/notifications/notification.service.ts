import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastCtrl = inject(ToastController);

  async showSuccess(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color: 'success',
      position: 'top',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3500,
      color: 'danger',
      position: 'top',
      icon: 'alert-circle-outline'
    });
    await toast.present();
  }
}
