import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ParkingSquare, User, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      toast.error('Please enter username and password');
      return;
    }

    setIsLoading(true);
    try {
      const authData = await authService.login(usernameOrEmail.trim(), password.trim());
      setUser(authData);
      
      const roleName = authData.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Staff Member';
      toast.success(`Signed in as ${roleName} (${authData.fullName})`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto mb-3 text-white shadow-md cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ParkingSquare className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Sign In to SmartParking</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-Tenant Parking Management Console</p>
        </div>

        {/* Clean Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter username or email address"
                autoComplete="off"
                className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                required
              />
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              Sign In ➔
            </Button>
          </div>
        </form>

        {/* User-Friendly Notice */}
        <div className="p-3 bg-slate-950 rounded border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>Access level is automatically recognized upon sign in.</span>
        </div>

        {/* Navigate to Sign Up Link */}
        <div className="border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
              Create an Account / Sign Up ➔
            </Link>
          </p>
        </div>
      </div>

      {/* Back to Public Homepage */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-300 font-mono transition-colors"
      >
        ← Back to Homepage
      </button>
    </div>
  );
};
