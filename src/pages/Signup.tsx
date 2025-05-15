
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      toast.success('Account created! Redirecting to plan selection...');
      navigate('/select-plan');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
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
            Create your account
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start managing your creative projects today
          </p>
        </div>
        
        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>
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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 8 characters
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-creatively-purple hover:text-creatively-purple/80">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-creatively-purple hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-creatively-purple hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
