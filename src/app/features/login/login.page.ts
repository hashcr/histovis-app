import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem , IonInput, IonText, IonButton, IonSpinner, IonInputPasswordToggle} from '@ionic/angular/standalone';
import { LoginFormService } from './login.form.service';
import { LoginFormValueService } from './login.form.value.service';
import { LoginRequest } from './login.service.types';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, 
    IonText, IonButton, IonSpinner, IonInputPasswordToggle, CommonModule, ReactiveFormsModule]
})
export class LoginPage {

  // Services
  private loginFormService = inject(LoginFormService);
  private loginFormValueService = inject(LoginFormValueService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  
  // Ui elements
  form = this.loginFormService.createForm();
  loading = signal(false);
  error = signal('');

  async onSubmit() {
    const payload: LoginRequest = this.loginFormValueService.toModel(this.form);
    this.loading.set(true);
    this.error.set('');

    this.loginService.login(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error.set('Login failed');
        this.loading.set(false);
      }
    });
  }

}
