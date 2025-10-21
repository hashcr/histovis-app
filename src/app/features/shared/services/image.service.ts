import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Observable, tap } from 'rxjs';
import { ImageGetResponse, ImageSearchResponse, ImageUploadRequest, ImageUploadResponse } from './image.service.types';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
    private api = inject(ApiService);

    upload(payload: FormData): Observable<ImageUploadResponse> {
        return this.api.post<ImageUploadResponse, FormData>('images', payload);
    }

    getAll(): Observable<ImageSearchResponse> {
      return this.api.get<ImageSearchResponse>('images/search');
    }

    get(id: string): Observable<ImageGetResponse> {
      return this.api.get<ImageGetResponse>(`images/${id}`);
    }
}
