import { ImageInfo } from "src/app/core/models/image.model";

export function createDefaultImageInfo(): ImageInfo {
    return {
        id: '',
        fileName: '',
        url: '',
        title: '',
        description: '',
        tagsList: [],
        imageFile: null
    }
}