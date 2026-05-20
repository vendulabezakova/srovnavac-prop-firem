// Novinky — karty per firma, seřazené chronologicky.
// Filter chips: All / Tvé top 3 / per firma.

function SectionNews({ topIds }) {
  const firms = window.PROP_FIRMS;
  const { FirmAvatar } = window;

  const [filter, setFilter] = React.useState('top3');

  const items = React.useMemo(() => {
    let pool = firms.filter(f => f.news);
    if (filter === 'top3' && topIds && topIds.length) {
      pool = pool.filter(f => topIds.includes(f.id));
    } else if (filter !== 'all' && filter !== 'top3') {
      pool = pool.filter(f => f.id === filter);
    }
    // Parse Czech date "dd. m. yyyy" — used only for sort ordering
    const parseDate = (s) => {
      const m = s.match(/(\d+)\.\s*(\d+)\.\s*(\d+)/);
      if (!m) return 0;
      return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
    };
    return pool.slice().sort((a, b) => parseDate(b.news.date) - parseDate(a.news.date));
  }, [firms, filter, topIds]);

  return (
    <section id="novinky" className="section news-section" data-screen-label="03 Novinky">
      <div className="container">

        <div className="news-head">
          <div>
            <div className="h-eyebrow">03 — NOVINKY ZE SCÉNY</div>
            <h2 className="cmp-h1" style={{ marginTop: 14 }}>
              Co se <span className="accent-gradient">právě teď</span> děje u tvých firem.
            </h2>
            <p className="cmp-sub" style={{ maxWidth: 560, fontSize: 15 }}>
              Pravidla se mění týdně. Sledujeme změny payoutu, nové programy, slevové akce i kritické updaty u všech sledovaných firem.
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="news-chips">
          <button
            className={'chip' + (filter === 'top3' ? ' is-on' : '')}
            onClick={() => setFilter('top3')}
          >Tvé top 3</button>
          <button
            className={'chip' + (filter === 'all' ? ' is-on' : '')}
            onClick={() => setFilter('all')}
          >Všechny firmy</button>
          <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', margin: '0 6px' }}></span>
          {firms.filter(f => f.news).map(f => (
            <button
              key={f.id}
              className={'chip' + (filter === f.id ? ' is-on' : '')}
              onClick={() => setFilter(f.id)}
            >{f.name}</button>
          ))}
        </div>

        {/* News grid */}
        <div className="news-grid">
          {items.length === 0
            ? <div className="news-empty">Zatím žádné novinky v tomto filtru.</div>
            : items.map(f => (
              <article key={f.id} className="news-card">
                <div className="news-meta">
                  <span className="news-tag" style={{ background: `linear-gradient(90deg, ${f.brand.from}, ${f.brand.to})` }}>{f.news.tag}</span>
                  <span>{f.news.date}</span>
                </div>
                <h3 className="news-title">{f.news.headline}</h3>
                <div className="news-foot">
                  <div className="news-firm">
                    <FirmAvatar firm={f} size="sm" />
                    <span>{f.name}</span>
                  </div>
                  <a href="#" className="read-more" onClick={(e) => e.preventDefault()}>
                    Číst víc →
                  </a>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

window.SectionNews = SectionNews;
