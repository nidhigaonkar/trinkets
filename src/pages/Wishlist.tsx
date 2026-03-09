import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ExternalLink, X } from 'lucide-react';
import FlowerAccent from '@/components/FlowerAccent';

const Wishlist = () => {
  const { items, addItem, removeItem } = useWishlist();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    addItem(name.trim(), url.trim() || undefined);
    setName('');
    setUrl('');
  };

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
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between border border-border rounded-md p-4 bg-card group">
              <div className="flex items-center gap-3 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
