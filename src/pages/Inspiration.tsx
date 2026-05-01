import { useState, useMemo } from 'react';
import { Heart, ArrowUpDown, Lightbulb, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import FlowerAccent from '@/components/FlowerAccent';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GiftIdea {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  tags: string[];
  emoji: string;
}

const BUILTIN_GIFT_IDEAS: GiftIdea[] = [
  { id: '1', name: 'Handmade Candle Set', description: 'Soy wax candles in ceramic vessels with botanical scents like lavender, rosemary & fig.', priceRange: '$25–$40', tags: ['cozy', 'home'], emoji: '🕯️' },
  { id: '2', name: 'Linen Tote Bag', description: 'Minimalist linen tote with leather handles. Perfect for farmers markets & everyday errands.', priceRange: '$30–$50', tags: ['practical', 'fashion'], emoji: '👜' },
  { id: '3', name: 'Watercolor Paint Kit', description: 'Artist-grade watercolor set with 24 pans, brushes, and a cotton paper pad.', priceRange: '$35–$60', tags: ['creative', 'art'], emoji: '🎨' },
  { id: '5', name: 'Ceramic Mug Set', description: 'Hand-thrown stoneware mugs in earthy glazes. Set of two, microwave & dishwasher safe.', priceRange: '$30–$45', tags: ['home', 'cozy'], emoji: '☕' },
  { id: '6', name: 'Silk Sleep Mask', description: 'Mulberry silk sleep mask with adjustable strap. Gentle on skin and hair.', priceRange: '$15–$30', tags: ['self-care', 'luxury'], emoji: '😴' },
  { id: '7', name: 'Indoor Herb Garden Kit', description: 'Grow basil, mint & cilantro on your windowsill. Includes pots, soil & seeds.', priceRange: '$25–$40', tags: ['nature', 'home'], emoji: '🌿' },
  { id: '8', name: 'Vintage Vinyl Record', description: 'A curated pick from a classic album. Great for music lovers & collectors.', priceRange: '$20–$35', tags: ['music'], emoji: '🎵' },
  { id: '10', name: 'Signed Sports Poster', description: 'A signed poster of your favorite sports team.', priceRange: '$40–$70', tags: ['sports', 'art'], emoji: '🏆' },
  { id: '11', name: 'Essential Oil Diffuser', description: 'Ceramic ultrasonic diffuser with warm LED glow. Whisper-quiet operation.', priceRange: '$30–$50', tags: ['self-care', 'home'], emoji: '💨' },
  { id: '12', name: 'Cozy Knit Blanket', description: 'Chunky hand-knit throw blanket in soft wool. Perfect for movie nights.', priceRange: '$50–$80', tags: ['cozy', 'home'], emoji: '🧶' },
  { id: '13', name: 'Polaroid Camera', description: 'Instant film camera for capturing memories on the spot. Comes with a starter pack of film.', priceRange: '$60–$100', tags: ['creative', 'fun'], emoji: '📸' },
  { id: '15', name: 'Gold Initial Necklace', description: ' 14k gold necklace with a single letter pendant on a fine chain.', priceRange: '$25–$50', tags: ['jewelry', 'personal'], emoji: '✨' },
  { id: '16', name: 'Succulent Plant', description: 'mini succulents & decorative stones.', priceRange: '$30–$45', tags: ['nature', 'home'], emoji: '🪴' },
  { id: '17', name: 'Cocktail Making Kit', description: 'Everything to mix craft cocktails at home: shaker, strainer & recipe cards.', priceRange: '$35–$55', tags: ['foodie', 'fun'], emoji: '🍸' },
  { id: '18', name: 'Washi Tape Collection', description: 'Set of 12 decorative washi tapes in floral and pastel patterns for journaling.', priceRange: '$12–$20', tags: ['stationery', 'creative'], emoji: '🎀' },
  { id: '19', name: 'Yoga Mat', description: 'For your Pilates-loving friends.', priceRange: '$35–$55', tags: ['sports', 'self-care'], emoji: '🧘' },
  { id: '20', name: 'Resistance Bands Set', description: 'Fabric resistance bands with different strength levels and carrying pouch.', priceRange: '$20–$35', tags: ['sports', 'practical'], emoji: '💪' },
  { id: '21', name: 'Stainless Water Bottle', description: 'Insulated sports water bottle with time marker and fruit infuser insert.', priceRange: '$25–$40', tags: ['sports', 'practical'], emoji: '💧' },
  { id: '22', name: 'Photo Frame', description: 'A quality frame for a favorite print or snapshot—wood, metal, or ornate styles to match their space.', priceRange: '$18–$55', tags: ['home', 'personal'], emoji: '🖼️' },
  { id: '23', name: 'Gold Gift Box Chocolates', description: 'Godiva boutiques & godiva.com, or See’s Candies shops & seescandies.com—assorted boxes.', priceRange: '$30–$65', tags: ['foodie', 'luxury'], emoji: '🍫' },
  { id: '24', name: 'Cashmere Beanie', description: 'Nordstrom accessories floor or online; look for their house brands on sale.', priceRange: '$45–$95', tags: ['fashion', 'cozy'], emoji: '🧣' },
  { id: '26', name: 'Cast Iron Skillet', description: 'Lodge at REI, Target’s kitchen aisle, or Williams Sonoma for the enamel-coated options.', priceRange: '$25–$180', tags: ['home', 'foodie'], emoji: '🍳' },
];

type SortOption = 'default' | 'price-low' | 'price-high';

// Extract numeric price from range for sorting
function getMinPrice(priceRange: string): number {
  const match = priceRange.match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const InspirationCard = ({
  idea,
  isSaved,
  onSave,
}: {
  idea: GiftIdea;
  isSaved: boolean;
  onSave: () => void;
}) => {
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

/** FormSubmit forwards submissions to this inbox (confirm the address once via FormSubmit’s first email). */
const GIFT_SUGGESTION_FORM_ENDPOINT =
  `https://formsubmit.co/ajax/${encodeURIComponent('gaonkar.nidhi1@gmail.com')}`;

function parseSuggestionTags(input: string): string[] {
  const tags = input
    .split(/[,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return tags.length ? tags : ['general'];
}

const Inspiration = () => {
  const { items, addItem, removeItem } = useWishlist();
  const { toast } = useToast();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestSubmitting, setSuggestSubmitting] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestDescription, setSuggestDescription] = useState('');
  const [suggestPrice, setSuggestPrice] = useState('');
  const [suggestEmoji, setSuggestEmoji] = useState('');
  const [suggestTags, setSuggestTags] = useState('');

  const tagOptions = useMemo(
    () => Array.from(new Set(BUILTIN_GIFT_IDEAS.flatMap((i) => i.tags))).sort(),
    [],
  );

  const savedNames = new Set(items.map(i => i.name));

  const filteredAndSorted = useMemo(() => {
    let result = activeTag ? BUILTIN_GIFT_IDEAS.filter(i => i.tags.includes(activeTag)) : [...BUILTIN_GIFT_IDEAS];
    
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
      addItem(idea.name, undefined, {
        description: idea.description,
        priceRange: idea.priceRange,
        tags: idea.tags,
        emoji: idea.emoji,
      });
      toast({ description: `Saved "${idea.name}" to your wishlist 💕` });
    }
  };

  const resetSuggestForm = () => {
    setSuggestName('');
    setSuggestDescription('');
    setSuggestPrice('');
    setSuggestEmoji('');
    setSuggestTags('');
  };

  const handleSubmitSuggestion = async () => {
    const name = suggestName.trim();
    const description = suggestDescription.trim();
    if (!name || !description) {
      toast({
        description: 'Please add a name and description for your idea.',
        variant: 'destructive',
      });
      return;
    }
    const emoji = (suggestEmoji.trim() || '🎁').slice(0, 8);
    const priceRange = suggestPrice.trim() || '—';
    const tags = parseSuggestionTags(suggestTags);

    setSuggestSubmitting(true);
    try {
      const res = await fetch(GIFT_SUGGESTION_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: '[Trinkets] Gift idea suggestion',
          _template: 'table',
          gift_idea_name: name,
          description,
          price_range: priceRange,
          emoji,
          tags: tags.join(', '),
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || data.success === false) {
        throw new Error(typeof data.message === 'string' ? data.message : 'Could not send your suggestion.');
      }

      setSuggestOpen(false);
      resetSuggestForm();
      toast({ description: 'Thanks! Your suggestion was sent.' });
    } catch {
      toast({
        description: 'Something went wrong sending your suggestion. Try again later.',
        variant: 'destructive',
      });
    } finally {
      setSuggestSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-4xl font-semibold tracking-tight">Inspiration</h2>
          <FlowerAccent variant="small" className="w-7 h-7" />
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-border"
            asChild
          >
            <Link to="/inspiration/gift-baskets">
              <Gift className="w-4 h-4" strokeWidth={1.5} />
              Gift baskets
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-border"
            onClick={() => setSuggestOpen(true)}
          >
            <Lightbulb className="w-4 h-4" strokeWidth={1.5} />
            Suggest a gift idea
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Browse gift ideas and tap the heart to save to your wishlist.</p>

      <Dialog
        open={suggestOpen}
        onOpenChange={(open) => {
          setSuggestOpen(open);
          if (!open) resetSuggestForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Suggest a gift idea</DialogTitle>
            <DialogDescription>
              Submit this form and we’ll email the details—nothing is added to the board automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="suggest-name">Name</Label>
              <Input
                id="suggest-name"
                placeholder="e.g. Ceramic ring dish"
                value={suggestName}
                onChange={(e) => setSuggestName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="suggest-desc">Description</Label>
              <Textarea
                id="suggest-desc"
                placeholder="What makes it a great gift?"
                value={suggestDescription}
                onChange={(e) => setSuggestDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
              <div className="grid gap-2">
                <Label htmlFor="suggest-price">Price range (optional)</Label>
                <Input
                  id="suggest-price"
                  placeholder="$20–$35"
                  value={suggestPrice}
                  onChange={(e) => setSuggestPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suggest-emoji">Emoji (optional)</Label>
                <Input
                  id="suggest-emoji"
                  placeholder="🎁"
                  value={suggestEmoji}
                  onChange={(e) => setSuggestEmoji(e.target.value)}
                  className="text-lg"
                  maxLength={8}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="suggest-tags">Tags (optional)</Label>
              <Input
                id="suggest-tags"
                placeholder="cozy, home, foodie"
                value={suggestTags}
                onChange={(e) => setSuggestTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas. Default is “general” if empty.</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSuggestOpen(false)}
              disabled={suggestSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmitSuggestion()}
              disabled={suggestSubmitting}
            >
              {suggestSubmitting ? 'Sending…' : 'Send suggestion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${!activeTag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          All
        </button>
        {tagOptions.filter(tag => tag !== 'luxury').map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${activeTag === tag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {tag}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAndSorted.map(idea => (
          <InspirationCard
            key={idea.id}
            idea={idea}
            isSaved={savedNames.has(idea.name)}
            onSave={() => toggleSave(idea)}
          />
        ))}
      </div>
    </div>
  );
};

export default Inspiration;
