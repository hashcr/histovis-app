import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { ImageFormFormService } from './image-form.form.service';
import { ImageInfo } from '../../../core/models/image.model';
import { FormArray } from '@angular/forms';
import { ImageFormValue } from './image-form.types';
import { IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonText, IonContent, IonImg, IonChip} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonInput, IonTextarea, ReactiveFormsModule, IonButton, IonIcon, IonText, IonContent, IonImg, IonChip],
})
export class ImageFormComponent {

  // Services
  private imageFormService = inject(ImageFormFormService);

  // Signals
  imageData = input.required<ImageInfo>();
  save = output<ImageFormValue>();
  preview = signal<string | null>(null);

  // Form
  readonly form = computed(() => this.imageFormService.createForm(this.imageData()));

  constructor() {
    effect(() => {
      const data = this.imageData();
      if (data.url) { 
        this.preview.set(data.url)
      };
    });
  }

  get tags(): FormArray {
    return this.imageFormService.tags(this.form());
  }

  addTag(tag: string | number | null | undefined) {
    if (!tag) return;
    const text = `${tag}`; 
    if (text.trim()) {
      this.imageFormService.addTag(this.form(), text.trim());
    }
  }

  removeTag(index: number) {
    this.imageFormService.removeTag(this.form(), index);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form().patchValue({ imageFile: file });
      const reader = new FileReader();
      reader.onload = () => this.preview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form().invalid) return;
    this.save.emit(this.form());
  }
}
