export interface Friend {
  id: string;
  name: string;
  birthday: string;
  relationship: string;
  clothingSizes?: {
    top?: string;
    bottom?: string;
    shoe?: string;
  };
  interests: string[];
  aesthetics: string[];
  favorites: string[];
  budgetPreference: string;
  notes?: string;
  avatarUrl?: string;
  moodboard: MoodboardItem[];
  giftHistory: GiftHistoryItem[];
  createdAt: string;
}

export interface MoodboardItem {
  id: string;
  type: 'image' | 'link' | 'note';
  content: string;
  note?: string;
  createdAt: string;
}

export interface GiftHistoryItem {
  id: string;
  name: string;
  date: string;
  occasion: string;
  price?: number;
  rating?: 'loved' | 'okay';
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
