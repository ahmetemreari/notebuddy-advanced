
export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}

export type NoteFormData = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export interface Folder {
  id: string;
  name: string;
  color?: string;
}
