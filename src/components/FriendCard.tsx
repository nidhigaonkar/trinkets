import { Link } from 'react-router-dom';
import { Calendar, Heart } from 'lucide-react';
import { Friend } from '@/types/friend';
import FlowerAccent from './FlowerAccent';

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
  const days = daysUntilBirthday(friend.birthday);
  const isUpcoming = days <= 30;

  return (
    <Link
      to={`/friend/${friend.id}`}
      className="group relative block border border-border bg-card p-6 transition-all duration-300 hover:shadow-sm"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <FlowerAccent variant="corner" className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-90" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-card-foreground tracking-tight">
            {friend.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{friend.relationship}</p>
        </div>
        {friend.avatarUrl ? (
          <img src={friend.avatarUrl} alt={friend.name} className="w-10 h-10 rounded-full object-cover border border-border" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-serif text-sm text-secondary-foreground">
              {friend.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>{formatBirthday(friend.birthday)}</span>
        {isUpcoming && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-cream rounded-full flex items-center gap-1">
            <Heart className="w-3 h-3 text-dusty-rose" strokeWidth={1.5} />
            {days}d
          </span>
        )}
      </div>

      {friend.interests.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {friend.interests.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 border border-border text-muted-foreground rounded-full">
              {tag}
            </span>
          ))}
          {friend.interests.length > 4 && (
            <span className="text-xs px-2.5 py-1 text-muted-foreground">
              +{friend.interests.length - 4}
            </span>
          )}
        </div>
      )}

      {friend.giftHistory.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
          {friend.giftHistory.length} gift{friend.giftHistory.length !== 1 ? 's' : ''} given
        </p>
      )}
    </Link>
  );
};

export default FriendCard;
