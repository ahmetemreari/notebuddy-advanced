import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Github, Mail, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { useNotes } from '@/context/NotesContext';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useNotes();
  
  // Set document title
  React.useEffect(() => {
    document.title = `${t('welcome')} | ${t('appName')}`;
  }, [t]);
  
  React.useEffect(() => {
    // Eğer kullanıcı zaten giriş yapmışsa, ana sayfaya yönlendir
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleGuestLogin = () => {
    navigate('/auth');
  };
  
  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 to-secondary/10">
      <header className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
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
          <span className="text-xl font-semibold">{t('appName')}</span>
        </div>
        <LanguageSelector />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t('welcome')}</CardTitle>
              <CardDescription>
                {t('welcomeDescription')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-dashed border-2"
                onClick={handleGuestLogin}
              >
                {t('continueAsGuest')}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('orContinueWith')}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('google')}
                >
                  <Mail className="h-4 w-4" />
                  {t('google')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <Facebook className="h-4 w-4" />
                  {t('facebook')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('twitter')}
                >
                  <Twitter className="h-4 w-4" />
                  {t('twitter')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('github')}
                >
                  <Github className="h-4 w-4" />
                  {t('github')}
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              <p>
                {t('advancedLogin')} <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth')}>{t('clickHere')}</Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2025 {t('appName')}. {t('allRightsReserved')}
      </footer>
    </div>
  );
};

export default Welcome;
