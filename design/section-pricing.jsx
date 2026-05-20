// SECTION 2 — Cenové srovnání
// Clean side-by-side table. Highlight the user's preferred firm row.
// Mark the LEADER in each metric column with a small "best" chip.

function SectionPricing({ highlight }) {
  const firms = window.PROP_FIRMS;
  const { FirmAvatar, SectionHead } = window;

  // Column definitions (with direction so we know what "best" means)
  const cols = [
    { key: 'challengePrice', label: 'Cena výzvy',    dir: 'lower', render: (v) => `$${v}` },
    { key: 'payoutSplit',    label: 'Payout split',  dir: 'higher', render: (v) => `${v} %` },
    { key: 'maxOverallDD',   label: 'Max drawdown',  dir: 'higher', render: (v) => `${v} %` },
    { key: 'profitTargetP1', label: 'Profit target', dir: 'lower', render: (v) => `${v} %` },
    { key: 'firstPayoutDays',label: '1. výplata',    dir: 'lower', render: (v) => `${v} dní` },
    { key: 'phasesLabel',    label: 'Fáze',          dir: 'static', render: (v) => v }
  ];

  // Compute leader value per column
  const leaders = {};
  cols.forEach(c => {
    if (c.dir === 'static') return;
    const vals = firms.map(f => f[c.key]);
    leaders[c.key] = c.dir === 'lower' ? Math.min(...vals) : Math.max(...vals);
  });

  // Sort: highlighted firm at top, then by challenge price asc
  const sorted = [...firms].sort((a, b) => {
    if (a.id === highlight) return -1;
    if (b.id === highlight) return 1;
    return a.challengePrice - b.challengePrice;
  });

  // Optional: toggle which firm is the "winner" highlight via a small inline picker
  const [view, setView] = React.useState('cena'); // cena | payout | dd
  // For now `view` is purely informational — we can wire it to scroll the focused column

  return (
    <section id="srovnani" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(43,0,100,.18))' }}>
      <div className="container">
        <SectionHead
          num="2"
          eyebrow="Cenové srovnání"
          title={<>Stejná výzva, <span className="accent-gradient">$25 000 účet</span>. Kdo si bere kolik.</>}
          sub="Cena, payout %, maximální drawdown a profit target vedle sebe. Nejlepší hodnota v každém sloupci je označená."
        />

        <div style={{ overflowX: 'auto', borderRadius: 18, border: '1px solid rgba(255,255,255,.06)', padding: '4px 8px 12px', background: 'rgba(255,255,255,.015)' }}>
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ minWidth: 220, paddingLeft: 24 }}>Firma</th>
                {cols.map(c => (
                  <th key={c.key} style={{ textAlign: c.key === 'phasesLabel' ? 'left' : 'right' }}>
                    {c.label}
                  </th>
                ))}
                <th style={{ textAlign: 'right', paddingRight: 24 }}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(f => {
                const isHi = f.id === highlight;
                return (
                  <tr key={f.id} className={isHi ? 'row-highlight' : ''}>
                    <td style={{ paddingLeft: 24 }}>
                      <div className="firm-cell">
                        <FirmAvatar firm={f} />
                        <div>
                          <div className="firm-name">
                            {f.name}
                            {isHi && (
                              <span className="pill" style={{ marginLeft: 10, background: 'var(--mkt-gradient)', color: '#fff', verticalAlign: 'middle' }}>VAŠE</span>
                            )}
                          </div>
                          <div className="firm-tag">{f.tagline}</div>
                        </div>
                      </div>
                    </td>
                    {cols.map(c => {
                      const v = f[c.key];
                      const isLeader = c.dir !== 'static' && v === leaders[c.key];
                      const align = c.key === 'phasesLabel' ? 'left' : 'right';
                      return (
                        <td key={c.key} style={{ textAlign: align, fontVariantNumeric: 'tabular-nums' }}>
                          <span style={{ fontSize: 16, fontWeight: 600, color: isLeader ? 'var(--mkt-turquoise)' : '#fff' }}>
                            {c.render(v)}
                          </span>
                          {isLeader && <span className="leader-mark" title="Nejlepší v kategorii">★</span>}
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'right', paddingRight: 24 }}>
                      <a
                        href="#"
                        className="btn btn-sm"
                        style={
                          isHi
                            ? { background: 'var(--mkt-gradient)', color: '#fff' }
                            : { background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.18)' }
                        }
                      >
                        {isHi ? 'KOUPIT VÝZVU' : 'WEB'}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,.5)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <span><span className="leader-mark" style={{ marginRight: 8, marginLeft: 0 }}>★</span>Nejlepší hodnota v kategorii</span>
          <span>Ceny v USD pro evaluační účet $25 000. Aktuální k 18. 5. 2026.</span>
        </div>
      </div>
    </section>
  );
}

window.SectionPricing = SectionPricing;
