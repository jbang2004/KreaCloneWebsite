import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<{
    user: User | null;
    session: Session | null;
    loading: boolean;
  }>({
    user: null,
    session: null,
    loading: true,
  });

  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting initial session:", sessionError);
      }
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting initial user:", userError);
      }

      setAuthState({ user, session, loading: false });
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      const user = session?.user ?? null;
      setAuthState({ user, session, loading: false });
    });

    return () => {
      if (authListener && typeof authListener.subscription?.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return { ...authState, signOut };
} 