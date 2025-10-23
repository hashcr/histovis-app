import { ImageInfo } from "src/app/core/models/image.model";

export interface ImageUploadRequest {
    image: ImageInfo;
}

export interface ImageUploadResponse {
    id: string;
}

export interface ImageSearchResponse {
    images: ImageInfo[];
}

export interface ImageGetResponse {
    image: ImageInfo;
}

export interface ImageUpdateResponse {
}
