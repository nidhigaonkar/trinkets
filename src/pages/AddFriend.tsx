import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFriends } from '@/hooks/useFriends';
import { Friend } from '@/types/friend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import FlowerAccent from '@/components/FlowerAccent';

const AddFriend = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { friends, addFriend, updateFriend, getFriend } = useFriends();
  const existing = id ? getFriend(id) : undefined;

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [aesthetics, setAesthetics] = useState<string[]>([]);
  const [aestheticInput, setAestheticInput] = useState('');
  const [topSize, setTopSize] = useState('');
  const [bottomSize, setBottomSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Populate fields when editing — wait until friend data loads from the backend
  useEffect(() => {
    if (!id || hydrated || !existing) return;
    setName(existing.name || '');
    setBirthday(existing.birthday || '');
    setNotes(existing.notes || '');
    setInterests(existing.interests || []);
    setAesthetics(existing.aesthetics || []);
    setTopSize(existing.clothingSizes?.top || '');
    setBottomSize(existing.clothingSizes?.bottom || '');
    setShoeSize(existing.clothingSizes?.shoe || '');
    setHydrated(true);
  }, [id, existing, hydrated]);

  const addTag = (value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const data = {
      name,
      birthday,
      relationship: '',
      budgetPreference: '',
      notes,
      interests,
      aesthetics,
      favorites: [],
      clothingSizes: { top: topSize, bottom: bottomSize, shoe: shoeSize },
    };
    try {
      if (existing) {
        await updateFriend(existing.id, data);
        navigate(`/friend/${existing.id}`);
      } else {
        const newId = await addFriend(data);
        navigate(newId ? `/friend/${newId}` : '/');
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">
          {existing ? 'Edit Friend' : 'Add a Friend'}
        </h2>
        <FlowerAccent variant="small" className="w-7 h-7" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Basic Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Their name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} required />
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Clothing Sizes</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="top">Top</Label>
              <Input id="top" value={topSize} onChange={e => setTopSize(e.target.value)} placeholder="S, M, L..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bottom">Bottom</Label>
              <Input id="bottom" value={bottomSize} onChange={e => setBottomSize(e.target.value)} placeholder="28, 30..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shoe">Shoe</Label>
              <Input id="shoe" value={shoeSize} onChange={e => setShoeSize(e.target.value)} placeholder="8, 9..." />
            </div>
          </div>
        </section>

        {/* Interests */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Interests & Hobbies</h3>
          <div className="flex gap-2">
            <Input
              value={interestInput}
              onChange={e => setInterestInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(interestInput, interests, setInterests, setInterestInput))}
              placeholder="Type and press Enter..."
            />
            <Button type="button" variant="outline" size="sm" onClick={() => addTag(interestInput, interests, setInterests, setInterestInput)}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-sm px-3 py-1 border border-border rounded-full">
                {tag}
                <button type="button" onClick={() => setInterests(interests.filter(t => t !== tag))}>
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Aesthetics */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Aesthetic Preferences</h3>
          <div className="flex gap-2">
            <Input
              value={aestheticInput}
              onChange={e => setAestheticInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(aestheticInput, aesthetics, setAesthetics, setAestheticInput))}
              placeholder="Cottagecore, minimalist, vintage..."
            />
            <Button type="button" variant="outline" size="sm" onClick={() => addTag(aestheticInput, aesthetics, setAesthetics, setAestheticInput)}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aesthetics.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-sm px-3 py-1 border border-border rounded-full">
                {tag}
                <button type="button" onClick={() => setAesthetics(aesthetics.filter(t => t !== tag))}>
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-4">
          <h3 className="font-serif text-lg text-muted-foreground">Notes</h3>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything else to remember about them..." rows={3} />
        </section>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="px-8">
            {existing ? 'Save Changes' : 'Add Friend'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFriend;
