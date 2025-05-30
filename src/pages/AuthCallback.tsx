import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Successful login, redirect to dashboard
        navigate('/dashboard');
      } else {
        // No session found, redirect to login
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <div className="bg-kulibre-purple rounded-lg w-12 h-12 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">K</span>
        </div>
      </div>
    </div>
  );
} 