import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { authUtils } from '../utils/auth';
import { OmSymbol } from './decorative/OmSymbol';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authUtils.getUser();
  const isAuthenticated = authUtils.isAuthenticated();

  const handleLogout = () => {
    authUtils.logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF5EC]/95 backdrop-blur-sm border-b border-[#EFE6D6]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <OmSymbol size={40} className="group-hover:scale-110 transition-transform" />
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A]">
                AstroAnu
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') ? 'text-[#6E1F2A]' : 'text-[#7A5B46] hover:text-[#6E1F2A]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/horoscopes"
              className={`transition-colors ${
                isActive('/horoscopes') ? 'text-[#6E1F2A]' : 'text-[#7A5B46] hover:text-[#6E1F2A]'
              }`}
            >
              Daily Horoscopes
            </Link>
            <Link
              to="/blog"
              className={`transition-colors ${
                isActive('/blog') ? 'text-[#6E1F2A]' : 'text-[#7A5B46] hover:text-[#6E1F2A]'
              }`}
            >
              Blog & Events
            </Link>
            <Link
              to="/testimonials"
              className={`transition-colors ${
                isActive('/testimonials') ? 'text-[#6E1F2A]' : 'text-[#7A5B46] hover:text-[#6E1F2A]'
              }`}
            >
              Testimonials
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 transition-colors ${
                    isActive('/profile') ? 'text-[#6E1F2A]' : 'text-[#7A5B46] hover:text-[#6E1F2A]'
                  }`}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[#7A5B46] hover:text-[#C96A2B] transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-[#6E1F2A] text-[#FFFBF5] rounded-lg hover:bg-[#8B2838] transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
