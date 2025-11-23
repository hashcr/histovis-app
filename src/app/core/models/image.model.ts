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
  isPublic: boolean;
  isTemporal: boolean | undefined;
  email: string;
  id: string;
  sequence_id: number;
  x: number;
  y: number;
  zoom: number;
  text: string;
  persisted?: boolean;
}