
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, MoreVertical } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote, folders } = useNotes();
  const { t } = useLanguage();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Find the note by ID
  const note = notes.find(n => n.id === id);
  
  // Load note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedFolder(note.folder);
    }
  }, [note]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!note) return;
    
    const autosaveTimeout = setTimeout(() => {
      if (title !== note.title || content !== note.content || selectedFolder !== note.folder) {
        handleSave();
      }
    }, 1000);
    
    return () => clearTimeout(autosaveTimeout);
  }, [title, content, selectedFolder]);
  
  const handleSave = () => {
    if (!note) return;
    
    setIsSaving(true);
    
    updateNote(note.id, {
      title,
      content,
      folder: selectedFolder
    });
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };
  
  const handleDelete = () => {
    if (!note) return;
    
    if (window.confirm(t('deleteConfirmation'))) {
      deleteNote(note.id);
      navigate('/');
    }
  };
  
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] animate-fade-in">
        <h2 className="text-xl font-medium mb-2">{t('noteNotFound')}</h2>
        <p className="text-muted-foreground mb-4">{t('noteNotFoundMessage')}</p>
        <Button onClick={() => navigate('/')}>{t('back')}</Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      <div className="glass border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('back')}</span>
          </Button>
          
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-1 border rounded-full text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isSaving ? t('saving') : t('saved')}
          </span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSave}
            className="text-muted-foreground hover:text-foreground"
          >
            <Save className="h-5 w-5" />
            <span className="sr-only">{t('save')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="text-destructive hover:text-destructive/80"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">{t('delete')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">{t('moreOptions')}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden px-4 py-6 md:px-8 md:py-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('untitledNote')}
          className="font-semibold text-2xl md:text-3xl w-full border-none outline-none bg-transparent mb-4 focus:outline-none"
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('startWriting')}
          className="flex-1 w-full border-none outline-none bg-transparent resize-none focus:outline-none text-base md:text-lg"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
