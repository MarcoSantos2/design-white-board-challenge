import React, { useEffect, useState } from 'react';
import { Button, Icon, Input } from '../ui';
import { getGoogleProvider, signInWithProvider, signInWithEmail, syncUserWithBackend } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SignIn: React.FC = () => {
  const { loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleProvider = async () => {
    setError(null);
    try {
      const p = getGoogleProvider();
      await signInWithProvider(p);
      // Immediate backend sync
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await syncUserWithBackend(baseUrl);
      navigate('/');
    } catch (e) {
      setError('Sign in failed.');
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);

  const handleEmailSignIn = async () => {
    try {
      setError(null);
      setLoadingLocal(true);
      await signInWithEmail(email.trim(), password);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await syncUserWithBackend(baseUrl);
      navigate('/');
    } catch (e) {
      setError('Invalid email or password.');
    } finally {
      setLoadingLocal(false);
    }
  };

  // If already logged in, redirect to home
  const { user: authedUser } = useAuth();
  useEffect(() => {
    if (authedUser) navigate('/');
  }, [authedUser, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ margin: 0 }}>Sign in</h1>
        {error && (
          <div style={{ color: 'var(--danger, #b91c1c)', fontSize: 14 }}>{error}</div>
        )}
        <Button variant="primary" size="medium" onClick={handleProvider}>
          <Icon name="login" size="sm" style={{ marginRight: 8 }} /> Continue with Google
        </Button>

        <div style={{ height: 1, backgroundColor: 'var(--stroke-stroke)' }} />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <Button variant="secondary" size="medium" onClick={handleEmailSignIn} disabled={loadingLocal}>
          {loadingLocal ? 'Signing in…' : 'Sign in with Email'}
        </Button>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          By continuing you agree to our Terms and Privacy Policy.
        </div>
        {loading && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Checking session…</div>}
      </div>
    </div>
  );
};

export default SignIn;


