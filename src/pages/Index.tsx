
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, ChevronDown, Settings } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/layout/Header';
import NoteCard from '@/components/layout/NoteCard';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { notes, folders } = useNotes();
  const { t } = useLanguage();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Set document title
  React.useEffect(() => {
    document.title = `${t('appName')} - ${t('notes')}`;
  }, [t]);
  
  // Filter and sort notes
  const filteredNotes = selectedFolder
    ? notes.filter(note => note.folder === selectedFolder)
    : notes;
  
  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);
  
  // Sort notes by updated date (newest first)
  const sortedUnpinnedNotes = [...unpinnedNotes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`w-64 border-r bg-white transition-all duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 mt-16 z-10 md:relative md:translate-x-0`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <LanguageSelector />
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 rounded-full"
                asChild
              >
                <Link to="/admin">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">{t('folders')}</h2>
                <button className="text-muted-foreground p-1 rounded-full hover:bg-accent">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              
              <ul className="space-y-1">
                <li>
                  <Button
                    variant={selectedFolder === null ? "secondary" : "ghost"}
                    onClick={() => setSelectedFolder(null)}
                    className="w-full justify-start text-sm h-9 px-2"
                    icon="folder"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {t('allNotes')}
                  </Button>
                </li>
                
                {folders.map(folder => (
                  <li key={folder.id}>
                    <Button
                      variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                      onClick={() => setSelectedFolder(folder.id)}
                      className="w-full justify-start text-sm h-9 px-2"
                    >
                      <div className="h-4 w-4 rounded flex items-center justify-center mr-2">
                        <div 
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: folder.color }}
                        />
                      </div>
                      {folder.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={`flex-1 overflow-auto p-4 md:p-6 ${sidebarOpen ? 'md:ml-0' : ''}`}>
          <div className="max-w-5xl mx-auto animate-fade-in">
            {pinnedNotes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-muted-foreground mb-4">{t('pinned')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinnedNotes.map(note => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4">
                {selectedFolder 
                  ? folders.find(f => f.id === selectedFolder)?.name.toUpperCase() 
                  : t('allNotes')}
              </h2>
              
              {sortedUnpinnedNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedUnpinnedNotes.map(note => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-secondary p-4 mb-4">
                    <FolderOpen className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t('noNotes')}</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {selectedFolder 
                      ? t('noNotesInFolder')
                      : t('createNotePrompt')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
