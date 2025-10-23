import { Injectable } from '@angular/core';
import { ImageInfo } from 'src/app/core/models/image.model';


@Injectable({
    providedIn: 'root'
})
export class UpdateImageFormValueService {

    apply(image: ImageInfo): FormData {
        const formData = new FormData();
        formData.append('fileName', image.fileName);
        formData.append('url', image.url);
        formData.append('title', image.title);
        formData.append('description', image.description);
        formData.append('tagsList', JSON.stringify(image.tagsList));
        if (image.imageFile) {
            formData.append('imageFile', image.imageFile);
        }
        if (image.notes !== undefined && image.notes !== null) {
            formData.append('notes', image.notes);            
        }
        if (image.comments) {
            formData.append('comments', JSON.stringify(image.comments));
        }
        return formData;
    }
}
