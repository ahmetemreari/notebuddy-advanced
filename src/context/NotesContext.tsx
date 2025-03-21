
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, Folder } from '../types/note';

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  loading: boolean;
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  createNote: (title: string, folder: string) => Note;
  updateNote: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  togglePinned: (id: string) => void;
  createFolder: (name: string, color?: string) => Folder;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Sample data
const initialFolders: Folder[] = [
  { id: '1', name: 'Personal', color: '#4f46e5' },
  { id: '2', name: 'Work', color: '#059669' },
  { id: '3', name: 'Ideas', color: '#d97706' },
];

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'This is your first note. You can edit it or create a new one.',
    folder: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Discuss project timeline and delegate tasks.',
    folder: '2',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    pinned: false
  },
  {
    id: '3',
    title: 'App Ideas',
    content: 'Build a note taking app with a beautiful UI.',
    folder: '3',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    pinned: false
  }
];

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [loading, setLoading] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      const savedFolders = localStorage.getItem('folders');
      
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        })));
      }
      
      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
      localStorage.setItem('folders', JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  }, [notes, folders]);

  const createNote = (title: string, folder: string): Note => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content: '',
      folder,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...data, updatedAt: new Date() } 
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
  };

  const togglePinned = (id: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, pinned: !note.pinned, updatedAt: new Date() } 
          : note
      )
    );
  };

  const createFolder = (name: string, color?: string): Folder => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`
    };
    
    setFolders(prevFolders => [...prevFolders, newFolder]);
    return newFolder;
  };

  const value = {
    notes,
    folders,
    loading,
    activeNote,
    setActiveNote,
    createNote,
    updateNote,
    deleteNote,
    togglePinned,
    createFolder
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
