
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, FolderPlus, Search, Settings, Menu } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const { createNote, folders } = useNotes();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isHomePage = location.pathname === '/';
  
  const handleCreateNote = () => {
    const newNote = createNote('Untitled Note', folders[0]?.id || '');
    window.location.href = `/editor/${newNote.id}`;
  };

  return (
    <header className="sticky top-0 z-10 glass border-b transition-all duration-300 px-4 md:px-6">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          {toggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="hidden md:inline">NotesPro</span>
          </Link>
        </div>
        
        <div className={cn(
          "absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 transition-all duration-300",
          searchOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {isHomePage && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <FolderPlus className="h-5 w-5" />
                <span className="sr-only">New Folder</span>
              </Button>
              
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleCreateNote}
                icon={<Plus className="h-4 w-4" />}
                iconPosition="left"
                className="hidden md:flex"
              >
                New Note
              </Button>
              
              <Button 
                variant="primary" 
                size="icon" 
                onClick={handleCreateNote}
                className="md:hidden"
              >
                <Plus className="h-5 w-5" />
                <span className="sr-only">New Note</span>
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
