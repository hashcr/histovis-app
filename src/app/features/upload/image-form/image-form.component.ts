import { Component, computed, effect, ElementRef, inject, input, output, signal, untracked, ViewChild, WritableSignal } from '@angular/core';
import { ImageFormFormService } from './image-form.form.service';
import { ImageInfo } from '../../../core/models/image.model';
import { FormArray } from '@angular/forms';
import { ImageFormValue } from './image-form.types';
import { IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText, IonContent, IonImg } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsSelectorComponent } from '../../shared/components/tags-selector/tags-selector.component';


@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonInput, IonTextarea, ReactiveFormsModule, IonButton, IonText, IonContent, IonImg, TagsSelectorComponent],
})
export class ImageFormComponent {

  // Services
  private imageFormService = inject(ImageFormFormService);

  // Signals
  imageData = input.required<ImageInfo>();
  save = output<ImageFormValue>();
  preview = signal<string | null>(null);
  resetTrigger = input<WritableSignal<boolean>>();

  // Form
  readonly form = computed(() => this.imageFormService.createForm(this.imageData()));

  constructor() {
    effect(() => {
      const data = this.imageData();
      if (data.url) {
        this.preview.set(data.url)
      };
    });

    effect(() => {
      const trigger = this.resetTrigger();
      if (trigger?.()) {
        this.imageFormService.resetForm(this.form());
        this.preview.set(null);
        this.resetFileInput();

        // Reset the trigger back to false without looping
        untracked(() => {
          trigger.set(false);
        });
      }
    });
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  get tags(): FormArray {
    return this.imageFormService.tags(this.form());
  }

  maybeBlockEnter(evx: Event) {
    const ev = evx as KeyboardEvent;
    const target = ev.target as HTMLElement | null;
    if (target && target.closest('.tag-input')) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }
}
