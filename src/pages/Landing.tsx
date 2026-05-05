import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import morningSkyBg from '@/assets/morning-sky-bg.png';

const Landing = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col relative"
      style={{ backgroundImage: `url(${morningSkyBg})` }}
    >
      {/* Optional subtle overlay to ensure text readability against the background */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Header */}
      <header className="px-8 sm:px-16 py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Gift className="w-5 h-5 text-white" strokeWidth={1.5} />
          <h1 className="text-xl font-serif font-medium tracking-wide text-white">
            Trinkets
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/inspiration" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Inspiration
          </Link>
          <Link to="/wishlist" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Wishlist
          </Link>
        </nav>

        <div>
          <Link to="/auth">
            <Button 
              variant="outline" 
              className="border-white/50 text-white bg-white/10 hover:bg-white hover:text-black rounded-full px-6 transition-colors backdrop-blur-sm"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center pb-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 
            className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-tight mb-6"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            Make every gift <br />
            unforgettable.
          </h2>
          
          <p 
            className="text-base sm:text-lg text-white/90 max-w-xl mx-auto mb-12 font-sans font-light tracking-wide leading-relaxed"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            We're designing tools for thoughtful gift-givers. Amid the rush of everyday life, we build a quiet space to curate, track, and save the perfect ideas for your loved ones.
          </p>

          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-transparent border border-white/60 text-white hover:bg-white hover:text-black rounded-full px-8 h-12 text-sm uppercase tracking-widest backdrop-blur-md transition-all"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;
