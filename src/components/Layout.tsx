import { Link, useLocation } from 'react-router-dom';
import { Gift, Users, Plus, Settings, Heart, Lightbulb, LogOut } from 'lucide-react';
import FlowerAccent from './FlowerAccent';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import floralBg from '@/assets/floral-bg.png';
import floralColoredBg from '@/assets/floral-colored-bg.png';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { settings } = useSettings();
  const { signOut, user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: Users, label: 'Friends', requiresAuth: true },
    { to: '/add', icon: Plus, label: 'Add Friend', requiresAuth: true },
    { to: '/inspiration', icon: Lightbulb, label: 'Inspiration', requiresAuth: false },
    { to: '/wishlist', icon: Heart, label: 'My Wishlist', requiresAuth: true },
    { to: '/settings', icon: Settings, label: 'Settings', requiresAuth: true },
  ];

  const getBackgroundStyle = (): { style: React.CSSProperties; opacity: string } => {
    switch (settings.background) {
      case 'floral':
        return {
          style: { backgroundImage: `url(${floralBg})`, backgroundSize: '900px' },
          opacity: 'opacity-[0.07]',
        };
      case 'floral-colored':
        return {
          style: { backgroundImage: `url(${floralColoredBg})`, backgroundSize: '400px' },
          opacity: 'opacity-[0.07]',
        };
      case 'dots':
        return {
          style: {
            backgroundImage: 'radial-gradient(circle, hsl(0 0% 50%) 1.2px, transparent 1.2px)',
            backgroundSize: '18px 18px',
          },
          opacity: 'opacity-30',
        };
      case 'grid':
        return {
          style: {
            backgroundImage:
              'linear-gradient(hsl(0 0% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 70%) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          },
          opacity: 'opacity-40',
        };
      case 'stars':
        return {
          style: {
            backgroundImage:
              'radial-gradient(circle at 25% 25%, hsl(0 0% 50%) 1px, transparent 1px), radial-gradient(circle at 75% 75%, hsl(0 0% 50%) 1.5px, transparent 1.5px)',
            backgroundSize: '80px 80px',
          },
          opacity: 'opacity-30',
        };
      case 'waves':
        return {
          style: {
            backgroundImage:
              'radial-gradient(circle at 50% 0, transparent 45%, hsl(0 0% 50%) 50%, transparent 55%)',
            backgroundSize: '60px 30px',
          },
          opacity: 'opacity-20',
        };
      case 'blueprint':
        return {
          style: {
            backgroundColor: '#f1f5f9',
            backgroundImage:
              'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          },
          opacity: 'opacity-100',
        };
      case 'circuit':
        return {
          style: {
            backgroundColor: '#f8fafc',
            backgroundImage:
              'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          },
          opacity: 'opacity-100',
        };
      case 'none':
      default:
        return { style: {}, opacity: 'opacity-0' };
    }
  };

  const bg = getBackgroundStyle();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Dynamic background */}
      {settings.background !== 'none' && (
        <div
          className={`fixed inset-0 pointer-events-none bg-repeat ${bg.opacity}`}
          style={bg.style}
        />
      )}
      <header className="border-b border-border relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <Gift className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            <h1 className="text-2xl font-serif font-semibold tracking-tight text-foreground">
              Trinkets
            </h1>
            <FlowerAccent variant="small" className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
          <nav className="flex items-center gap-8">
            {navItems.filter(item => !item.requiresAuth || user).map(({ to, icon: Icon, label }) => {
              const active =
                to === '/inspiration'
                  ? location.pathname === '/inspiration' || location.pathname.startsWith('/inspiration/')
                  : location.pathname === to;
              return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 text-sm tracking-wide transition-colors hover:text-foreground ${
                  active ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </Link>
            );
            })}
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-8 py-10 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
