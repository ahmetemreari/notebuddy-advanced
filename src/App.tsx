
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotesProvider, useNotes } from "./context/NotesContext";
import { LanguageProvider } from "./context/LanguageContext";
import Welcome from "./pages/Welcome";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

// Korumalı yönlendirme bileşeni
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useNotes();
  
  // Yükleme durumunda herhangi bir şey gösterme
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }
  
  // Kullanıcı giriş yapmamışsa welcome sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  
  return <>{children}</>;
};

// Admin yönlendirme bileşeni
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useNotes();
  
  // Yükleme durumunda herhangi bir şey gösterme
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }
  
  // Kullanıcı giriş yapmamışsa welcome sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  
  // Burada admin kontrolü yapılabilir, şimdilik basit bir şekilde uygulayalım
  // Gerçek admin kontrolü için Supabase'deki user_roles tablosunu kullanacağız
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    } />
    <Route path="/editor/:id" element={
      <ProtectedRoute>
        <Editor />
      </ProtectedRoute>
    } />
    <Route path="/admin" element={
      <AdminRoute>
        <Admin />
      </AdminRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <NotesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </NotesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
