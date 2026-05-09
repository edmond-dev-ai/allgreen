import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { A } from '../authStyles';

export default function SignupPage({ onSuccess, onBack, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    if (!email || !password || !confirm) return setError('Please fill in all fields.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true); setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (e) {
      setError(friendlyError(e.code));
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (e) {
      setError(friendlyError(e.code));
    } finally { setLoading(false); }
  };

  const onKey = (e) => { if (e.key === 'Enter') handleEmail(); };

  return (
    <div style={A.page}>
      <div style={A.card} className="fade-up">
        <button style={A.backBtn} onClick={onBack}>← Back</button>
        <div style={A.logo}>AllGreen</div>
        <div style={A.title}>Create account</div>
        <div style={A.sub}>Free forever. No credit card needed.</div>

        {error && <div style={A.error}>{error}</div>}

        <div style={A.field}>
          <label style={A.label}>Email</label>
          <input style={A.input} type="email" placeholder="you@email.com"
            value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey}
            onFocus={e => e.target.style.borderColor = 'var(--green-dark)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>
        <div style={A.field}>
          <label style={A.label}>Password</label>
          <input style={A.input} type="password" placeholder="Min 6 characters"
            value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey}
            onFocus={e => e.target.style.borderColor = 'var(--green-dark)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>
        <div style={A.field}>
          <label style={A.label}>Confirm password</label>
          <input style={A.input} type="password" placeholder="Repeat password"
            value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={onKey}
            onFocus={e => e.target.style.borderColor = 'var(--green-dark)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>

        <button style={{ ...A.btnPrimary, opacity: loading ? 0.6 : 1 }}
          onClick={handleEmail} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div style={A.divider}>
          <div style={A.dividerLine} />
          <div style={A.dividerText}>or</div>
          <div style={A.dividerLine} />
        </div>

        <button style={A.googleBtn} onClick={handleGoogle} disabled={loading}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div style={A.switchRow}>
          Already have an account?{' '}
          <button style={A.switchLink} onClick={onLogin}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/weak-password': return 'Password is too weak.';
    default: return 'Something went wrong. Please try again.';
  }
}
