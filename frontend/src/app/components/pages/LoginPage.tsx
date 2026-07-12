import { useState } from 'react';
import { Eye, EyeOff, Zap, Package, Shield, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../AppContext';

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    if (!email) { setEmailErr('Email is required'); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailErr('Enter a valid email address'); valid = false; }
    else setEmailErr('');
    if (!password) { setPwErr('Password is required'); valid = false; }
    else if (password.length < 4) { setPwErr('Password must be at least 4 characters'); valid = false; }
    else setPwErr('');
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors below', { description: 'Check your credentials and try again.' });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email === 'wrong@test.com') {
      setEmailErr('No account found with this email');
      setPwErr('');
      toast.error('Authentication failed', { description: 'Invalid credentials. Please try again.' });
      setLoading(false);
      return;
    }
    toast.success('Welcome back!', { description: 'Redirecting to your dashboard...' });
    setTimeout(login, 400);
    setLoading(false);
  };

  const features = [
    { icon: Package, label: 'Full Asset Lifecycle', desc: 'Track from procurement to retirement' },
    { icon: Shield, label: 'Role-Based Access', desc: 'Secure, permission-based workflows' },
    { icon: BarChart3, label: 'Real-Time Reports', desc: 'Instant insights across all assets' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8f8fa' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] p-12"
        style={{ backgroundColor: '#714B67' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AssetFlow</span>
        </div>

        <div>
          <p className="text-white/60 text-sm mb-2" style={{ fontFamily: "'Caveat', cursive" }}>Enterprise Asset Management</p>
          <h1 className="text-white text-4xl leading-tight mb-6">
            Manage every asset,<br />everywhere.
          </h1>
          <div className="flex flex-col gap-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">© 2026 AssetFlow. All rights reserved.</p>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#714B67' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-semibold text-lg" style={{ color: '#714B67' }}>AssetFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back — enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (emailErr) setEmailErr(''); }}
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 rounded-lg border text-sm transition-all outline-none"
                style={{
                  borderColor: emailErr ? '#F2726F' : '#D1D5DB',
                  boxShadow: emailErr ? '0 0 0 3px rgba(242,114,111,0.1)' : 'none',
                }}
                onFocus={e => {
                  if (!emailErr) e.currentTarget.style.borderColor = '#714B67';
                  if (!emailErr) e.currentTarget.style.boxShadow = '0 0 0 3px rgba(113,75,103,0.1)';
                }}
                onBlur={e => {
                  if (!emailErr) e.currentTarget.style.borderColor = '#D1D5DB';
                  if (!emailErr) e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {emailErr && <p className="text-xs" style={{ color: '#F2726F' }}>{emailErr}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs hover:underline" style={{ color: '#714B67' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (pwErr) setPwErr(''); }}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm transition-all outline-none"
                  style={{
                    borderColor: pwErr ? '#F2726F' : '#D1D5DB',
                    boxShadow: pwErr ? '0 0 0 3px rgba(242,114,111,0.1)' : 'none',
                  }}
                  onFocus={e => {
                    if (!pwErr) e.currentTarget.style.borderColor = '#714B67';
                    if (!pwErr) e.currentTarget.style.boxShadow = '0 0 0 3px rgba(113,75,103,0.1)';
                  }}
                  onBlur={e => {
                    if (!pwErr) e.currentTarget.style.borderColor = '#D1D5DB';
                    if (!pwErr) e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwErr && <p className="text-xs" style={{ color: '#F2726F' }}>{pwErr}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                style={{ accentColor: '#714B67' }}
              />
              <span className="text-sm text-gray-600">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-70"
              style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.backgroundColor = '#5B3A53'); }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8">
            Hint: use any email/password (min 4 chars) to sign in
          </p>
        </div>
      </div>
    </div>
  );
}
