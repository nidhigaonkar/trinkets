import { Link } from 'react-router-dom';
import { ArrowLeft, Gift } from 'lucide-react';
import FlowerAccent from '@/components/FlowerAccent';
import { Button } from '@/components/ui/button';
import { GIFT_BASKET_IDEAS } from '@/data/giftBaskets';

const InspirationGiftBaskets = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-4 text-muted-foreground hover:text-foreground" asChild>
          <Link to="/inspiration">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Inspiration
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Gift className="w-8 h-8 text-foreground" strokeWidth={1.5} />
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Gift baskets</h1>
          <FlowerAccent variant="small" className="w-7 h-7" />
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Starter themes with concrete ideas for what to put inside.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GIFT_BASKET_IDEAS.map((b) => (
          <div
            key={b.title}
            className="rounded-xl border border-border bg-card/50 p-5 text-left shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden>{b.emoji}</span>
              <h2 className="font-serif text-lg font-semibold text-foreground">{b.title}</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground marker:text-muted-foreground/70">
              {b.bullets.map((line, i) => (
                <li key={`${b.title}-${i}`} className="leading-snug">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationGiftBaskets;
