import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Observable } from 'rxjs';
import { ImageGetResponse, ImageSearchResponse, ImageUploadResponse, ImageUpdateResponse, ImageSearchRequest, ImageGetPinsResponse, AddPinResponse, AddPinRequest, UpdatePinResponse, UpdatePinRequest, DeletePinResponse } from './image.service.types';
import { Pin } from 'src/app/core/models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
    private api = inject(ApiService);

    update(payload: FormData, id: string): Observable<ImageUpdateResponse> {
      return this.api.put<ImageUpdateResponse, FormData>(`images/${id}`, payload);
    }

    upload(payload: FormData): Observable<ImageUploadResponse> {
      return this.api.post<ImageUploadResponse, FormData>('images', payload);
    }

    search(request: ImageSearchRequest): Observable<ImageSearchResponse> {
      return this.api.get<ImageSearchResponse, ImageSearchRequest>('images/search', request);
    }

    get(id: string): Observable<ImageGetResponse> {
      return this.api.get<ImageGetResponse>(`images/${id}`);
    }

    getPins(imageId: string): Observable<ImageGetPinsResponse> {
      return this.api.get<ImageGetPinsResponse>(`images/${imageId}/pins`);
    }

    addPin(imageId: string, pin: Pin): Observable<AddPinResponse> {
      return this.api.post<AddPinResponse, AddPinRequest>(`images/${imageId}/pins`, { pin });
    }

    updatePin(imageId: string, pin: Pin): Observable<UpdatePinResponse> {
      return this.api.put<UpdatePinResponse, UpdatePinRequest>(`images/${imageId}/pins/${pin.id}`, { pin });
    }

    deletePin(imageId: string, pinId: string): Observable<DeletePinResponse> {
      return this.api.delete<DeletePinResponse>(`images/${imageId}/pins/${pinId}`);
    }
}
