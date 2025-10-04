import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { subscribeAuth, getIdToken, signOutUser, syncUserWithBackend } from '../services/auth';

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  idToken: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({ user: null, idToken: null, loading: true, signOut: async () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthState['user']>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth(async (fbUser) => {
      if (fbUser) {
        setUser({ uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName, photoURL: fbUser.photoURL });
        setIdToken(await getIdToken());
        // Fire-and-forget sync to backend
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        syncUserWithBackend(baseUrl);
      } else {
        setUser(null);
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    idToken,
    loading,
    signOut: async () => {
      await signOutUser();
      setUser(null);
      setIdToken(null);
    },
  }), [user, idToken, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}


