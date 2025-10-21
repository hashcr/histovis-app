import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Observable, tap } from 'rxjs';
import { ImageUploadRequest, ImageUploadResponse } from './image.service.types';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
    private api = inject(ApiService);

    upload(payload: FormData): Observable<ImageUploadResponse> {
        return this.api.post<ImageUploadResponse, FormData>('images', payload);
    }
}
