import FlowerAccent from '@/components/FlowerAccent';

const SettingsPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">Settings</h2>
        <FlowerAccent variant="small" className="w-7 h-7" />
      </div>

      <div className="space-y-6">
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
