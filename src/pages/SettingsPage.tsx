import FlowerAccent from '@/components/FlowerAccent';
import { useSettings, type BackgroundOption } from '@/hooks/useSettings';
import { Check } from 'lucide-react';

const bgOptions: { value: BackgroundOption; label: string; preview: string }[] = [
  { value: 'floral', label: 'Classic Floral', preview: 'bg-[url("/floral-preview.svg")] bg-muted' },
  { value: 'floral-colored', label: 'Pink Roses', preview: 'bg-gradient-to-br from-pink-100 to-rose-50' },
  { value: 'dots', label: 'Soft Dots', preview: 'bg-[radial-gradient(circle,hsl(var(--muted-foreground)/0.15)_1px,transparent_1px)] bg-[length:12px_12px] bg-muted' },
  { value: 'grid', label: 'Subtle Grid', preview: 'bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[length:24px_24px] bg-background' },
  { value: 'none', label: 'Clean', preview: 'bg-background border-2 border-dashed border-border' },
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
        <div className="border border-border rounded-md p-6">
          <h3 className="font-serif text-lg mb-4">Background</h3>
          <div className="grid grid-cols-5 gap-3">
            {bgOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setBackground(opt.value)}
                className="group flex flex-col items-center gap-2"
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

        <div className="border border-border rounded-md p-6">
          <h3 className="font-serif text-lg mb-2">About Trinkets</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A thoughtful gift-tracking companion. Keep track of your friends' interests,
            save inspiration, and get AI-powered gift suggestions — all in one beautiful place.
          </p>
        </div>

        <div className="border border-border rounded-md p-6">
          <h3 className="font-serif text-lg mb-2">Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            All data is stored locally in your browser. Nothing is sent to any server.
          </p>
          <button
            onClick={() => {
              if (confirm('This will delete all your data. Are you sure?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-sm text-destructive hover:underline"
          >
            Clear all data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
