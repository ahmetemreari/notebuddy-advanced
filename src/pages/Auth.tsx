
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotes } from '@/context/NotesContext';
import { useLanguage } from '@/context/LanguageContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { toast } from 'sonner';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

const Auth: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated } = useNotes();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Eğer kullanıcı zaten giriş yapmışsa, ana sayfaya yönlendir
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: z.infer<typeof authSchema>) => {
    try {
      setIsLoading(true);
      if (isLogin) {
        await signIn(data.email, data.password);
        navigate('/');
      } else {
        await signUp(data.email, data.password);
        toast.success('Kayıt başarılı! E-posta doğrulaması için e-postanızı kontrol edin.', {
          duration: 6000,
        });
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    form.reset();
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
              <CardTitle className="text-2xl font-bold">
                {isLogin ? t('login') : t('register')}
              </CardTitle>
              <CardDescription>
                {isLogin ? t('loginDescription') : t('registerDescription')}
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ornek@mail.com" 
                            {...field} 
                            autoComplete={isLogin ? "email" : "new-email"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şifre</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={isLogin ? "••••••" : "En az 6 karakter"}
                            {...field} 
                            autoComplete={isLogin ? "current-password" : "new-password"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 
                      (isLogin ? "Giriş yapılıyor..." : "Kaydolunuyor...") : 
                      (isLogin ? "Giriş Yap" : "Kaydol")}
                  </Button>
                  
                  <p className="text-sm text-center text-muted-foreground">
                    {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}
                    <Button 
                      variant="link" 
                      className="p-0 pl-1 h-auto font-normal" 
                      onClick={toggleAuthMode}
                      disabled={isLoading}
                    >
                      {isLogin ? "Kaydolun" : "Giriş yapın"}
                    </Button>
                  </p>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2025 {t('appName')}. {t('allRightsReserved')}
      </footer>
    </div>
  );
};

export default Auth;
