import { useState, useEffect, useCallback } from 'react';
import { Friend } from '@/types/friend';

const STORAGE_KEY = 'trinkets-friends';

function loadFriends(): Friend[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveFriends(friends: Friend[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>(loadFriends);

  useEffect(() => {
    saveFriends(friends);
  }, [friends]);

  const addFriend = useCallback((friend: Omit<Friend, 'id' | 'createdAt' | 'moodboard' | 'giftHistory'>) => {
    const newFriend: Friend = {
      ...friend,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      moodboard: [],
      giftHistory: [],
    };
    const updated = [...loadFriends(), newFriend];
    saveFriends(updated);
    setFriends(updated);
    return newFriend.id;
  }, []);

  const updateFriend = useCallback((id: string, updates: Partial<Friend>) => {
    setFriends(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const deleteFriend = useCallback((id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
  }, []);

  const getFriend = useCallback((id: string) => {
    return friends.find(f => f.id === id);
  }, [friends]);

  return { friends, addFriend, updateFriend, deleteFriend, getFriend };
}
