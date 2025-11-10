import { Component, Input, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonToggle,
  IonContent,
  IonTextarea
} from '@ionic/angular/standalone';
import { Pin } from 'src/app/core/models/image.model';

@Component({
  selector: 'app-pin-popover',
  templateUrl: './pin-popover.component.html',
  styleUrls: ['./pin-popover.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonToggle,
    IonContent,
    IonTextarea,
    ReactiveFormsModule
  ]
})
export class PinPopoverComponent implements OnInit {
  @Input() pinData!: Pin;

  isPersistant = signal(false);
  isPublic = signal(false);

  // Form Controls
  noteText = new FormControl<string>('');

  ngOnInit(): void {
    const isPub = this.pinData.isPublic;
    this.isPublic.set(isPub);
    this.noteText.setValue(this.pinData.text);
  }

  onSave() {
    // Logic to save pin details
  }

  togglePersistant() {
    this.isPersistant.set(!this.isPersistant());
  }

  togglePublic() {
    this.isPublic.set(!this.isPublic());
  }
}