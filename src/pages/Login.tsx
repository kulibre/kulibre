import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // Clear any existing hash from the URL
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      // Get the current domain and construct the redirect URL
      const redirectUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5173/auth/callback'
        : 'https://kulibre.com/auth/callback';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: redirectUrl,
          skipBrowserRedirect: false // Ensure browser handles the redirect
        }
      });

      if (error) throw error;

      // If we get here without a redirect, something went wrong
      if (!data.url) {
        throw new Error('No redirect URL received from Supabase');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to initialize login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kulibre-gray/50">
      <div className="w-full max-w-md p-8 md:p-10 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="bg-kulibre-purple rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <h1 className="text-2xl font-bold">kulibre</h1>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>
        
        <Button 
          type="button" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={handleGoogleLogin}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
