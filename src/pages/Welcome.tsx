
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Github, Mail, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSelector from '@/components/layout/LanguageSelector';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Set document title
  React.useEffect(() => {
    document.title = `${t('welcome')} | ${t('appName')}`;
  }, [t]);
  
  const handleGuestLogin = () => {
    // For guest login, we'll navigate directly to the main page
    navigate('/');
  };
  
  const handleSocialLogin = (provider: string) => {
    // This would be integrated with authentication service in a real app
    console.log(`Login with ${provider}`);
    // For now, simulate login and redirect
    setTimeout(() => navigate('/'), 1000);
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
          <span className="text-xl font-semibold">NotesPro</span>
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
                  Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('twitter')}
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin('github')}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              <p>
                {t('advancedLogin')} <a href="#" className="underline hover:text-primary">{t('clickHere')}</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2025 NotesPro. {t('allRightsReserved')}
      </footer>
    </div>
  );
};

export default Welcome;
