import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { signUpWithEmail, getGoogleProvider, signInWithProvider, syncUserWithBackend } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignUp = async () => {
    try {
      setError(null);
      setLoading(true);
      await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await syncUserWithBackend(baseUrl);
      navigate('/');
    } catch (e) {
      setError('Sign up failed. Make sure your password meets requirements.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithProvider(getGoogleProvider());
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await syncUserWithBackend(baseUrl);
      navigate('/');
    } catch {
      setError('Google sign up failed.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ margin: 0 }}>Create your account</h1>
        {error && <div style={{ color: 'var(--danger, #b91c1c)', fontSize: 14 }}>{error}</div>}
        <Input placeholder="Full name" value={name} onChange={(e: any) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
        <Button variant="primary" size="medium" onClick={handleEmailSignUp} disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>
        <Button variant="secondary" size="medium" onClick={handleGoogle}>Continue with Google</Button>
      </div>
    </div>
  );
};

export default SignUp;


