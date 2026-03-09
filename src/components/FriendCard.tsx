import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Friend } from '@/types/friend';

function daysUntilBirthday(birthday: string): number {
  const today = new Date();
  const bday = new Date(birthday);
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatBirthday(birthday: string): string {
  return new Date(birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

const FriendCard = ({ friend }: { friend: Friend }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const days = daysUntilBirthday(friend.birthday);
  const isUpcoming = days <= 30;

  const handleClick = () => {
    setIsFlipped(prev => !prev);
  };

  const handleDoubleClick = () => {
    navigate(`/friend/${friend.id}`);
  };

  return (
    <div
      className="perspective-1000 w-full aspect-square cursor-pointer select-none max-w-[200px]"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-2 hover:shadow-sm transition-shadow">
          {friend.avatarUrl ? (
            <img src={friend.avatarUrl} alt={friend.name} className="w-12 h-12 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <span className="font-serif text-xl text-secondary-foreground">
                {friend.name.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="font-serif text-xl font-semibold text-card-foreground tracking-tight text-center">
            {friend.name}
          </h3>
          {friend.birthday && (
            <p className="text-xs text-muted-foreground">{formatBirthday(friend.birthday)}</p>
          )}
          {isUpcoming && (
            <span className="text-xs px-2.5 py-0.5 bg-cream rounded-full flex items-center gap-1">
              <Heart className="w-3 h-3 text-dusty-rose" strokeWidth={1.5} />
              {days === 0 ? 'Today! 🎂' : `${days}d away`}
            </span>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-border bg-card p-5 flex flex-col overflow-hidden">
          <h3 className="font-serif text-lg font-semibold text-card-foreground tracking-tight mb-3 text-center">
            {friend.name}
          </h3>

          {friend.interests.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {friend.interests.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 border border-border text-muted-foreground rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {friend.aesthetics.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Aesthetics</p>
              <div className="flex flex-wrap gap-1.5">
                {friend.aesthetics.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 border border-border text-muted-foreground rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {friend.notes && (
            <div className="mt-auto">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Notes</p>
              <p className="text-xs text-card-foreground line-clamp-3">{friend.notes}</p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center mt-3 pt-2 border-t border-border">
            Double-click to view full profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
