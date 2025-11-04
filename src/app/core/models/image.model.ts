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

export interface Pin {
  public: boolean;
  temporal: boolean;
  email: string;
  id: string;
  x: number;
  y: number;
  zoom: number;
  text: string;
}