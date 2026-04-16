import { Link, useLocation } from 'react-router-dom';
import { Gift, Users, Plus, Settings, Heart, Lightbulb } from 'lucide-react';
import FlowerAccent from './FlowerAccent';
import { useSettings } from '@/hooks/useSettings';
import floralBg from '@/assets/floral-bg.png';
import floralColoredBg from '@/assets/floral-colored-bg.png';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { settings } = useSettings();

  const navItems = [
    { to: '/', icon: Users, label: 'Friends' },
    { to: '/add', icon: Plus, label: 'Add Friend' },
    { to: '/inspiration', icon: Lightbulb, label: 'Inspiration' },
    { to: '/wishlist', icon: Heart, label: 'My Wishlist' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const getBackgroundStyle = () => {
    switch (settings.background) {
      case 'floral':
        return { backgroundImage: `url(${floralBg})`, backgroundSize: '900px' };
      case 'floral-colored':
        return { backgroundImage: `url(${floralColoredBg})`, backgroundSize: '400px' };
      case 'dots':
        return {
          backgroundImage: 'radial-gradient(circle, hsl(0 0% 45% / 0.12) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        };
      case 'grid':
        return {
          backgroundImage:
            'linear-gradient(hsl(0 0% 90%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 90%) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        };
      case 'none':
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Dynamic background */}
      {settings.background !== 'none' && (
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.07] bg-repeat"
          style={getBackgroundStyle()}
        />
      )}
      <header className="border-b border-border relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Gift className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            <h1 className="text-2xl font-serif font-semibold tracking-tight text-foreground">
              Trinkets
            </h1>
            <FlowerAccent variant="small" className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
          <nav className="flex items-center gap-8">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 text-sm tracking-wide transition-colors hover:text-foreground ${
                  location.pathname === to ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
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
