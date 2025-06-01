import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { openCheckout } from '@/lib/paddle';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Remove the hash if present in the URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session) {
          // Check if we need to create/update the user's profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error fetching profile:', profileError);
          }

          // If profile doesn't exist or needs updating
          if (!profile || !profile.full_name) {
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                full_name: session.user.user_metadata.full_name,
                avatar_url: session.user.user_metadata.avatar_url,
                email: session.user.email
              });

            if (upsertError) {
              console.error('Error upserting profile:', upsertError);
            }
          }

          // Add a small delay to ensure the session is properly set
          await new Promise(resolve => setTimeout(resolve, 500));

          toast.success('Successfully signed in!');

          // Check if there was a selected plan before login
          const selectedPlan = sessionStorage.getItem('selectedPlan');
          const returnTo = sessionStorage.getItem('returnTo');
          
          // Clear stored data
          sessionStorage.removeItem('selectedPlan');
          sessionStorage.removeItem('returnTo');

          if (selectedPlan) {
            // Navigate back to the original location or select-plan page
            const redirectTo = returnTo || '/select-plan';
            navigate(redirectTo, { replace: true });
            
            // Then try to open the checkout
            try {
              await openCheckout(selectedPlan);
            } catch (error) {
              console.error('Error opening checkout:', error);
              toast.error('Failed to open checkout. Please try selecting your plan again.');
            }
          } else {
            // No selected plan, go to dashboard
            navigate('/dashboard', { replace: true });
          }
        } else {
          // No session found
          setError('No session found. Please try signing in again.');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="bg-kulibre-purple rounded-lg w-12 h-12 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
        </div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
} 