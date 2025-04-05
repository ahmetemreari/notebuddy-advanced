
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, ChevronDown, Settings, Plus, Search, Bookmark, BookOpen, LayoutGrid, LayoutList } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/layout/Header';
import NoteCard from '@/components/layout/NoteCard';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const { notes, folders } = useNotes();
  const { t } = useLanguage();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set document title
  React.useEffect(() => {
    document.title = `${t('appName')} - ${t('notes')}`;
  }, [t]);
  
  // Filter and sort notes
  const filteredNotes = selectedFolder
    ? notes.filter(note => note.folder === selectedFolder)
    : notes;
  
  // Filter by search query
  const searchFilteredNotes = searchQuery
    ? filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredNotes;
  
  const pinnedNotes = searchFilteredNotes.filter(note => note.pinned);
  const unpinnedNotes = searchFilteredNotes.filter(note => !note.pinned);
  
  // Sort notes by updated date (newest first)
  const sortedUnpinnedNotes = [...unpinnedNotes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateNote = () => {
    const newNote = createNote('Untitled Note', folders[0]?.id || '');
    window.location.href = `/editor/${newNote.id}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`w-64 border-r border-border/40 bg-white/80 backdrop-blur-sm transition-all duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 mt-16 z-10 md:relative md:translate-x-0`}
        >
          <div className="p-4 flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between mb-6">
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
            
            <Button
              variant="default"
              onClick={handleCreateNote}
              className="mb-6 w-full justify-start gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('newNote')}
            </Button>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('folders')}</h2>
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
            
            <div className="mb-6">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('tags')}</h2>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                  Work
                </div>
                <div className="rounded-full bg-green-500/10 text-green-500 px-3 py-1 text-xs">
                  Personal
                </div>
                <div className="rounded-full bg-blue-500/10 text-blue-500 px-3 py-1 text-xs">
                  Ideas
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('quickLinks')}</h2>
              <ul className="space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9 px-2"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t('recentlyViewed')}
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9 px-2"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    {t('favorites')}
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={`flex-1 overflow-auto p-4 md:p-6 ${sidebarOpen ? 'md:ml-0' : ''}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder={t('searchNotes')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-9 w-9"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-9 w-9"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {pinnedNotes.length > 0 && (
              <div className="mb-8 animate-fade-in">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">{t('pinned')}</h2>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "flex flex-col gap-3"
                }>
                  {pinnedNotes.map(note => (
                    <NoteCard key={note.id} note={note} listView={viewMode === 'list'} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                {selectedFolder 
                  ? folders.find(f => f.id === selectedFolder)?.name.toUpperCase() 
                  : t('allNotes')}
                {searchQuery && ` • "${searchQuery}"`}
              </h2>
              
              {sortedUnpinnedNotes.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "flex flex-col gap-3"
                }>
                  {sortedUnpinnedNotes.map((note, index) => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      listView={viewMode === 'list'} 
                      style={{ animationDelay: `${(index + 1) * 30}ms` }}
                    />
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
                  <Button onClick={handleCreateNote}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('newNote')}
                  </Button>
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
