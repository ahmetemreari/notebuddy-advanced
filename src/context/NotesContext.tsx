
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, Folder } from '../types/note';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  createFolder: (name: string, color?: string) => Promise<Folder>;
  isAuthenticated: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        if (event === 'SIGNED_IN') {
          toast.success('Başarıyla giriş yapıldı');
          // Kullanıcı giriş yaptığında verileri yükle
          fetchFolders();
          fetchNotes();
        } else if (event === 'SIGNED_OUT') {
          toast.info('Çıkış yapıldı');
          // Çıkış yapıldığında verileri temizle
          setNotes([]);
          setFolders([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session) {
        // Eğer oturum varsa, verileri yükle
        fetchFolders();
        fetchNotes();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedNotes: Note[] = data.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content || '',
        folder: note.folder || '',
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        pinned: note.pinned || false,
      }));

      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Notlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedFolders: Folder[] = data.map(folder => ({
        id: folder.id,
        name: folder.name,
        color: folder.color,
      }));

      if (formattedFolders.length === 0) {
        // Eğer hiç klasör yoksa, varsayılan klasörleri oluştur
        const defaultFolders = [
          { name: 'Kişisel', color: '#4f46e5' },
          { name: 'İş', color: '#059669' },
          { name: 'Fikirler', color: '#d97706' }
        ];
        
        for (const folder of defaultFolders) {
          await createFolder(folder.name, folder.color);
        }
      } else {
        setFolders(formattedFolders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Klasörler yüklenirken bir hata oluştu');
    }
  };

  const createNote = (title: string, folder: string): Note => {
    if (!isAuthenticated) {
      toast.error('Not oluşturmak için giriş yapmalısınız');
      return {} as Note;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content: '',
      folder,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false
    };
    
    // Optimistic UI update
    setNotes(prevNotes => [newNote, ...prevNotes]);
    
    // Veritabanına kaydet
    supabase
      .from('notes')
      .insert({
        id: newNote.id,
        title: newNote.title,
        content: newNote.content,
        folder: newNote.folder,
        pinned: newNote.pinned,
        user_id: user.id
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error creating note:', error);
          toast.error('Not oluşturulurken bir hata oluştu');
          // Hata durumunda optimistic update'i geri al
          setNotes(prevNotes => prevNotes.filter(note => note.id !== newNote.id));
        } else {
          toast.success('Not başarıyla oluşturuldu');
        }
      });
    
    return newNote;
  };

  const updateNote = (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    if (!isAuthenticated) {
      toast.error('Not güncellemek için giriş yapmalısınız');
      return;
    }

    // Optimistic UI update
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...data, updatedAt: new Date() } 
          : note
      )
    );
    
    // Veritabanı güncellemesi
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating note:', error);
          toast.error('Not güncellenirken bir hata oluştu');
          // Hata durumunda güncellemeyi geri al ve verileri yeniden yükle
          fetchNotes();
        }
      });
  };

  const deleteNote = (id: string) => {
    if (!isAuthenticated) {
      toast.error('Not silmek için giriş yapmalısınız');
      return;
    }

    // Optimistic UI update
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
    
    // Veritabanından sil
    supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Error deleting note:', error);
          toast.error('Not silinirken bir hata oluştu');
          // Hata durumunda silmeyi geri al ve verileri yeniden yükle
          fetchNotes();
        } else {
          toast.success('Not başarıyla silindi');
        }
      });
  };

  const togglePinned = (id: string) => {
    if (!isAuthenticated) {
      toast.error('Notu sabitlemek için giriş yapmalısınız');
      return;
    }

    const note = notes.find(note => note.id === id);
    if (!note) return;
    
    const newPinnedState = !note.pinned;
    
    // Optimistic UI update
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, pinned: newPinnedState, updatedAt: new Date() } 
          : note
      )
    );
    
    // Veritabanı güncellemesi
    supabase
      .from('notes')
      .update({
        pinned: newPinnedState,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Error toggling note pin state:', error);
          toast.error('Not sabitlenirken bir hata oluştu');
          // Hata durumunda güncellemeyi geri al ve verileri yeniden yükle
          fetchNotes();
        }
      });
  };

  const createFolder = async (name: string, color?: string): Promise<Folder> => {
    if (!isAuthenticated) {
      toast.error('Klasör oluşturmak için giriş yapmalısınız');
      return {} as Folder;
    }

    const folderId = Date.now().toString();
    const newFolder: Folder = {
      id: folderId,
      name,
      color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`
    };
    
    try {
      const { error } = await supabase
        .from('folders')
        .insert({
          id: newFolder.id,
          name: newFolder.name,
          color: newFolder.color,
          user_id: user.id
        });
      
      if (error) throw error;
      
      setFolders(prevFolders => [...prevFolders, newFolder]);
      toast.success('Klasör başarıyla oluşturuldu');
      return newFolder;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Klasör oluşturulurken bir hata oluştu');
      throw error;
    }
  };

  // Kimlik doğrulama işlevleri
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Kayıt başarılı! Lütfen e-posta adresinizi kontrol edin.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Kayıt olurken bir hata oluştu');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Giriş yaparken bir hata oluştu');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Çıkış yaparken bir hata oluştu');
      throw error;
    }
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
    createFolder,
    isAuthenticated,
    user,
    signIn,
    signUp,
    signOut
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
