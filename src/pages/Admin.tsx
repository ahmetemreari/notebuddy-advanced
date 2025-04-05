
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '@/context/NotesContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Users, 
  FolderOpen, 
  FileText, 
  Settings, 
  BarChart2, 
  Trash2 
} from 'lucide-react';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { notes, folders, deleteNote } = useNotes();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Mock users data - in a real app, this would come from your backend
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date() },
    { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user', createdAt: new Date() },
    { id: '3', name: 'Test User', email: 'test@example.com', role: 'user', createdAt: new Date() },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Total Users</h3>
            <Users className="text-primary h-8 w-8" />
          </div>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Total Notes</h3>
            <FileText className="text-primary h-8 w-8" />
          </div>
          <p className="text-3xl font-bold mt-2">{notes.length}</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Total Folders</h3>
            <FolderOpen className="text-primary h-8 w-8" />
          </div>
          <p className="text-3xl font-bold mt-2">{folders.length}</p>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {notes.slice(0, 5).map(note => (
            <div key={note.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{note.title}</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(note.updatedAt).toLocaleString()}
                </p>
              </div>
              <Button variant="ghost" onClick={() => navigate(`/editor/${note.id}`)}>
                View
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="bg-card rounded-lg shadow">
        <div className="grid grid-cols-4 font-medium p-4 border-b">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        {users.map(user => (
          <div key={user.id} className="grid grid-cols-4 p-4 border-b hover:bg-accent/10">
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div className="capitalize">{user.role}</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Notes</h2>
      <div className="bg-card rounded-lg shadow">
        <div className="grid grid-cols-4 font-medium p-4 border-b">
          <div>Title</div>
          <div>Folder</div>
          <div>Last Updated</div>
          <div>Actions</div>
        </div>
        {notes.map(note => {
          const folderName = folders.find(f => f.id === note.folder)?.name || 'Unknown';
          return (
            <div key={note.id} className="grid grid-cols-4 p-4 border-b hover:bg-accent/10">
              <div className="truncate">{note.title}</div>
              <div>{folderName}</div>
              <div>{new Date(note.updatedAt).toLocaleString()}</div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/editor/${note.id}`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this note?')) {
                      deleteNote(note.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFolders = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Folders</h2>
      <div className="bg-card rounded-lg shadow">
        <div className="grid grid-cols-3 font-medium p-4 border-b">
          <div>Name</div>
          <div>Notes Count</div>
          <div>Actions</div>
        </div>
        {folders.map(folder => {
          const folderNotes = notes.filter(note => note.folder === folder.id);
          return (
            <div key={folder.id} className="grid grid-cols-3 p-4 border-b hover:bg-accent/10">
              <div className="flex items-center">
                <div 
                  className="h-4 w-4 rounded-sm mr-2"
                  style={{ backgroundColor: folder.color }}
                />
                {folder.name}
              </div>
              <div>{folderNotes.length}</div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-xl font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">App Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                defaultValue="NoteMaster"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enable Public Registration</label>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Allow new users to register</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="text-xl font-medium mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                defaultValue="60"
              />
            </div>
            <div>
              <Button>Reset All User Passwords</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-xl font-bold">{t('admin')}</h1>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r">
          <div className="p-4 space-y-1">
            <Button 
              variant={activeTab === 'dashboard' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'users' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-2" />
              Users
            </Button>
            <Button 
              variant={activeTab === 'notes' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab('notes')}
            >
              <FileText className="h-5 w-5 mr-2" />
              Notes
            </Button>
            <Button 
              variant={activeTab === 'folders' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab('folders')}
            >
              <FolderOpen className="h-5 w-5 mr-2" />
              Folders
            </Button>
            <Button 
              variant={activeTab === 'settings' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'notes' && renderNotes()}
          {activeTab === 'folders' && renderFolders()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
