import { X, Loader, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!supabase) {
      setError('Database connection error');
      setIsLoading(false);
      return;
    }

    const { data: user, error: loginError } = await supabase
      .from('users')
      .select('user_id, client_id, user_fullname, user_email, role')
      .eq('user_fullname', formData.username)
      .eq('user_password', formData.password)
      .single();

    console.log('Login attempt:', { username: formData.username, password: formData.password });
    console.log('Query result:', { user, loginError });

    if (loginError || !user) {
      setError('Invalid username or password');
      setIsLoading(false);
      return;
    }

    const { data: client } = await supabase
      .from('clients')
      .select('company_name, mobile_number, office_address, company_logo, billing_headline, gst_number')
      .eq('client_id', user.client_id)
      .single();

    const userData = {
      user_id: user.user_id,
      client_id: user.client_id,
      user_fullname: user.user_fullname,
      user_email: user.user_email,
      role: user.role,
      company_name: client?.company_name || '',
      company_mobile: client?.mobile_number || '',
      company_address: client?.office_address || '',
      company_logo: client?.company_logo || '',
      company_headline: client?.billing_headline || '',
      company_gst: client?.gst_number || ''
    };

    localStorage.setItem('arento_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
    onClose();
    setFormData({ username: '', password: '' });

    if (onLoginSuccess) {
      onLoginSuccess();
    }

    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality coming soon!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-[#072741]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#BCC4C9] hover:text-[#072741] transition-colors"
        >
          <X size={24} />
        </button>

        <h2
          className="text-3xl font-bold text-[#072741] mb-2"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Welcome Back
        </h2>
        <p
          className="text-[#BCC4C9] mb-6"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Sign in to your account to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-[#072741] mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#BCC4C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#072741] mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 pr-10 border border-[#BCC4C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BCC4C9] hover:text-[#072741] transition-colors"
                aria-label={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#348ADC] hover:text-[#2a6fb0] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#348ADC] hover:bg-[#2a6fb0] disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader size={20} className="animate-spin" />}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

