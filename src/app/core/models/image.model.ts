export interface ImageInfo {
  id: string;
  fileName: string;
  url: string;
  title: string;
  description: string;
  tagsList: string[];
  imageFile: File | null;
  comments?: Comment[];
  notes?: string;
}

export interface Comment {
  author: string;
  email: string;
  text: string;
  date: Date;
}