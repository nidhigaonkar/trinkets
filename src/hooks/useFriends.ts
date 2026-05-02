import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Friend } from '@/types/friend';

interface DbFriend {
  id: string;
  user_id: string;
  name: string;
  birthday: string | null;
  notes: string | null;
  interests: unknown;
  aesthetics: unknown;
  favorites: unknown;
  clothing_sizes: unknown;
  moodboard: unknown;
  gift_history: unknown;
  avatar_url: string | null;
  created_at: string;
}

function toFriend(row: DbFriend): Friend {
  return {
    id: row.id,
    name: row.name,
    birthday: row.birthday ?? '',
    relationship: '',
    budgetPreference: '',
    notes: row.notes ?? undefined,
    interests: (row.interests as string[]) ?? [],
    aesthetics: (row.aesthetics as string[]) ?? [],
    favorites: (row.favorites as string[]) ?? [],
    clothingSizes: (row.clothing_sizes as Friend['clothingSizes']) ?? {},
    moodboard: (row.moodboard as Friend['moodboard']) ?? [],
    giftHistory: (row.gift_history as Friend['giftHistory']) ?? [],
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
  };
}

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);

  const refresh = useCallback(async () => {
    if (!user) { setFriends([]); return; }
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setFriends((data as DbFriend[]).map(toFriend));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addFriend = useCallback(async (friend: Omit<Friend, 'id' | 'createdAt' | 'moodboard' | 'giftHistory'>) => {
    if (!user) return '';
    const { data, error } = await supabase.from('friends').insert({
      user_id: user.id,
      name: friend.name,
      birthday: friend.birthday || null,
      notes: friend.notes ?? null,
      interests: friend.interests ?? [],
      aesthetics: friend.aesthetics ?? [],
      favorites: friend.favorites ?? [],
      clothing_sizes: friend.clothingSizes ?? {},
    }).select().single();
    if (error || !data) return '';
    const created = toFriend(data as DbFriend);
    setFriends(prev => [created, ...prev]);
    return created.id;
  }, [user]);

  const updateFriend = useCallback(async (id: string, updates: Partial<Friend>) => {
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.birthday !== undefined) payload.birthday = updates.birthday || null;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.interests !== undefined) payload.interests = updates.interests;
    if (updates.aesthetics !== undefined) payload.aesthetics = updates.aesthetics;
    if (updates.favorites !== undefined) payload.favorites = updates.favorites;
    if (updates.clothingSizes !== undefined) payload.clothing_sizes = updates.clothingSizes;
    if (updates.moodboard !== undefined) payload.moodboard = updates.moodboard;
    if (updates.giftHistory !== undefined) payload.gift_history = updates.giftHistory;
    if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

    setFriends(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    await supabase.from('friends').update(payload).eq('id', id);
  }, []);

  const deleteFriend = useCallback(async (id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    await supabase.from('friends').delete().eq('id', id);
  }, []);

  const getFriend = useCallback((id: string) => friends.find(f => f.id === id), [friends]);

  return { friends, addFriend, updateFriend, deleteFriend, getFriend };
}
