import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
// UI preview: uncomment when wiring real auth
// import { supabase } from '@/integrations/supabase/client';
// import { lovable } from '@/integrations/lovable/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FlowerAccent from '@/components/FlowerAccent';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Stub for UI preview (Supabase commented out)
      await new Promise(r => setTimeout(r, 500));
      toast({
        description: mode === 'signup' ? 'Welcome! Account created.' : 'Welcome back 💕',
      });

      /* Supabase auth — restore when ready:
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name },
          },
        });
        if (error) throw error;
        toast({ description: 'Welcome! Account created.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ description: 'Welcome back 💕' });
      }
      */
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast({ description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    toast({ description: 'Google sign-in disabled for UI preview.' });

    /* OAuth — restore with lovable import:
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast({ description: 'Could not sign in with Google.', variant: 'destructive' });
    }
    */
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      {/* Left Panel - Decorative (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-cream relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
        </div>
        
        <div className="relative z-10 text-center max-w-lg animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
              <FlowerAccent variant="corner" className="w-32 h-32 text-sage-green" />
            </div>
          </div>
          <h1 className="font-serif text-6xl font-semibold tracking-tight mb-6 text-foreground">
            Trinkets
          </h1>
          <p className="font-serif text-xl italic text-muted-foreground mb-8 leading-relaxed">
            "Collecting small moments and thoughtful gestures, <br />
            one <em>precious</em> gift at a time."
          </p>
          <div className="flex justify-center">
            <FlowerAccent variant="divider" className="w-64 text-soft-taupe opacity-60" />
          </div>
        </div>

        {/* Decorative floating elements */}
        <FlowerAccent variant="small" className="absolute top-[10%] left-[15%] w-12 h-12 opacity-20 animate-pulse" />
        <FlowerAccent variant="small" className="absolute bottom-[15%] right-[10%] w-16 h-16 opacity-20 animate-pulse delay-700" />
        <FlowerAccent variant="small" className="absolute top-[20%] right-[20%] w-8 h-8 opacity-10" />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background relative">
        {/* Mobile-only background accent */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-32 bg-cream -z-10" />
        
        <Card className="w-full max-w-md border-none shadow-xl lg:shadow-none bg-transparent lg:bg-transparent">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center lg:hidden mb-4">
              <FlowerAccent variant="small" className="w-12 h-12 text-dusty-rose" />
            </div>
            <CardTitle className="font-serif text-3xl font-semibold tracking-tight">
              {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {mode === 'signup' 
                ? 'Join our community of thoughtful gift-givers.' 
                : 'Sign in to continue your journey of giving.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name"
                    className="bg-muted/30 border-border/50 focus:border-sage-green focus:ring-sage-green/20"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="hello@example.com"
                  className="bg-muted/30 border-border/50 focus:border-sage-green focus:ring-sage-green/20"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Password</Label>
                  {mode === 'signin' && (
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-muted/30 border-border/50 focus:border-sage-green focus:ring-sage-green/20"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  minLength={6} 
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </span>
                ) : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-background px-4 text-muted-foreground font-medium">or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-border/60 hover:bg-muted/50 transition-colors gap-3" 
              onClick={handleGoogle}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <p className="text-center text-sm text-muted-foreground">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="text-foreground font-semibold hover:underline underline-offset-4 transition-all"
              >
                {mode === 'signup' ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </CardFooter>
        </Card>

        {/* Bottom decorative accent for desktop */}
        <div className="hidden lg:block absolute bottom-8 right-8">
          <FlowerAccent variant="small" className="w-16 h-16 text-sage-green/30" />
        </div>
      </div>
    </div>
  );
};

export default Auth;

