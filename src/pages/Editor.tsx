
import React from 'react';
import NoteEditor from '@/components/notes/NoteEditor';
import { useLanguage } from '@/context/LanguageContext';

const Editor: React.FC = () => {
  const { t } = useLanguage();
  
  // Set document title
  React.useEffect(() => {
    document.title = `${t('noteEditor')} | ${t('appName')}`;
  }, [t]);
  
  return <NoteEditor />;
};

export default Editor;
