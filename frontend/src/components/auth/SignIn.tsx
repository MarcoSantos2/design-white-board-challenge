import React, { useEffect, useState } from 'react';
import { Button, Icon, Input } from '../ui';
import { getGoogleProvider, signInWithProvider, signInWithEmail, syncUserWithBackend } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';

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
  const [showPassword, setShowPassword] = useState(false);
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Logo size={101} />
        </div>
        <h1 style={{ margin: 0 }}>Log in</h1>
        {error && (
          <div style={{ color: 'var(--danger, #b91c1c)', fontSize: 14 }}>{error}</div>
        )}

        <Button variant="secondary" size="medium" onClick={handleProvider}>
          <Icon name="login" size="sm" style={{ marginRight: 8 }} /> CONTINUE WITH GOOGLE
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--stroke-stroke)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary-alt)' }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--stroke-stroke)' }} />
        </div>

        <Input
          placeholder="Email*"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          variant="outlined"
          size="large"
          helperText=""
        />
        <Input
          placeholder="Password*"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          variant="outlined"
          size="large"
          endIcon={showPassword ? 'eye-off' : 'eye'}
          onEndIconClick={() => setShowPassword(v => !v)}
          endIconAriaLabel={showPassword ? 'Hide password' : 'Show password'}
          helperText="Password should be at least 6 characters"
        />
        <Button variant="primary" size="medium" onClick={handleEmailSignIn} disabled={loadingLocal}>
          {loadingLocal ? 'LOGGING IN…' : 'LOG IN'}
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


