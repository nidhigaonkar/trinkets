import { useFriends } from '@/hooks/useFriends';
import FriendCard from '@/components/FriendCard';
import FlowerAccent from '@/components/FlowerAccent';
import { Link } from 'react-router-dom';
import { Plus, Gift, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

function daysUntilBirthday(birthday: string): number {
  const today = new Date();
  const bday = new Date(birthday);
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const Dashboard = () => {
  const { friends } = useFriends();

  const upcomingBirthdays = [...friends]
    .filter(f => f.birthday)
    .sort((a, b) => daysUntilBirthday(a.birthday) - daysUntilBirthday(b.birthday))
    .slice(0, 5);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="flex justify-center mb-4">
          <FlowerAccent variant="divider" className="w-48 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-4xl font-semibold tracking-tight mb-2">
          Your <em>thoughtful</em> gift companion
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Keep track of your loved ones' interests and never give a forgettable gift again.
        </p>
      </div>

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <h3 className="font-serif text-lg text-muted-foreground">Upcoming Birthdays</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {upcomingBirthdays.map(friend => {
              const days = daysUntilBirthday(friend.birthday);
              return (
                <Link
                  key={friend.id}
                  to={`/friend/${friend.id}`}
                  className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border border-border rounded-md bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                    <span className="font-serif text-xs">{friend.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {days === 0 ? 'Today! 🎂' : `in ${days} day${days !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Friends Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg text-muted-foreground">
            Friends ({friends.length})
          </h3>
          <Link to="/add">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Friend
            </Button>
          </Link>
        </div>

        {friends.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-md">
            <FlowerAccent variant="corner" className="w-20 h-20 mx-auto mb-4 opacity-40" />
            <p className="font-serif text-xl mb-2">No friends yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first friend to start tracking gift ideas.
            </p>
            <Link to="/add">
              <Button variant="outline">Add a Friend</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {friends.map((friend, i) => (
              <div key={friend.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <FriendCard friend={friend} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
