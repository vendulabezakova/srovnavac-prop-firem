// Section Reviews — full feed per firmu, s filtrem.
// Defaultně zobrazí top-firma; chips přepínají na ostatní.

function SectionReviews({ topIds, selectedFirmId, onSelectFirm }) {
  const firms = window.PROP_FIRMS;
  const { FirmAvatar } = window;

  // Resolve active firm — fallback na první z topIds, pak na první firmu
  const activeId = selectedFirmId || topIds[0] || firms[0]?.id;
  const activeFirm = firms.find(f => f.id === activeId);
  const reviews = window.reviewsFor(activeId);

  // Date parse for sort
  const parseDate = (s) => {
    const m = String(s).match(/(\d+)\.\s*(\d+)\.\s*(\d+)/);
    if (!m) return 0;
    return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
  };
  const sortedReviews = [...reviews].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Order firm chips: top firms first, then rest
  const orderedFirms = React.useMemo(() => {
    const seen = new Set();
    const out = [];
    (topIds || []).forEach(id => {
      const f = firms.find(x => x.id === id);
      if (f && !seen.has(id)) { out.push(f); seen.add(id); }
    });
    firms.forEach(f => { if (!seen.has(f.id)) { out.push(f); seen.add(f.id); } });
    return out;
  }, [firms, topIds]);

  return (
    <section id="recenze" className="reviews-section" data-screen-label="03 Recenze">
      <div className="container">

        <div className="news-head">
          <div className="h-eyebrow">03 — RECENZE</div>
          <h2 className="cmp-h1" style={{ marginTop: 14 }}>
            Co o firmách <span className="accent-gradient">říkají reální traders</span>.
          </h2>
          <p className="cmp-sub" style={{ maxWidth: 580, fontSize: 15 }}>
            Agregované recenze z Trustpilotu, Redditu a Twitteru. Vyber firmu níže pro zobrazení jejího feedu.
          </p>
        </div>

        {/* Firm filter chips */}
        <div className="reviews-chips">
          {orderedFirms.map((f) => {
            const isTop3 = (topIds || []).slice(0, 3).includes(f.id);
            return (
              <button
                key={f.id}
                className={'review-chip' + (f.id === activeId ? ' is-on' : '')}
                onClick={() => onSelectFirm && onSelectFirm(f.id)}
              >
                <FirmAvatar firm={f} size="sm" />
                <span>{f.name}</span>
                {isTop3 && <span className="rc-top">TOP</span>}
              </button>
            );
          })}
        </div>

        {/* Active firm header */}
        {activeFirm && (
          <div className="reviews-head-card">
            <div className="rhc-firm">
              <FirmAvatar firm={activeFirm} size="lg" />
              <div>
                <div className="rhc-name">{activeFirm.name}</div>
                <div className="rhc-tag">{activeFirm.tagline}</div>
              </div>
            </div>
            <div className="rhc-stats">
              <div className="rhc-stat">
                <span className="rhc-stat-v">
                  <span style={{ color: 'var(--mkt-turquoise)' }}>{avgRating || '—'}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}> /5</span>
                </span>
                <span className="rhc-stat-l">{reviews.length} {reviews.length === 1 ? 'recenze' : reviews.length < 5 ? 'recenze' : 'recenzí'}</span>
              </div>
              <div className="rhc-stat">
                <span className="rhc-stat-v">{activeFirm.popularity}<span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}> /100</span></span>
                <span className="rhc-stat-l">Popularity score</span>
              </div>
              <div className="rhc-stat">
                <span className="rhc-stat-v">{activeFirm.supportRating}<span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}> /5</span></span>
                <span className="rhc-stat-l">Support quality</span>
              </div>
            </div>
          </div>
        )}

        {/* Reviews grid */}
        <div className="reviews-grid">
          {sortedReviews.length === 0
            ? <div className="news-empty">Pro tuto firmu zatím nemáme dostatek recenzí.</div>
            : sortedReviews.map((r, i) => (
              <article key={i} className="review-card">
                <div className="rev-head">
                  <div className="rev-stars" aria-label={`${r.rating} hvězd z 5`}>
                    {'★'.repeat(r.rating)}<span className="rev-stars-empty">{'★'.repeat(5 - r.rating)}</span>
                  </div>
                  <span className={'rev-source rev-source-' + r.source.toLowerCase()}>{r.source}</span>
                </div>
                <p className="rev-text">„{r.text}"</p>
                <div className="rev-foot">
                  <span className="rev-author">{r.author}</span>
                  <span className="rev-date">{r.date}</span>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

window.SectionReviews = SectionReviews;
