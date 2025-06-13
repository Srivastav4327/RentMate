import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signupWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };
  
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = validatePassword(password);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }
    
    if (!isPasswordValid) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signupWithEmail(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 flex flex-col justify-center">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-slate-600">Join RentMate to start renting and sharing items</p>
          </div>

          <div className="card p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
                <div className="mt-1 text-sm flex items-center">
                  <span className={isPasswordValid ? 'text-success-500' : 'text-slate-500'}>
                    {isPasswordValid ? <Check size={16} className="inline mr-1" /> : ''}
                    At least 6 characters
                  </span>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input ${
                    confirmPassword && !passwordsMatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="••••••••"
                  required
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-500">Passwords don't match</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full btn btn-primary py-3"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Create Account'}
              </button>
            </form>
            
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-sm text-slate-500">or</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full btn bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-3"
              disabled={isLoading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
            
            <div className="mt-6 text-center text-slate-600">
              <span>Already have an account? </span>
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;