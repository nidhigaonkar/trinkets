import { useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '@/types/friend';

const STORAGE_KEY = 'trinkets-wishlist';

function load(): WishlistItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function save(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(load);

  useEffect(() => { save(items); }, [items]);

  const addItem = useCallback((name: string, url?: string) => {
    const item: WishlistItem = {
      id: crypto.randomUUID(),
      name,
      url: url || undefined,
      createdAt: new Date().toISOString(),
    };
    const updated = [...load(), item];
    save(updated);
    setItems(updated);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return { items, addItem, removeItem };
}
