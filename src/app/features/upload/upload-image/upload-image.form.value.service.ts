import { Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ImageUploadRequest } from '../../shared/services/image.service.types';
import { ImageFormValue } from '../image-form/image-form.types';


@Injectable({
    providedIn: 'root'
})
export class UploadImageFormValueService {

    apply(form: ImageFormValue): FormData {
        const v = form.getRawValue();
        const formData = new FormData();
        formData.append('fileName', v.fileName);
        formData.append('url', v.url);
        formData.append('title', v.title);
        formData.append('description', v.description);
        formData.append('tagsList', JSON.stringify(v.tagsList));
        if (v.imageFile) {
            formData.append('imageFile', v.imageFile);
        }
        return formData;
    }
}
