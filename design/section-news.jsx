// SECTION 1 — Novinky
// Grid of latest news/updates, one per firm. Optional category filter chips.

function SectionNews({ highlight }) {
  const firms = window.PROP_FIRMS;
  const { FirmAvatar, SectionHead, SentimentChip } = window;

  const tags = ['Vše', ...Array.from(new Set(firms.map(f => f.news.tag)))];
  const [active, setActive] = React.useState('Vše');

  const visible = active === 'Vše' ? firms : firms.filter(f => f.news.tag === active);

  return (
    <section id="novinky" className="section">
      <div className="container">
        <SectionHead
          num="1"
          eyebrow="Novinky z branže"
          title={<>Co se právě <span className="accent-gradient">děje u prop firem</span></>}
          sub="Latest updaty, akce a změny pravidel agregované přes Twitter/X a oficiální blogy. Aktualizováno denně."
        />

        <div className="chip-row">
          {tags.map(t => (
            <button
              key={t}
              className={'chip' + (active === t ? ' is-on' : '')}
              onClick={() => setActive(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {visible.map(f => {
            const isHi = highlight && f.id === highlight;
            return (
              <article
                key={f.id}
                className={'news-card' + (isHi ? ' glow-pink' : '')}
                style={isHi ? { borderColor: 'rgba(248,21,179,.5)' } : null}
              >
                <div className="news-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FirmAvatar firm={f} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>
                        {f.name}
                        {isHi && (
                          <span className="pill" style={{ marginLeft: 8, background: 'var(--mkt-gradient)', color: '#fff' }}>VAŠE</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{f.tagline}</div>
                    </div>
                  </div>
                  <span className="pill pill-violet">{f.news.tag}</span>
                </div>

                <div className="news-title">{f.news.headline}</div>

                <div style={{ height: 1, background: 'rgba(255,255,255,.08)' }}></div>

                <div className="news-foot">
                  <span style={{ color: 'rgba(255,255,255,.55)' }}>{f.news.date}</span>
                  <SentimentChip firm={f} />
                </div>

                <div className="news-foot" style={{ marginTop: -4 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.45, maxWidth: '70%' }}>
                    {f.sentimentSummary}
                  </span>
                  <a href="#" className="read-more">číst více →</a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

window.SectionNews = SectionNews;
