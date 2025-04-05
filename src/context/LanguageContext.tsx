
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/note';

interface TranslationDictionary {
  [key: string]: {
    [key: string]: string;
  };
}

// Available languages
const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// Translations
const translations: TranslationDictionary = {
  en: {
    appName: 'NoteMaster',
    notes: 'Notes',
    search: 'Search',
    createNote: 'Create Note',
    settings: 'Settings',
    admin: 'Admin Panel',
    allNotes: 'ALL NOTES',
    pinned: 'PINNED',
    folders: 'FOLDERS',
    noNotes: 'No notes found',
    createNotePrompt: "You don't have any notes yet. Create your first note!",
    noNotesInFolder: 'There are no notes in this folder yet.',
    noteEditor: 'Note Editor',
    save: 'Save',
    delete: 'Delete',
    back: 'Back',
    untitledNote: 'Untitled Note',
    startWriting: 'Start writing...',
    language: 'Language',
    theme: 'Theme',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
  },
  tr: {
    appName: 'NotMaster',
    notes: 'Notlar',
    search: 'Ara',
    createNote: 'Not Oluştur',
    settings: 'Ayarlar',
    admin: 'Yönetici Paneli',
    allNotes: 'TÜM NOTLAR',
    pinned: 'SABİTLENMİŞ',
    folders: 'KLASÖRLER',
    noNotes: 'Not bulunamadı',
    createNotePrompt: 'Henüz hiç notunuz yok. İlk notunuzu oluşturun!',
    noNotesInFolder: 'Bu klasörde henüz not bulunmuyor.',
    noteEditor: 'Not Düzenleyici',
    save: 'Kaydet',
    delete: 'Sil',
    back: 'Geri',
    untitledNote: 'Başlıksız Not',
    startWriting: 'Yazmaya başlayın...',
    language: 'Dil',
    theme: 'Tema',
    logout: 'Çıkış Yap',
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
  },
  es: {
    appName: 'NoteMaster',
    notes: 'Notas',
    search: 'Buscar',
    createNote: 'Crear Nota',
    settings: 'Configuración',
    admin: 'Panel de Administrador',
    allNotes: 'TODAS LAS NOTAS',
    pinned: 'FIJADAS',
    folders: 'CARPETAS',
    noNotes: 'No se encontraron notas',
    createNotePrompt: '¡Aún no tienes notas. Crea tu primera nota!',
    noNotesInFolder: 'Aún no hay notas en esta carpeta.',
    noteEditor: 'Editor de notas',
    save: 'Guardar',
    delete: 'Eliminar',
    back: 'Volver',
    untitledNote: 'Nota sin título',
    startWriting: 'Empieza a escribir...',
    language: 'Idioma',
    theme: 'Tema',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    register: 'Registrarse',
  },
  fr: {
    appName: 'NoteMaster',
    notes: 'Notes',
    search: 'Rechercher',
    createNote: 'Créer une note',
    settings: 'Paramètres',
    admin: 'Panneau d\'administration',
    allNotes: 'TOUTES LES NOTES',
    pinned: 'ÉPINGLÉES',
    folders: 'DOSSIERS',
    noNotes: 'Aucune note trouvée',
    createNotePrompt: 'Vous n\'avez pas encore de notes. Créez votre première note!',
    noNotesInFolder: 'Il n\'y a pas encore de notes dans ce dossier.',
    noteEditor: 'Éditeur de notes',
    save: 'Enregistrer',
    delete: 'Supprimer',
    back: 'Retour',
    untitledNote: 'Note sans titre',
    startWriting: 'Commencez à écrire...',
    language: 'Langue',
    theme: 'Thème',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'S\'inscrire',
  },
  de: {
    appName: 'NoteMaster',
    notes: 'Notizen',
    search: 'Suchen',
    createNote: 'Notiz erstellen',
    settings: 'Einstellungen',
    admin: 'Administrationsbereich',
    allNotes: 'ALLE NOTIZEN',
    pinned: 'ANGEHEFTET',
    folders: 'ORDNER',
    noNotes: 'Keine Notizen gefunden',
    createNotePrompt: 'Sie haben noch keine Notizen. Erstellen Sie Ihre erste Notiz!',
    noNotesInFolder: 'Es befinden sich noch keine Notizen in diesem Ordner.',
    noteEditor: 'Notizen-Editor',
    save: 'Speichern',
    delete: 'Löschen',
    back: 'Zurück',
    untitledNote: 'Unbenannte Notiz',
    startWriting: 'Beginnen Sie zu schreiben...',
    language: 'Sprache',
    theme: 'Thema',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  languages: Language[];
  setLanguage: (languageCode: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    } else {
      // Set browser language if available
      const browserLang = navigator.language.split('-')[0];
      const language = languages.find(lang => lang.code === browserLang);
      if (language) {
        setCurrentLanguage(language);
        localStorage.setItem('language', language.code);
      }
    }
  }, []);

  const setLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('language', languageCode);
    }
  };

  const t = (key: string): string => {
    if (translations[currentLanguage.code] && translations[currentLanguage.code][key]) {
      return translations[currentLanguage.code][key];
    }
    // Fallback to English if translation is missing
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
