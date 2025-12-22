
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { Auth } from './components/Auth';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LandingPage } from './components/LandingPage';
import { Loader2 } from 'lucide-react';
import { getSession, setSession, clearSession } from './services/storage';

type ViewState = 'landing' | 'login' | 'register' | 'dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  useEffect(() => {
    const checkSession = async () => {
      const user = await getSession();
      setCurrentUser(user);
      setIsLoading(false);
      // If user is already logged in, show dashboard
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    await setSession(user);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    await clearSession();
    setCurrentView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <h2 className="text-slate-400 font-medium animate-pulse">Loading Library System...</h2>
      </div>
    );
  }

  // View: Landing Page
  if (currentView === 'landing' && !currentUser) {
    return (
      <LandingPage 
        onLogin={() => setCurrentView('login')} 
        onRegister={() => setCurrentView('register')} 
      />
    );
  }

  // View: Login or Register
  if ((currentView === 'login' || currentView === 'register') && !currentUser) {
    return (
      <Auth 
        mode={currentView}
        onLogin={handleLogin} 
        onSwitchMode={() => setCurrentView(currentView === 'login' ? 'register' : 'login')}
        onBack={() => setCurrentView('landing')}
      />
    );
  }

  // View: Dashboard (Default for logged in users)
  return currentUser && currentUser.role === UserRole.ADMIN ? (
    <AdminDashboard user={currentUser} onLogout={handleLogout} />
  ) : (
    currentUser ? <StudentDashboard user={currentUser} onLogout={handleLogout} /> : null
  );
};

export default App;
