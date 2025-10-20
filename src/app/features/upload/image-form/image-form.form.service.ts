import { ElementRef, inject, Injectable, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ImageInfo } from '../../../core/models/image.model';
import { ImageForm } from './image-form.types';
@Injectable({
    providedIn: 'root'
})
export class ImageFormFormService {
    private fb = inject(NonNullableFormBuilder);

    createForm(image?: ImageInfo): FormGroup<ImageForm> {
        const img = image ?? ({} as ImageInfo);

        const tags = (img.tagsList ?? []).map(t => this.fb.control(t ?? '', [Validators.maxLength(100)]));

        return this.fb.group({
            id: this.fb.control<string>({ value: img.id ?? '', disabled: true }),
            fileName: this.fb.control<string>(img.fileName ?? '', [Validators.required, Validators.maxLength(255)]),
            url: this.fb.control<string>(img.url ?? '', [Validators.required, Validators.maxLength(2000)]),
            title: this.fb.control<string>(img.title ?? '', [Validators.required, Validators.maxLength(255)]),
            description: this.fb.control<string>(img.description ?? '', [Validators.required, Validators.maxLength(2000)]),
            tagsList: this.fb.array(tags),
            imageFile: this.fb.control<File | null>(null)
        });
    }

    tags(form: FormGroup<ImageForm>): FormArray {
        return form.get('tagsList') as FormArray;
    }

    addTag(form: FormGroup<ImageForm>, tag: string) {
        const tags = form.get('tagsList') as FormArray;
        tags.push(this.fb.control(tag, [Validators.maxLength(100)]));
    }

    removeTag(form: FormGroup<ImageForm>, index: number) {
        const tags = form.get('tagsList') as FormArray;
        tags.removeAt(index);
    }

    resetForm(form: FormGroup<ImageForm>) {
        form.reset();
        form.patchValue({ imageFile: null });
        form.controls.imageFile.markAsPristine();
        form.controls.imageFile.markAsUntouched();
    }
}

