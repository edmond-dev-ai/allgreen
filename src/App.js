import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PairPage from './pages/PairPage';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [activePair, setActivePair] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Firebase persists login automatically across refreshes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
      if (firebaseUser) {
        setPage('dashboard');
      }
    });
    return () => unsub();
  }, []);

  if (!authReady) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: '13px' }}>
          loading...
        </div>
      </div>
    );
  }

  const nav = (target, pair = null) => {
    setActivePair(pair);
    setPage(target);
  };

  if (page === 'landing') return <LandingPage onLogin={() => nav('login')} onSignup={() => nav('signup')} />;
  if (page === 'login') return <LoginPage onSuccess={() => nav('dashboard')} onBack={() => nav('landing')} onSignup={() => nav('signup')} />;
  if (page === 'signup') return <SignupPage onSuccess={() => nav('dashboard')} onBack={() => nav('landing')} onLogin={() => nav('login')} />;
  if (page === 'dashboard') return <DashboardPage user={user} onSelectPair={(p) => nav('pair', p)} onLogout={() => nav('landing')} />;
  if (page === 'pair') return <PairPage pair={activePair} user={user} onBack={() => nav('dashboard')} />;

  return null;
}
