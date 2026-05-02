import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WishlistItem } from '@/types/friend';

interface DbWishlist {
  id: string;
  name: string;
  url: string | null;
  description: string | null;
  price_range: string | null;
  emoji: string | null;
  tags: unknown;
  created_at: string;
}

function toItem(row: DbWishlist): WishlistItem {
  return {
    id: row.id,
    name: row.name,
    url: row.url ?? undefined,
    description: row.description ?? undefined,
    priceRange: row.price_range ?? undefined,
    emoji: row.emoji ?? undefined,
    tags: (row.tags as string[]) ?? [],
    createdAt: row.created_at,
  };
}

export function useWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!user) { setItems([]); return; }
    supabase.from('wishlist_items').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems((data as DbWishlist[]).map(toItem));
      });
  }, [user]);

  const addItem = useCallback(async (
    name: string,
    url?: string,
    details?: { description?: string; priceRange?: string; tags?: string[]; emoji?: string }
  ) => {
    if (!user) return;
    const { data, error } = await supabase.from('wishlist_items').insert({
      user_id: user.id,
      name,
      url: url || null,
      description: details?.description ?? null,
      price_range: details?.priceRange ?? null,
      emoji: details?.emoji ?? null,
      tags: details?.tags ?? [],
    }).select().single();
    if (!error && data) setItems(prev => [toItem(data as DbWishlist), ...prev]);
  }, [user]);

  const removeItem = useCallback(async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await supabase.from('wishlist_items').delete().eq('id', id);
  }, []);

  return { items, addItem, removeItem };
}
