import { useState, useMemo } from 'react';
import { Bookmark, Lightbulb, Gift, Search } from 'lucide-react';
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
import candlesImg from '@/assets/candles.png';
import chocolatesImg from '@/assets/chocolates.png';
import bagImg from '@/assets/bag.png';
import knitBlanketImg from '@/assets/knit-blanket.jpg';
import goldNecklaceImg from '@/assets/gold-necklace.jpg';
import earringSetImg from '@/assets/earring-set.jpg';

interface GiftIdea {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  tags: string[];
  emoji: string;
  imageUrl: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const BUILTIN_GIFT_IDEAS: GiftIdea[] = [
  { id: '1', name: 'Handmade Candle Set', description: 'Soy wax candles in ceramic vessels with botanical scents like lavender, rosemary & fig.', priceRange: '$25–$40', tags: ['cozy', 'home'], emoji: '🕯️', imageUrl: candlesImg },
  { id: '26', name: 'Candle Warmer Lamp', description: 'Flameless lamp that melts jar candles from above—cozy scent and glow without soot or an open flame.', priceRange: '$20–$40', tags: ['cozy', 'home'], emoji: '💡', imageUrl: unsplash('photo-1557178499-2ffa69eed23c') },
  { id: '2', name: 'Linen Tote Bag', description: 'Minimalist linen tote with leather handles. Perfect for farmers markets & everyday errands.', priceRange: '$30–$50', tags: ['practical', 'fashion'], emoji: '👜', imageUrl: bagImg },
  { id: '3', name: 'Watercolor Paint Kit', description: 'Artist-grade watercolor set with 24 pans, brushes, and a cotton paper pad.', priceRange: '$35–$60', tags: ['creative', 'art'], emoji: '🎨', imageUrl: unsplash('photo-1460661419201-fd4cecdf8a8b') },
  { id: '4', name: 'Pressed Flower Journal', description: 'Hardcover journal with real pressed flowers in the cover. Dotted pages inside.', priceRange: '$20–$35', tags: ['stationery', 'nature'], emoji: '📓', imageUrl: unsplash('photo-1544716278-ca5e3f4abd8c') },
  { id: '5', name: 'Ceramic Mug Set', description: 'Hand-thrown stoneware mugs in earthy glazes. Set of two, microwave & dishwasher safe.', priceRange: '$30–$45', tags: ['home', 'cozy'], emoji: '☕', imageUrl: unsplash('photo-1514228742587-6b1558fcca3d') },
  { id: '6', name: 'Silk Sleep Mask', description: 'Mulberry silk sleep mask with adjustable strap. Gentle on skin and hair.', priceRange: '$15–$30', tags: ['self-care'], emoji: '😴', imageUrl: unsplash('photo-1631049307264-da0ec9d70304') },
  { id: '7', name: 'Indoor Herb Garden Kit', description: 'Grow basil, mint & cilantro on your windowsill. Includes pots, soil & seeds.', priceRange: '$25–$40', tags: ['nature', 'home'], emoji: '🌿', imageUrl: unsplash('photo-1416879595882-3373a0480b5b') },
  { id: '8', name: 'Vintage Vinyl Record', description: 'A curated pick from a classic album. Great for music lovers & collectors.', priceRange: '$20–$35', tags: ['music', 'vintage'], emoji: '🎵', imageUrl: unsplash('photo-1514525253161-7a46d19cd819') },
  { id: '9', name: 'Artisan Chocolate Box', description: 'Single-origin chocolate truffles in a beautiful gift box. 12 assorted flavors.', priceRange: '$25–$45', tags: ['foodie'], emoji: '🍫', imageUrl: chocolatesImg },
  { id: '12', name: 'Cozy Knit Blanket', description: 'Chunky hand-knit throw blanket in soft merino wool. Perfect for movie nights.', priceRange: '$50–$80', tags: ['cozy', 'home'], emoji: '🧶', imageUrl: knitBlanketImg },
  { id: '13', name: 'Polaroid Camera', description: 'Instant film camera for capturing memories on the spot. Comes with a starter pack of film.', priceRange: '$60–$100', tags: ['creative', 'fun'], emoji: '📸', imageUrl: unsplash('photo-1495121553079-4c61bcce1894') },
  { id: '27', name: 'DJI Osmo Pocket 4', description: 'Pocket-sized 3-axis gimbal camera for buttery 4K video—great for travel, vlogs, and everyday filming.', priceRange: '$500–$650', tags: ['creative', 'fun'], emoji: '🎥', imageUrl: unsplash('photo-1516035069371-29a1b244cc32') },
  { id: '14', name: 'Book Subscription Box', description: 'Monthly curated book box with a novel, bookish goodies & a handwritten note.', priceRange: '$30–$45/mo', tags: ['bookworm', 'subscription'], emoji: '📚', imageUrl: unsplash('photo-1524995997946-a1c2e315a42f') },
  { id: '15', name: 'Gold Initial Necklace', description: 'Dainty 14k gold-filled necklace with a single letter pendant on a fine chain.', priceRange: '$25–$50', tags: ['jewelry', 'personal'], emoji: '✨', imageUrl: goldNecklaceImg },
  { id: '28', name: 'Earring Set', description: 'Twisted gold hoop earrings with a polished finish. Everyday jewelry that still feels special.', priceRange: '$20–$45', tags: ['jewelry', 'fashion'], emoji: '💫', imageUrl: earringSetImg },
  { id: '16', name: 'Succulent Terrarium', description: 'Glass geometric terrarium planted with three mini succulents & decorative stones.', priceRange: '$30–$45', tags: ['nature', 'home'], emoji: '🪴', imageUrl: unsplash('photo-1501004318641-b39e6451bec6') },
  { id: '17', name: 'Cocktail Making Kit', description: 'Everything to mix craft cocktails at home: shaker, jigger, strainer & recipe cards.', priceRange: '$35–$55', tags: ['foodie', 'fun'], emoji: '🍸', imageUrl: unsplash('photo-1514362545857-3bc16c4c7d1b') },
  { id: '18', name: 'Washi Tape Collection', description: 'Set of 12 decorative washi tapes in floral and pastel patterns for journaling.', priceRange: '$12–$20', tags: ['stationery', 'creative'], emoji: '🎀', imageUrl: unsplash('photo-1513542789411-b6a5d4f31634') },
  { id: '19', name: 'Yoga Mat & Strap', description: 'Premium non-slip yoga mat with alignment guides and matching cotton carry strap.', priceRange: '$35–$55', tags: ['sports', 'self-care'], emoji: '🧘', imageUrl: unsplash('photo-1544367567-0f2fcb009e0b') },
  { id: '20', name: 'Resistance Bands Set', description: 'Set of 5 fabric resistance bands with different strength levels and carrying pouch.', priceRange: '$20–$35', tags: ['sports', 'practical'], emoji: '💪', imageUrl: unsplash('photo-1571019613454-1cb2f99b2d8b') },
  { id: '21', name: 'Stainless Water Bottle', description: 'Insulated sports water bottle with time marker and fruit infuser insert.', priceRange: '$25–$40', tags: ['sports', 'practical'], emoji: '💧', imageUrl: unsplash('photo-1548839140-29a749e1cf4d') },
  { id: '22', name: 'Pottery Class Gift Card', description: 'A session or course at a local studio—throw on the wheel, glaze, and take home your pieces.', priceRange: '$45–$120', tags: ['creative', 'experience'], emoji: '🏺', imageUrl: unsplash('photo-1565193566173-7a0ee3dbe261') },
  { id: '23', name: 'Small Desk Plant & Ceramic Pot', description: 'Compact desk-friendly plant in a glazed ceramic pot—perfect for a sunny office corner.', priceRange: '$25–$45', tags: ['nature', 'home'], emoji: '🪴', imageUrl: unsplash('photo-1485955900006-10f4d324d411') },
  { id: '24', name: 'National Parks Pass or Museum Membership', description: 'America the Beautiful pass for federal lands, or a year of member perks at a favorite art museum.', priceRange: '$50–$130', tags: ['experience', 'nature', 'art'], emoji: '🏞️', imageUrl: unsplash('photo-1506905925346-21bda4d32df4') },
  { id: '25', name: 'Cooking Class or Pasta-Making Kit', description: 'In-person class for hands-on fun, or a premium kit with flour, tools, and sauce for a cozy night in.', priceRange: '$40–$130', tags: ['foodie', 'fun'], emoji: '🍝', imageUrl: unsplash('photo-1621996346565-e3dbc646d9a9') },
];

const InspirationCard = ({
  idea,
  isSaved,
  onSave,
}: {
  idea: GiftIdea;
  isSaved: boolean;
  onSave: () => void;
}) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-muted/20 cursor-pointer transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <img 
        src={idea.imageUrl} 
        alt={idea.name} 
        className="w-full h-auto object-cover object-center aspect-[3/4] transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      
      {/* Overlay - appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-900/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
        <div className="flex justify-end">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(); }}
            className={`p-3 rounded-full backdrop-blur-md shadow-sm transition-all transform hover:scale-110 ${
              isSaved 
                ? 'bg-secondary text-dusty-rose' 
                : 'bg-white/85 text-foreground hover:bg-white'
            }`}
          >
            <Bookmark className="w-5 h-5" strokeWidth={1.5} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-serif text-xl font-semibold tracking-tight mb-1">{idea.name}</h3>
          <p className="text-sm text-white/80 line-clamp-2 mb-3 font-light leading-relaxed">{idea.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium tracking-wide">{idea.priceRange}</span>
            <div className="flex gap-2">
              {idea.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 backdrop-blur-md bg-white/20 text-white rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GIFT_SUGGESTION_FORM_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent('gaonkar.nidhi1@gmail.com')}`;

function parseSuggestionTags(input: string): string[] {
  const tags = input.split(/[,]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
  return tags.length ? tags : ['general'];
}

const Inspiration = () => {
  const { items, addItem, removeItem } = useWishlist();
  const { toast } = useToast();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestSubmitting, setSuggestSubmitting] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestDescription, setSuggestDescription] = useState('');
  const [suggestPrice, setSuggestPrice] = useState('');
  const [suggestTags, setSuggestTags] = useState('');

  const tagOptions = useMemo(
    () => Array.from(new Set(BUILTIN_GIFT_IDEAS.flatMap((i) => i.tags))).sort(),
    [],
  );

  const savedNames = new Set(items.map(i => i.name));

  const filteredAndSorted = useMemo(() => {
    let result = [...BUILTIN_GIFT_IDEAS];
    
    if (activeTag) {
      result = result.filter(i => i.tags.includes(activeTag));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.tags.some(t => t.includes(q))
      );
    }
    
    return result;
  }, [activeTag, searchQuery]);

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
      toast({ description: `Saved "${idea.name}" to your wishlist.` });
    }
  };

  const resetSuggestForm = () => {
    setSuggestName('');
    setSuggestDescription('');
    setSuggestPrice('');
    setSuggestTags('');
  };

  const handleSubmitSuggestion = async () => {
    const name = suggestName.trim();
    const description = suggestDescription.trim();
    const price = suggestPrice.trim();
    if (!name || !description || !price) {
      toast({ description: 'Please add a name, description, and price range for your idea.', variant: 'destructive' });
      return;
    }
    setSuggestSubmitting(true);
    try {
      const res = await fetch(GIFT_SUGGESTION_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '[Trinkets] Gift idea suggestion',
          _template: 'table',
          gift_idea_name: name,
          description,
          price_range: price,
          tags: parseSuggestionTags(suggestTags).join(', '),
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || data.success === false) throw new Error(data.message);

      setSuggestOpen(false);
      resetSuggestForm();
      toast({ description: 'Thanks! Your suggestion was sent.' });
    } catch {
      toast({ description: 'Something went wrong sending your suggestion.', variant: 'destructive' });
    } finally {
      setSuggestSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
            onClick={() => setSuggestOpen(true)}
          >
            <Lightbulb className="w-4 h-4" strokeWidth={1.5} />
            Suggest a gift idea
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-2 rounded-full border-border" asChild>
            <Link to="/inspiration/gift-baskets">
              <Gift className="w-4 h-4" strokeWidth={1.5} />
              Gift baskets
            </Link>
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Browse gift ideas and tap the bookmark to save to your wishlist.
      </p>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-10">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search gifts, tags, or themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-input hover:bg-accent/30 rounded-full py-3 pl-12 pr-4 outline-none transition-colors text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          />
        </div>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${!activeTag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          All
        </button>
        {tagOptions.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${activeTag === tag ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSorted.map(idea => (
            <InspirationCard
              key={idea.id}
              idea={idea}
              isSaved={savedNames.has(idea.name)}
              onSave={() => toggleSave(idea)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-muted-foreground font-serif italic text-xl">
          No gifts found matching your criteria.
        </div>
      )}

      {/* Suggest Dialog */}
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
            <div className="grid gap-2">
              <Label htmlFor="suggest-price">Price range</Label>
              <Input
                id="suggest-price"
                placeholder="$20–$35"
                value={suggestPrice}
                onChange={(e) => setSuggestPrice(e.target.value)}
              />
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

    </div>
  );
};

export default Inspiration;
