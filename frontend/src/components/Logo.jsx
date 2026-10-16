export function Logo({ compact = false }) {
  return (
    <div className={`logo ${compact ? 'logo--compact' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" width="36" height="36" className="logo__mark">
        <rect x="1" y="1" width="38" height="38" rx="12" fill="currentColor" />
        <path
          d="M12 15.5c4.2-3.4 11.8-3.4 16 0"
          fill="none"
          stroke="#f6f1ea"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M14.5 20c2.8-2.1 8.2-2.1 11 0"
          fill="none"
          stroke="#f6f1ea"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="25.5" r="2.1" fill="#f6f1ea" />
      </svg>
      <span className="logo__word">Vexa</span>
    </div>
  );
}
