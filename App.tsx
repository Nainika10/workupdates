
import React, { useState, useEffect } from 'react';
import { AuthState, User } from './types';
import { mockApi } from './services/mockApi';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await mockApi.getCurrentUser();
        if (user) {
          setAuthState({ user, isAuthenticated: true, isLoading: false });
        } else {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };
    checkSession();
  }, []);

  const handleLogin = (user: User) => {
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const handleLogout = async () => {
    await mockApi.logout();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Initializing WorkSync...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      {!authState.isAuthenticated ? (
        <AuthForm onAuthSuccess={handleLogin} />
      ) : (
        <Dashboard user={authState.user!} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
