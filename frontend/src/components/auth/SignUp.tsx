import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { signUpWithEmail, getGoogleProvider, signInWithProvider, syncUserWithBackend } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Logo size={101} />
        </div>
        <h1 style={{ margin: 0 }}>Sign up</h1>
        {error && <div style={{ color: 'var(--danger, #b91c1c)', fontSize: 14 }}>{error}</div>}

        <Input
          placeholder="Full Name*"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          variant="outlined"
          size="large"
        />
        <Input
          placeholder="Company Name"
          value={company}
          onChange={(e: any) => setCompany(e.target.value)}
          variant="outlined"
          size="large"
        />
        <Input
          placeholder="Email*"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          variant="outlined"
          size="large"
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
        <Input
          placeholder="Confirm Password*"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          variant="outlined"
          size="large"
          endIcon={showConfirm ? 'eye-off' : 'eye'}
          onEndIconClick={() => setShowConfirm(v => !v)}
          endIconAriaLabel={showConfirm ? 'Hide password' : 'Show password'}
          helperText={confirmPassword && confirmPassword !== password ? 'Passwords do not match' : 'Password should be same as the password above'}
          state={confirmPassword && confirmPassword !== password ? 'error' : 'default'}
        />

        <Button variant="primary" size="medium" onClick={handleEmailSignUp} disabled={loading || (confirmPassword !== '' && confirmPassword !== password)}>
          {loading ? 'CREATING…' : 'SIGN UP'}
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--stroke-stroke)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary-alt)' }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--stroke-stroke)' }} />
        </div>

        <Button variant="secondary" size="medium" onClick={handleGoogle}>CONTINUE WITH GOOGLE</Button>
      </div>
    </div>
  );
};

export default SignUp;


