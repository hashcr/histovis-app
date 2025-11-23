import { ImageInfo, Pin } from "src/app/core/models/image.model";

export interface ImageUploadRequest {
    image: ImageInfo;
}

export interface ImageUploadResponse {
    id: string;
}

export interface ImageSearchRequest {
    query: string;
    tagsList: string[];
}

export interface ImageSearchResponse {
    images: ImageInfo[];
}

export interface ImageGetResponse {
    image: ImageInfo;
}

export interface ImageGetPinsResponse {
    pins: Pin[];
}

export interface ImageUpdateResponse {
}

export interface AddPinRequest {
    pin: Pin;
}

export interface AddPinResponse {
    pin: Pin;
}

export interface UpdatePinRequest {
    pin: Pin;
}

export interface UpdatePinResponse {
    pin: Pin;
}