import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { OmSymbol } from '../components/decorative/OmSymbol';
import { LotusIcon } from '../components/decorative/LotusIcon';
import { authUtils } from '../utils/auth';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await authUtils.login(email, password);
      if (result.success) {
        toast.success('Welcome back to AstroAnu!');
        navigate('/consultation');
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch {
      toast.error('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-4 relative overflow-hidden">
      <LotusIcon className="absolute top-20 right-10 opacity-30" />
      <LotusIcon className="absolute bottom-20 left-10 opacity-30" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <OmSymbol size={80} className="mx-auto mb-4" />
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#6E1F2A] mb-2">Welcome Back</h1>
          <p className="text-[#7A5B46]">Continue your spiritual journey</p>
        </div>
        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" error={errors.email} />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" error={errors.password} />
            <Button type="submit" variant="primary" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#7A5B46]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#6E1F2A] hover:text-[#C89B3C] transition-colors">Create one</Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
