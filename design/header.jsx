// Top nav + hero + sub-nav

function TopNav() {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,0,26,.78)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div className="container top-nav-inner">
        <a href="#" className="top-nav-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.2 8.5L21 9.3L16 13.9L17.4 21L12 17.3L6.6 21L8 13.9L3 9.3L9.8 8.5L12 2Z" fill="url(#g1)"/>
            <defs>
              <linearGradient id="g1" x1="3" y1="2" x2="21" y2="21">
                <stop offset="0" stopColor="#6B03E5"/>
                <stop offset="1" stopColor="#F815B3"/>
              </linearGradient>
            </defs>
          </svg>
          <span>fintokei<span style={{ color: 'var(--mkt-turquoise)' }}>.ai</span></span>
          <span className="pill pill-violet nav-beta-pill">BETA</span>
        </a>
        <div className="nav-links">
          {[
            ['Srovnávač', '#'],
            ['Programy', '#'],
            ['Blog', '#'],
            ['Pro firmy', '#']
          ].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.78)' }}>{label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn btn-outline btn-sm nav-login">PŘIHLÁŠENÍ</button>
          <button className="btn btn-gradient btn-sm">VYZKOUŠET ZDARMA</button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const firms = window.PROP_FIRMS;
  return (
    <section className="hero-section">
      <div className="container" style={{ position: 'relative' }}>
        <div className="h-eyebrow" style={{ marginBottom: 18 }}>
          <span className="pink-glow-dot" style={{ display: 'inline-block', marginRight: 8 }}></span>
          PROP FIRM FINDER · ŽIVÁ DATA
        </div>
        <h1 className="h-display" style={{ margin: 0, maxWidth: 1000 }}>
          Najdi prop firmu, která <span className="accent-gradient">opravdu sedí</span> tvému stylu.
        </h1>
        <p className="hero-sub">
          Porovnej osm největších prop firem podle <strong style={{ color: '#fff' }}>ceny výzvy</strong>, <strong style={{ color: '#fff' }}>payout %</strong> a <strong style={{ color: '#fff' }}>max drawdownu</strong> v jedné tabulce. Pak nastav, co tobě záleží — a uvidíš seřazený žebříček.
        </p>

        <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#srovnani" className="btn btn-gradient btn-lg">
            ZAČÍT POROVNÁVAT <span style={{ marginLeft: 4 }}>→</span>
          </a>
          <a href="#novinky" className="btn btn-outline btn-lg">PŘEČÍST NOVINKY</a>
        </div>

        <div className="stat-strip">
          <div className="stat">
            <div className="v accent-gradient">{firms.length}</div>
            <div className="l">Sledovaných firem</div>
          </div>
          <div className="stat">
            <div className="v accent-turquoise">10</div>
            <div className="l">Atributů k filtru</div>
          </div>
          <div className="stat">
            <div className="v">$79–$235</div>
            <div className="l">Rozsah cen výzev</div>
          </div>
          <div className="stat">
            <div className="v">15. 5. 2026</div>
            <div className="l">Poslední aktualizace</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubNav({ active }) {
  // hashchange scroll-spy
  const [a, setA] = React.useState(active || 'novinky');
  React.useEffect(() => {
    const onScroll = () => {
      const sections = ['novinky', 'srovnani', 'porovnej'];
      const offsets = sections.map(id => {
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top } : null;
      }).filter(Boolean);
      const active = offsets.reduce((acc, s) => (s.top <= 200 ? s : acc), offsets[0]);
      if (active) setA(active.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="section-nav">
      <div className="container">
        {[
          ['novinky',  'Novinky', 1],
          ['srovnani', 'Cenové srovnání', 2],
          ['porovnej', 'Porovnej své atributy', 3]
        ].map(([id, label, num]) => (
          <a key={id} href={`#${id}`} className={a === id ? 'active' : ''}>
            <span className="num">{num}</span> {label}
          </a>
        ))}
      </div>
    </div>
  );
}

window.TopNav = TopNav;
window.Hero = Hero;
window.SubNav = SubNav;
