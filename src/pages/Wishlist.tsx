import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ExternalLink, X } from 'lucide-react';
import FlowerAccent from '@/components/FlowerAccent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WishlistItem } from '@/types/friend';

const Wishlist = () => {
  const { items, addItem, removeItem } = useWishlist();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selected, setSelected] = useState<WishlistItem | null>(null);

  const handleAdd = () => {
    if (!name.trim()) return;
    addItem(name.trim(), url.trim() || undefined);
    setName('');
    setUrl('');
  };

  const hasDetails = (item: WishlistItem) =>
    !!(item.description || item.priceRange || item.emoji || (item.tags && item.tags.length));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-serif text-4xl font-semibold tracking-tight">My Wishlist</h2>
        <FlowerAccent variant="small" className="w-7 h-7" />
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Item name"
        />
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Link (optional)"
          className="w-48"
        />
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-md">
          <p className="text-sm text-muted-foreground">Your wishlist is empty. Add something you'd love!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const clickable = hasDetails(item);
            return (
              <div
                key={item.id}
                onClick={() => clickable && setSelected(item)}
                className={`flex items-center justify-between border border-border rounded-md p-4 bg-card group transition-colors ${clickable ? 'cursor-pointer hover:bg-accent/40' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.emoji && <span className="text-xl shrink-0">{item.emoji}</span>}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.priceRange && (
                      <p className="text-xs text-muted-foreground">{item.priceRange}</p>
                    )}
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {selected.emoji && <span className="text-3xl">{selected.emoji}</span>}
                  <DialogTitle className="font-serif text-2xl tracking-tight">{selected.name}</DialogTitle>
                </div>
                {selected.description && (
                  <DialogDescription className="pt-2 text-sm leading-relaxed">
                    {selected.description}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="flex items-center justify-between mt-2">
                {selected.priceRange && (
                  <span className="text-sm font-medium text-foreground/80">{selected.priceRange}</span>
                )}
                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {selected.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 border border-border text-muted-foreground rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wishlist;
