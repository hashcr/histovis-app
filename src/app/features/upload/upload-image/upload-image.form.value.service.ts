import { Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ImageUploadRequest } from '../services/image.service.types';
import { ImageFormValue } from '../image-form/image-form.types';


@Injectable({
    providedIn: 'root'
})
export class UploadImageFormValueService {

    apply(form: ImageFormValue): ImageUploadRequest {
        const v = form.getRawValue();
        return {
            image: {
                id: '',
                fileName: v.fileName,
                url: v.url,
                title: v.title,
                description: v.description,
                tagsList: v.tagsList,
                imageFile: v.imageFile
            }
        };
    }
}
