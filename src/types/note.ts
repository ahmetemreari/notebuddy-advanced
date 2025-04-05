
export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tags?: string[];
  color?: string;
}

export type NoteFormData = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guest';
  createdAt: Date;
  authProvider?: 'email' | 'google' | 'facebook' | 'twitter' | 'github' | 'guest';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SocialAuthProvider {
  name: string;
  icon: React.ElementType;
}
