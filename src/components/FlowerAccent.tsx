const FlowerAccent = ({ className = "", variant = "corner" }: { className?: string; variant?: "corner" | "divider" | "small" }) => {
  if (variant === "divider") {
    return (
      <svg className={className} viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="12" x2="70" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <g transform="translate(85, 2)" opacity="0.4">
          <ellipse cx="15" cy="8" rx="4" ry="6" transform="rotate(-20 15 8)" stroke="hsl(var(--dusty-rose))" strokeWidth="0.7" fill="none" />
          <ellipse cx="15" cy="8" rx="4" ry="6" transform="rotate(20 15 8)" stroke="hsl(var(--sage-green))" strokeWidth="0.7" fill="none" />
          <circle cx="15" cy="8" r="1.5" fill="hsl(var(--soft-taupe))" opacity="0.5" />
        </g>
        <line x1="130" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>
    );
  }

  if (variant === "small") {
    return (
      <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="10" rx="3" ry="5" transform="rotate(-25 15 10)" stroke="hsl(var(--sage-green))" strokeWidth="0.6" fill="none" opacity="0.5" />
        <ellipse cx="15" cy="10" rx="3" ry="5" transform="rotate(25 15 10)" stroke="hsl(var(--dusty-rose))" strokeWidth="0.6" fill="none" opacity="0.5" />
        <circle cx="15" cy="10" r="1" fill="hsl(var(--soft-taupe))" opacity="0.4" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 75C5 75 15 55 25 40C35 25 50 15 50 15" stroke="hsl(var(--sage-green))" strokeWidth="0.7" fill="none" opacity="0.35" />
      <path d="M15 70C15 70 20 55 30 42C40 29 55 22 55 22" stroke="hsl(var(--sage-green))" strokeWidth="0.5" fill="none" opacity="0.25" />
      <ellipse cx="50" cy="15" rx="6" ry="9" transform="rotate(-30 50 15)" stroke="hsl(var(--dusty-rose))" strokeWidth="0.7" fill="none" opacity="0.35" />
      <ellipse cx="55" cy="22" rx="5" ry="8" transform="rotate(-10 55 22)" stroke="hsl(var(--dusty-rose))" strokeWidth="0.6" fill="none" opacity="0.3" />
      <ellipse cx="44" cy="20" rx="4" ry="7" transform="rotate(-50 44 20)" stroke="hsl(var(--dusty-rose))" strokeWidth="0.6" fill="none" opacity="0.25" />
      <circle cx="50" cy="18" r="2" fill="hsl(var(--soft-taupe))" opacity="0.3" />
      <path d="M25 60C25 60 22 55 20 48" stroke="hsl(var(--sage-green))" strokeWidth="0.5" fill="none" opacity="0.2" />
      <ellipse cx="20" cy="46" rx="3" ry="5" transform="rotate(-20 20 46)" stroke="hsl(var(--dusty-rose))" strokeWidth="0.5" fill="none" opacity="0.2" />
    </svg>
  );
};

export default FlowerAccent;
