
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-creatively-gray/50">
      <div className="w-full max-w-md p-8 md:p-10 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="bg-creatively-purple rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold">Creatively</h1>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link to="#" className="text-xs text-creatively-purple hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-creatively-purple hover:text-creatively-purple/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
