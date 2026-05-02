import FlowerAccent from '@/components/FlowerAccent';
import { useSettings, type BackgroundOption } from '@/hooks/useSettings';
import { Check } from 'lucide-react';

const bgOptions: { value: BackgroundOption; label: string; preview: string }[] = [
  { value: 'none', label: 'Clean', preview: 'bg-background border-2 border-dashed border-border' },
  { value: 'floral', label: 'Classic Floral', preview: 'bg-[url("/floral-preview.svg")] bg-muted' },
  { value: 'floral-colored', label: 'Pink Roses', preview: 'bg-gradient-to-br from-pink-100 to-rose-50' },
  { value: 'dots', label: 'Soft Dots', preview: 'bg-[radial-gradient(circle,hsl(var(--muted-foreground)/0.15)_1px,transparent_1px)] bg-[length:12px_12px] bg-muted' },
  { value: 'grid', label: 'Subtle Grid', preview: 'bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[length:24px_24px] bg-background' },
  { value: 'stars', label: 'Night Sky', preview: 'bg-[radial-gradient(circle_at_25%_25%,hsl(var(--muted-foreground)/0.3)_1px,transparent_1px),radial-gradient(circle_at_75%_75%,hsl(var(--muted-foreground)/0.3)_1.5px,transparent_1.5px)] bg-[length:30px_30px] bg-muted' },
  { value: 'waves', label: 'Soft Waves', preview: 'bg-[radial-gradient(circle_at_50%_0,transparent_45%,hsl(var(--muted-foreground)/0.15)_50%,transparent_55%)] bg-[length:20px_10px] bg-muted' },
  { value: 'blueprint', label: 'Blueprint', preview: 'bg-[#f1f5f9] bg-[linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] bg-[length:10px_10px]' },
  { value: 'circuit', label: 'Circuit', preview: 'bg-[#f8fafc] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-[length:10px_10px]' },
];

const SettingsPage = () => {
  const { settings, setBackground } = useSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">Settings</h2>
        <FlowerAccent variant="small" className="w-7 h-7" />
      </div>

      <div className="space-y-6">
        {/* Background Selection */}
        <div className="border border-border rounded-md p-6 bg-card">
          <h3 className="font-serif text-lg mb-4">Background</h3>
          <div className="flex flex-wrap gap-4">
            {bgOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setBackground(opt.value)}
                className="group flex flex-col items-center gap-2 w-16"
              >
                <div
                  className={`w-14 h-14 rounded-md transition-all ${opt.preview} ${
                    settings.background === opt.value
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'ring-1 ring-border hover:ring-muted-foreground'
                  } flex items-center justify-center`}
                >
                  {settings.background === opt.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-md p-6 bg-card">
          <h3 className="font-serif text-lg mb-2">About Trinkets</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A thoughtful gift-tracking companion. Keep track of your friends' interests,
            save inspiration, and get AI-powered gift suggestions — all in one beautiful place.
          </p>
        </div>

        <div className="border border-border rounded-md p-6 bg-card">
          <h3 className="font-serif text-lg mb-2">Data</h3>
          <p className="text-sm text-muted-foreground">
            Your friends, wishlist, and saved inspiration are securely stored in your account
            and synced across devices when you sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
