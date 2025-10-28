import { Component, inject, input } from '@angular/core';
import { ImageFormFormService } from '../../../upload/image-form/image-form.form.service';
import { FormArray, FormControl } from '@angular/forms';
import { IonInput, IonItem, IonLabel, IonChip, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonLabel, IonChip, IonIcon]
})
export class TagsSelectorComponent {
  // Signals
  tagsArray = input.required<FormArray<FormControl<string>>>();

  // Services
  imageFormService = inject(ImageFormFormService);

  addTag(tag: string | number | null | undefined) {
    if (!tag) return;
    const text = `${tag}`;
    if (text.trim()) {
      this.imageFormService.addTag(this.tagsArray(), text.trim());
    }
  }

  removeTag(index: number) {
    this.imageFormService.removeTag(this.tagsArray(), index);
  }

  async onTagEnter(eventx: Event, tagInput: IonInput) {
    const event = eventx as KeyboardEvent;
    event.preventDefault();
    event.stopPropagation(); 

    const inputEl = await tagInput.getInputElement();
    const value = inputEl.value?.trim() ?? '';
    if (!value) return;

    this.addTag(value);
    inputEl.value = '';
  }
}
