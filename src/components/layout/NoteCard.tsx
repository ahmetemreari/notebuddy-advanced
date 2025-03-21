
import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Pin, MoreVertical } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { Note } from '@/types/note';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { folders, togglePinned } = useNotes();
  
  const folder = folders.find(f => f.id === note.folder);
  
  // Format the date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const noteDate = new Date(date);
    
    const isToday = 
      noteDate.getDate() === now.getDate() &&
      noteDate.getMonth() === now.getMonth() &&
      noteDate.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(noteDate);
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(noteDate);
  };
  
  // Extract a preview from the content
  const contentPreview = note.content
    .replace(/<[^>]*>/g, '')
    .slice(0, 120)
    .trim();
  
  return (
    <div 
      className="paper p-4 group hover-lift max-w-full animate-scale-in"
      style={{ animationDelay: '50ms' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          {folder && (
            <div 
              className="h-2 w-2 rounded-full mt-2"
              style={{ backgroundColor: folder.color }}
            />
          )}
          <div className="flex-1 min-w-0">
            <Link to={`/editor/${note.id}`} className="block">
              <h3 className="font-medium text-base leading-tight truncate mb-1">
                {note.title || "Untitled Note"}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {contentPreview || "No content"}
              </p>
            </Link>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            togglePinned(note.id);
          }}
          className={cn(
            "text-muted-foreground p-1 rounded-full transition-opacity",
            note.pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Pin className="h-4 w-4" fill={note.pinned ? "currentColor" : "none"} />
          <span className="sr-only">{note.pinned ? "Unpin" : "Pin"} note</span>
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-muted-foreground">
          {formatDate(note.updatedAt)}
        </div>
        
        <div className="flex items-center gap-2">
          {folder && (
            <div className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {folder.name}
            </div>
          )}
          
          <button className="text-muted-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
