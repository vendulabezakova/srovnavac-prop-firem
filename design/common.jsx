// Common small components shared across sections

function FirmAvatar({ firm, size = 'md' }) {
  const cls = `firm-avatar ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''}`;
  return (
    <span
      className={cls}
      style={{ background: `linear-gradient(135deg, ${firm.brand.from}, ${firm.brand.to})` }}
      aria-label={firm.name}
    >
      {firm.initials}
    </span>
  );
}

function SectionHead({ eyebrow, title, sub, num }) {
  return (
    <div className="section-head">
      <div className="h-eyebrow">
        {num && <span style={{ marginRight: 8, color: 'rgba(255,255,255,.4)' }}>0{num} —</span>}
        {eyebrow}
      </div>
      <h2 className="h1">{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function SentimentChip({ firm }) {
  const map = {
    positive: { cls: 'sent-pos', label: 'Pozitivní', icon: '▲' },
    mixed:    { cls: 'sent-mix', label: 'Smíšený', icon: '◆' },
    negative: { cls: 'sent-neg', label: 'Negativní', icon: '▼' }
  };
  const s = map[firm.sentiment] || map.mixed;
  return (
    <span
      className={s.cls}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
    >
      <span style={{ fontSize: 10 }}>{s.icon}</span>
      {s.label} · {firm.sentimentScore}
    </span>
  );
}

window.FirmAvatar = FirmAvatar;
window.SectionHead = SectionHead;
window.SentimentChip = SentimentChip;
