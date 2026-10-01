// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Eye, EyeOff, Loader2, Shield, User, Lock, Database, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { mockAuth, readApiResponse } from '../utils/api.js';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const { login } = useAuth();

  // Check database status on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  // Clear error when switching views
  useEffect(() => {
    setError('');
  }, [isLoginView]);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await readApiResponse(response, 'Database health check');
      setDatabaseStatus(data.mongodb === 'connected' ? 'connected' : 'disconnected');
    } catch {
      setDatabaseStatus('disconnected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    const endpoint = isLoginView ? 'login' : 'register';

    try {
      // Try backend first (database storage)
      try {
        const res = await axios.post(
          `/api/auth/${endpoint}`,
          { username, password }
        );
        
        // Successfully stored/authenticated in database
        login(res.data.username, res.data.token);
        console.log(`✅ User ${isLoginView ? 'logged in' : 'registered'} in database:`, res.data.username);
        
      } catch (backendErr) {
        // Check if it's a backend authentication error
        if (backendErr.response && backendErr.response.data && backendErr.response.data.msg) {
          // Backend returned an error message (like "Invalid credentials" or "User already exists")
          setError(backendErr.response.data.msg);
          setIsSubmitting(false);
          return;
        }
        
        // Backend not available, use mock authentication
        console.log('⚠️ Database not available, using mock authentication');
        const mockRes = await mockAuth(username, password);
        login(mockRes.username, mockRes.token);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setUsername('');
    setPassword('');
    setError('');
  };

  const getDatabaseStatusText = () => {
    switch (databaseStatus) {
      case 'connected':
        return 'Database Connected - User data will be stored securely';
      case 'disconnected':
        return 'Database Disconnected - Using demo mode';
      default:
        return 'Checking database connection...';
    }
  };

  const getDatabaseStatusIcon = () => {
    switch (databaseStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'disconnected':
        return <Database className="h-5 w-5 text-yellow-400" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
    }
  };

  const getDatabaseStatusColor = () => {
    switch (databaseStatus) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'disconnected':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <main className="min-h-screen bg-[#11152c] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex xl:p-16">
          <div className="pointer-events-none absolute -right-28 top-24 h-96 w-96 rounded-full bg-indigo-600/30 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-[90px]" />
          <a href="/" className="relative flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950"><Tag size={20} /></span>
            <span className="text-xl font-extrabold tracking-tight">deal<span className="text-indigo-300">finder</span></span>
          </a>
          <div className="relative max-w-lg">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-cyan-200">A smarter way to shop tech</p>
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">The right tech.<br /><span className="text-indigo-300">The right price.</span></h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">Compare real electronics prices across trusted stores and find the offer that makes sense for you.</p>
            <div className="mt-10 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              {['Phones & laptops', 'Real retailer offers', 'No sample prices'].map(item => <span key={item} className="rounded-full border border-white/15 bg-white/[.06] px-3 py-2">{item}</span>)}
            </div>
          </div>
          <p className="relative text-xs text-slate-500">Compare first. Buy directly from your chosen retailer.</p>
        </section>

        <section className="flex items-center justify-center bg-[#f7f8fa] px-4 py-10 text-slate-900 sm:px-8">
          <div className="w-full max-w-md">
            <a href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><Tag size={19} /></span>
              <span className="text-xl font-extrabold tracking-tight text-slate-950">deal<span className="text-indigo-600">finder</span></span>
            </a>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Welcome to DealFinder</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{isLoginView ? 'Sign in' : 'Create your account'}</h2>
                <p className="mt-2 text-sm text-slate-500">{isLoginView ? 'Sign in to continue comparing electronics prices.' : 'Create an account to get started.'}</p>
              </div>

              <div className={`mb-6 flex items-start gap-3 rounded-xl border p-3.5 ${getDatabaseStatusColor()}`}>
                <span className="mt-0.5 shrink-0">{getDatabaseStatusIcon()}</span>
                <div>
                  <p className="text-sm font-bold">{databaseStatus === 'connected' ? 'Database connected' : databaseStatus === 'disconnected' ? 'Demo mode' : 'Checking connection'}</p>
                  <p className="mt-0.5 text-xs leading-5">{getDatabaseStatusText()}</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-slate-700">Username</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                    <input id="username" name="username" type="text" required autoComplete="username" className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" placeholder="Enter your username" value={username} onChange={(event) => setUsername(event.target.value)} disabled={isSubmitting} />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required autoComplete={isLoginView ? 'current-password' : 'new-password'} className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isSubmitting} />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">Use at least 6 characters.</p>
                </div>

                {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"><Shield size={17} className="mt-0.5 shrink-0" />{error}</div>}

                <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? (isLoginView ? 'Signing in...' : 'Creating account...') : (isLoginView ? 'Sign in' : 'Create account')}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <span className="text-sm text-slate-500">{isLoginView ? "Don't have an account?" : 'Already have an account?'}</span>
                <button type="button" onClick={toggleView} disabled={isSubmitting} className="ml-1.5 text-sm font-bold text-indigo-600 transition hover:text-indigo-800 disabled:opacity-50">
                  {isLoginView ? 'Create account' : 'Sign in'}
                </button>
              </div>
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><Shield size={15} className="mt-0.5 shrink-0 text-slate-400" />{databaseStatus === 'connected' ? 'Your account uses the configured database service.' : 'Demo mode: account data is not stored permanently.'}</p>
            </div>
            <p className="mt-5 text-center text-xs text-slate-400">Prices and product availability are confirmed by each retailer.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
