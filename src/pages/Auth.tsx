
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import MarketingLayout from '@/components/MarketingLayout';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { signIn, signUp, resetPassword, user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          throw error;
        }
        
        toast.success('Account created successfully! Please log in.');
        setMode('login');
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          throw error;
        }
        
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else if (mode === 'forgot-password') {
        const { error } = await resetPassword(email);
        if (error) {
          throw error;
        }
        
        toast.success('Password reset email sent. Please check your inbox.');
        setMode('login');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrorMsg(error.message || 'An error occurred during authentication');
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome back' : 
               mode === 'signup' ? 'Create an account' : 
               'Reset your password'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' ? 'Enter your credentials to access your account' : 
               mode === 'signup' ? 'Enter your information to create your account' : 
               'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {errorMsg}
                </div>
              )}
              
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              {mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === 'login' && (
                      <Button 
                        type="button" 
                        variant="link" 
                        size="sm" 
                        className="px-0"
                        onClick={() => setMode('forgot-password')}
                      >
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              )}
              
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'login' ? 'Logging in...' : 
                     mode === 'signup' ? 'Creating account...' : 
                     'Sending reset link...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Log In' : 
                     mode === 'signup' ? 'Sign Up' : 
                     'Send Reset Link'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <div>
                Don't have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => setMode('signup')}>
                  Sign up
                </Button>
              </div>
            ) : mode === 'signup' ? (
              <div>
                Already have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => setMode('login')}>
                  Log in
                </Button>
              </div>
            ) : (
              <div>
                Remember your password?{' '}
                <Button variant="link" className="p-0" onClick={() => setMode('login')}>
                  Log in
                </Button>
              </div>
            )}
            
            <div>
              By continuing, you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default Auth;
