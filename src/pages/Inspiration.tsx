import { useState, useMemo } from 'react';
import { Heart, ArrowUpDown } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import FlowerAccent from '@/components/FlowerAccent';
import { useToast } from '@/hooks/use-toast';

interface GiftIdea {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  tags: string[];
  emoji: string;
}

const GIFT_IDEAS: GiftIdea[] = [
  { id: '1', name: 'Handmade Candle Set', description: 'Soy wax candles in ceramic vessels with botanical scents like lavender, rosemary & fig.', priceRange: '$25–$40', tags: ['cozy', 'home'], emoji: '🕯️' },
  { id: '2', name: 'Linen Tote Bag', description: 'Minimalist linen tote with leather handles. Perfect for farmers markets & everyday errands.', priceRange: '$30–$50', tags: ['practical', 'fashion'], emoji: '👜' },
  { id: '3', name: 'Watercolor Paint Kit', description: 'Artist-grade watercolor set with 24 pans, brushes, and a cotton paper pad.', priceRange: '$35–$60', tags: ['creative', 'art'], emoji: '🎨' },
  { id: '4', name: 'Pressed Flower Journal', description: 'Hardcover journal with real pressed flowers in the cover. Dotted pages inside.', priceRange: '$20–$35', tags: ['stationery', 'nature'], emoji: '📓' },
  { id: '5', name: 'Ceramic Mug Set', description: 'Hand-thrown stoneware mugs in earthy glazes. Set of two, microwave & dishwasher safe.', priceRange: '$30–$45', tags: ['home', 'cozy'], emoji: '☕' },
  { id: '6', name: 'Silk Sleep Mask', description: 'Mulberry silk sleep mask with adjustable strap. Gentle on skin and hair.', priceRange: '$15–$30', tags: ['self-care', 'luxury'], emoji: '😴' },
  { id: '7', name: 'Indoor Herb Garden Kit', description: 'Grow basil, mint & cilantro on your windowsill. Includes pots, soil & seeds.', priceRange: '$25–$40', tags: ['nature', 'home'], emoji: '🌿' },
  { id: '8', name: 'Vintage Vinyl Record', description: 'A curated pick from a classic album. Great for music lovers & collectors.', priceRange: '$20–$35', tags: ['music', 'vintage'], emoji: '🎵' },
  { id: '9', name: 'Artisan Chocolate Box', description: 'Single-origin chocolate truffles in a beautiful gift box. 12 assorted flavors.', priceRange: '$25–$45', tags: ['foodie', 'luxury'], emoji: '🍫' },
  { id: '10', name: 'Personalized Star Map', description: 'Custom print of the night sky on a meaningful date. Framed or unframed.', priceRange: '$40–$70', tags: ['sentimental', 'art'], emoji: '✨' },
  { id: '11', name: 'Essential Oil Diffuser', description: 'Ceramic ultrasonic diffuser with warm LED glow. Whisper-quiet operation.', priceRange: '$30–$50', tags: ['self-care', 'home'], emoji: '💨' },
  { id: '12', name: 'Cozy Knit Blanket', description: 'Chunky hand-knit throw blanket in soft merino wool. Perfect for movie nights.', priceRange: '$50–$80', tags: ['cozy', 'home'], emoji: '🧶' },
  { id: '13', name: 'Polaroid Camera', description: 'Instant film camera for capturing memories on the spot. Comes with a starter pack of film.', priceRange: '$60–$100', tags: ['creative', 'fun'], emoji: '📸' },
  { id: '14', name: 'Book Subscription Box', description: 'Monthly curated book box with a novel, bookish goodies & a handwritten note.', priceRange: '$30–$45/mo', tags: ['bookworm', 'subscription'], emoji: '📚' },
  { id: '15', name: 'Gold Initial Necklace', description: 'Dainty 14k gold-filled necklace with a single letter pendant on a fine chain.', priceRange: '$25–$50', tags: ['jewelry', 'personal'], emoji: '✨' },
  { id: '16', name: 'Succulent Terrarium', description: 'Glass geometric terrarium planted with three mini succulents & decorative stones.', priceRange: '$30–$45', tags: ['nature', 'home'], emoji: '🪴' },
  { id: '17', name: 'Cocktail Making Kit', description: 'Everything to mix craft cocktails at home: shaker, jigger, strainer & recipe cards.', priceRange: '$35–$55', tags: ['foodie', 'fun'], emoji: '🍸' },
  { id: '18', name: 'Washi Tape Collection', description: 'Set of 12 decorative washi tapes in floral and pastel patterns for journaling.', priceRange: '$12–$20', tags: ['stationery', 'creative'], emoji: '🎀' },
  { id: '19', name: 'Yoga Mat & Strap', description: 'Premium non-slip yoga mat with alignment guides and matching cotton carry strap.', priceRange: '$35–$55', tags: ['sports', 'self-care'], emoji: '🧘' },
  { id: '20', name: 'Resistance Bands Set', description: 'Set of 5 fabric resistance bands with different strength levels and carrying pouch.', priceRange: '$20–$35', tags: ['sports', 'practical'], emoji: '💪' },
  { id: '21', name: 'Stainless Water Bottle', description: 'Insulated sports water bottle with time marker and fruit infuser insert.', priceRange: '$25–$40', tags: ['sports', 'practical'], emoji: '💧' },
];

const ALL_TAGS = Array.from(new Set(GIFT_IDEAS.flatMap(i => i.tags))).sort();
type SortOption = 'default' | 'price-low' | 'price-high';

// Extract numeric price from range for sorting
function getMinPrice(priceRange: string): number {
  const match = priceRange.match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const InspirationCard = ({ idea, isSaved, onSave }: { idea: GiftIdea; isSaved: boolean; onSave: () => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 w-full cursor-pointer select-none"
      onClick={() => setIsFlipped(prev => !prev)}
    >
      <div className={`relative w-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ minHeight: '220px' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-border bg-card p-5 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl">{idea.emoji}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-dusty-rose' : 'text-muted-foreground hover:text-dusty-rose'}`}
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <h3 className="font-serif text-base font-semibold text-card-foreground tracking-tight mb-1.5">{idea.name}</h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{idea.description}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs font-medium text-foreground/70">{idea.priceRange}</span>
            <div className="flex gap-1">
              {idea.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 border border-border text-muted-foreground rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-border bg-card p-5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-3">{idea.emoji}</span>
          <h3 className="font-serif text-lg font-semibold text-card-foreground tracking-tight mb-2">{idea.name}</h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-[90%]">{idea.description}</p>
          <span className="text-sm font-medium text-foreground/80">{idea.priceRange}</span>
          <p className="text-[10px] text-muted-foreground mt-4">Click to flip back</p>
        </div>
      </div>
    </div>
  );
};

const Inspiration = () => {
  const { items, addItem, removeItem } = useWishlist();
  const { toast } = useToast();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const savedNames = new Set(items.map(i => i.name));

  const filteredAndSorted = useMemo(() => {
    let result = activeTag ? GIFT_IDEAS.filter(i => i.tags.includes(activeTag)) : [...GIFT_IDEAS];
    
    if (sortBy === 'price-low') {
      result.sort((a, b) => getMinPrice(a.priceRange) - getMinPrice(b.priceRange));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => getMinPrice(b.priceRange) - getMinPrice(a.priceRange));
    }
    
    return result;
  }, [activeTag, sortBy]);

  const toggleSave = (idea: GiftIdea) => {
    const existing = items.find(i => i.name === idea.name);
    if (existing) {
      removeItem(existing.id);
      toast({ description: `Removed "${idea.name}" from wishlist` });
    } else {
      addItem(idea.name);
      toast({ description: `Saved "${idea.name}" to your wishlist 💕` });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif text-4xl font-semibold tracking-tight">Inspiration</h2>
        <FlowerAccent variant="small" className="w-7 h-7" />
      </div>
      <p className="text-sm text-muted-foreground mb-8">Browse gift ideas and tap the heart to save to your wishlist.</p>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${!activeTag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          All
        </button>
        {ALL_TAGS.filter(tag => tag !== 'luxury').map(tag => (
          <span key={tag} className="contents">
            <button
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${activeTag === tag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {tag}
            </button>
            {tag === 'self-care' && (
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-xs px-2 py-1 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            )}
          </span>
        ))}
      </div>

      {/* Pinterest-style masonry grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {filteredAndSorted.map(idea => (
          <div key={idea.id} className="break-inside-avoid">
            <InspirationCard
              idea={idea}
              isSaved={savedNames.has(idea.name)}
              onSave={() => toggleSave(idea)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;
