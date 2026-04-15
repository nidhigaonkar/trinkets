import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFriends } from '@/hooks/useFriends';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Edit, Trash2, Plus, Heart, Meh, Package } from 'lucide-react';
import FlowerAccent from '@/components/FlowerAccent';
import { GiftHistoryItem, MoodboardItem } from '@/types/friend';

const FriendProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFriend, updateFriend, deleteFriend } = useFriends();
  const friend = getFriend(id!);


  // Moodboard
  const [moodboardInput, setMoodboardInput] = useState('');
  const [moodboardNote, setMoodboardNote] = useState('');

  // Gift History
  const [giftName, setGiftName] = useState('');
  const [giftOccasion, setGiftOccasion] = useState('');
  const [giftPrice, setGiftPrice] = useState('');

  if (!friend) {
    return (
      <div className="text-center py-20">
        <p className="font-serif text-xl mb-4">Friend not found</p>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Remove ${friend.name} from your friends?`)) {
      deleteFriend(friend.id);
      navigate('/');
    }
  };


  const addMoodboardItem = () => {
    if (!moodboardInput.trim()) return;
    const item: MoodboardItem = {
      id: crypto.randomUUID(),
      type: moodboardInput.startsWith('http') ? 'link' : 'note',
      content: moodboardInput,
      note: moodboardNote || undefined,
      createdAt: new Date().toISOString(),
    };
    updateFriend(friend.id, { moodboard: [...friend.moodboard, item] });
    setMoodboardInput('');
    setMoodboardNote('');
  };

  const addGift = () => {
    if (!giftName.trim()) return;
    const gift: GiftHistoryItem = {
      id: crypto.randomUUID(),
      name: giftName,
      date: new Date().toISOString(),
      occasion: giftOccasion,
      price: giftPrice ? parseFloat(giftPrice) : undefined,
    };
    updateFriend(friend.id, { giftHistory: [...friend.giftHistory, gift] });
    setGiftName('');
    setGiftOccasion('');
    setGiftPrice('');
  };

  const rateGift = (giftId: string, rating: 'loved' | 'okay') => {
    const updated = friend.giftHistory.map(g =>
      g.id === giftId ? { ...g, rating } : g
    );
    updateFriend(friend.id, { giftHistory: updated });
  };

  const removeMoodboardItem = (itemId: string) => {
    updateFriend(friend.id, { moodboard: friend.moodboard.filter(m => m.id !== itemId) });
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-4xl font-semibold tracking-tight">{friend.name}</h2>
            <FlowerAccent variant="small" className="w-7 h-7" />
          </div>
          <p className="text-muted-foreground mt-1">{friend.relationship}</p>
          {friend.birthday && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              {formatDate(friend.birthday)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/edit/${friend.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </Button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {friend.budgetPreference && (
          <div className="border border-border rounded-md p-4">
            <p className="text-xs text-muted-foreground mb-1">Budget</p>
            <p className="text-sm font-medium">{friend.budgetPreference}</p>
          </div>
        )}
        {friend.clothingSizes && (friend.clothingSizes.top || friend.clothingSizes.bottom || friend.clothingSizes.shoe) && (
          <div className="border border-border rounded-md p-4">
            <p className="text-xs text-muted-foreground mb-1">Sizes</p>
            <p className="text-sm font-medium">
              {[friend.clothingSizes.top && `Top: ${friend.clothingSizes.top}`, friend.clothingSizes.bottom && `Bottom: ${friend.clothingSizes.bottom}`, friend.clothingSizes.shoe && `Shoe: ${friend.clothingSizes.shoe}`].filter(Boolean).join(' · ')}
            </p>
          </div>
        )}
        {friend.notes && (
          <div className="border border-border rounded-md p-4">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{friend.notes}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {(friend.interests.length > 0 || friend.aesthetics.length > 0) && (
        <div className="mb-8 space-y-3">
          {friend.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {friend.interests.map(t => (
                <span key={t} className="text-xs px-3 py-1 border border-border rounded-full">{t}</span>
              ))}
            </div>
          )}
          {friend.aesthetics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {friend.aesthetics.map(t => (
                <span key={t} className="text-xs px-3 py-1.5 bg-cream rounded-full italic">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <FlowerAccent variant="divider" className="w-48 mx-auto text-muted-foreground mb-8" />

      {/* Tabs */}
      <Tabs defaultValue="moodboard" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto">
          <TabsTrigger value="moodboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none px-4 py-2.5 text-sm">
            Moodboard
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none px-4 py-2.5 text-sm">
            <Package className="w-3.5 h-3.5 mr-1.5" /> Gift History
          </TabsTrigger>
        </TabsList>

        {/* AI Chat */}
        <TabsContent value="ai" className="pt-6">
          <div className="border border-border rounded-md overflow-hidden">
            <div className="h-80 overflow-y-auto p-5 space-y-4 bg-card">
              {chatMessages.length === 0 && (
                <div className="text-center py-12">
                  <FlowerAccent variant="corner" className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="font-serif text-lg mb-1">Ask for gift ideas</p>
                  <p className="text-xs text-muted-foreground">
                    I already know about {friend.name}'s interests. Just ask!
                  </p>
                </div>
              )}
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] text-sm px-4 py-3 rounded-md whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground text-sm px-4 py-3 rounded-md">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-border p-3 flex gap-2 bg-card">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder={`Gift ideas for ${friend.name}...`}
                className="border-0 shadow-none focus-visible:ring-0"
              />
              <Button size="sm" onClick={handleChat} disabled={isAiLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Moodboard */}
        <TabsContent value="moodboard" className="pt-6">
          <div className="flex gap-2 mb-6">
            <Input value={moodboardInput} onChange={e => setMoodboardInput(e.target.value)} placeholder="Paste a link or type a note..." />
            <Input value={moodboardNote} onChange={e => setMoodboardNote(e.target.value)} placeholder="Note (optional)" className="w-48" />
            <Button variant="outline" size="sm" onClick={addMoodboardItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {friend.moodboard.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-md">
              <p className="text-sm text-muted-foreground">Save inspiration, links, and ideas here.</p>
            </div>
          ) : (
            <div className="columns-2 lg:columns-3 gap-4 space-y-4">
              {friend.moodboard.map(item => (
                <div key={item.id} className="break-inside-avoid border border-border rounded-md p-4 bg-card group">
                  {item.type === 'link' ? (
                    <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-2 break-all hover:text-muted-foreground transition-colors">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-sm">{item.content}</p>
                  )}
                  {item.note && <p className="text-xs text-muted-foreground mt-2 italic">{item.note}</p>}
                  <button onClick={() => removeMoodboardItem(item.id)} className="text-xs text-muted-foreground hover:text-destructive mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Gift History */}
        <TabsContent value="history" className="pt-6">
          <div className="flex gap-2 mb-6">
            <Input value={giftName} onChange={e => setGiftName(e.target.value)} placeholder="Gift name" />
            <Input value={giftOccasion} onChange={e => setGiftOccasion(e.target.value)} placeholder="Occasion" className="w-40" />
            <Input value={giftPrice} onChange={e => setGiftPrice(e.target.value)} placeholder="$" className="w-20" type="number" />
            <Button variant="outline" size="sm" onClick={addGift}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {friend.giftHistory.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-md">
              <p className="text-sm text-muted-foreground">No gifts recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friend.giftHistory.map(gift => (
                <div key={gift.id} className="flex items-center justify-between border border-border rounded-md p-4 bg-card">
                  <div>
                    <p className="text-sm font-medium">{gift.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {gift.occasion && `${gift.occasion} · `}{formatDate(gift.date)}{gift.price && ` · $${gift.price}`}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => rateGift(gift.id, 'loved')}
                      className={`p-1.5 rounded-full border transition-colors ${gift.rating === 'loved' ? 'bg-cream border-dusty-rose' : 'border-border hover:border-dusty-rose'}`}
                    >
                      <Heart className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => rateGift(gift.id, 'okay')}
                      className={`p-1.5 rounded-full border transition-colors ${gift.rating === 'okay' ? 'bg-cream border-soft-taupe' : 'border-border hover:border-soft-taupe'}`}
                    >
                      <Meh className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendProfile;
