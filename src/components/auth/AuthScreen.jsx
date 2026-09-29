import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function AuthScreen() {
  const { setIsAuthenticated, setCurrentUser, users } = useSpend();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('sankar@acme.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Sankar Patel');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Log in
    const matchingUser = users.find((u) => u.email === email) || users[0];
    setCurrentUser(matchingUser);
    setIsAuthenticated(true);
  };

  const handleDemoLogin = (userIndex = 0) => {
    setCurrentUser(users[userIndex]);
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
      {/* Auth Card */}
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-[3px] bg-slate-950 text-white flex items-center justify-center font-bold text-xs">
              ▲
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">trail</span>
            <span className="text-[10px] font-mono uppercase tracking-widest bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-[2px]">
              Finance Ops
            </span>
          </div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            {isSignUp ? 'Create your finance workspace' : 'Sign in to Trail'}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            SaaS Spend &amp; Auto-Renewal Defense Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/90 rounded-[6px] shadow-sm p-6 space-y-4">
          {/* Quick Demo Access banner */}
          <div className="p-2.5 rounded-[4px] bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                Evaluation Mode
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">Active</span>
            </div>
            <button
              type="button"
              onClick={() => handleDemoLogin(0)}
              className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-[3px] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Instant Access as Sankar Patel (CFO/FinOps)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 absolute">
              or credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sankar Patel"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:bg-white focus:border-slate-400 font-sans"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="finance@company.com"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:bg-white focus:border-slate-400 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase text-slate-600">
                  Password
                </label>
                {!isSignUp && (
                  <span className="text-[10px] font-mono text-slate-400 hover:text-slate-600 cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:bg-white focus:border-slate-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-[3px] transition-colors shadow-2xs"
            >
              {isSignUp ? 'Create Finance Account' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Toggle between Sign in & Sign Up */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-600 hover:text-slate-900 font-mono"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : 'Need a team workspace? Create one'}
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-4 text-center text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>SOC-2 Type II Certified • 256-bit AES Encryption</span>
        </div>
      </div>
    </div>
  );
}
