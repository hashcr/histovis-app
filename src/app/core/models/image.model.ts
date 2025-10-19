export interface ImageInfo {
  id: string;
  fileName: string;
  url: string;
  title: string;
  description: string;
  tagsList: string[];
  imageFile: File | null;
}