// SECTION 3 — Porovnej své atributy
// Weighted ranker: user toggles which attributes matter + sets weight (1×/2×/3×).
// Firms are scored on a normalized 0–100 scale and ranked.

function SectionAttributes({ highlight }) {
  const firms = window.PROP_FIRMS;
  const attrs = window.ATTRIBUTES;
  const { FirmAvatar, SectionHead } = window;

  // Default selection — pick a balanced 4-attribute starter set
  const defaultPrefs = {
    challengePrice:  { on: true,  w: 3 },
    payoutSplit:     { on: true,  w: 3 },
    maxOverallDD:    { on: true,  w: 2 },
    profitTargetP1:  { on: false, w: 2 },
    firstPayoutDays: { on: true,  w: 1 },
    steps:           { on: false, w: 1 },
    popularity:      { on: false, w: 1 },
    supportRating:   { on: false, w: 1 },
    refundable:      { on: false, w: 1 },
    weekendHolding:  { on: false, w: 1 },
    mobileApp:       { on: false, w: 1 },
    loyaltyProgram:  { on: false, w: 1 }
  };

  const [prefs, setPrefs] = React.useState(defaultPrefs);

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: { ...p[key], on: !p[key].on } }));
  }
  function setWeight(key, w) {
    setPrefs(p => ({ ...p, [key]: { on: true, w } }));
  }
  function reset() {
    setPrefs(defaultPrefs);
  }

  // -- Scoring ---------------------------------------------------------------
  // For each active attribute: normalize across firms to 0–1, multiply by weight.
  // Sum / total weight → 0–100 score.
  const activeAttrs = attrs.filter(a => prefs[a.key].on);

  function score(firm) {
    if (activeAttrs.length === 0) return 50; // neutral baseline
    let total = 0, sumW = 0;
    for (const a of activeAttrs) {
      const w = prefs[a.key].w;
      let s = 0;
      if (a.direction === 'bool') {
        s = firm[a.key] ? 1 : 0;
      } else {
        const vals = firms.map(f => f[a.key]);
        const min = Math.min(...vals), max = Math.max(...vals);
        if (max === min) s = 1;
        else s = a.direction === 'lower'
          ? (max - firm[a.key]) / (max - min)
          : (firm[a.key] - min) / (max - min);
      }
      total += s * w;
      sumW  += w;
    }
    return Math.round((total / sumW) * 100);
  }

  const ranked = firms
    .map(f => ({ firm: f, score: score(f) }))
    .sort((a, b) => b.score - a.score);

  const activeCount = activeAttrs.length;

  return (
    <section id="porovnej" className="section">
      <div className="container">
        <SectionHead
          num="3"
          eyebrow="Tvůj vlastní žebříček"
          title={<>Vyber, co tobě <span className="accent-gradient">opravdu záleží</span>.</>}
          sub="Zaškrtni atributy, nastav jejich váhu — a my seřadíme firmy podle TVÉHO profilu. Žádné univerzální TOP 10. Tvůj žebříček, tvoje pravidla."
        />

        <div className="s3-grid">
          {/* ---- Left: attribute controls ---- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                  Tvoje preference
                  <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--mkt-turquoise)' }}>
                    {activeCount} aktivních
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>
                  Vlevo zapni, vpravo nastav váhu
                </div>
              </div>
              <button onClick={reset} className="btn btn-outline btn-sm" style={{ padding: '8px 14px', fontSize: 11 }}>
                RESET
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attrs.map(a => {
                const p = prefs[a.key];
                return (
                  <div key={a.key} className={'attr-row ' + (p.on ? 'is-on' : 'is-off')}>
                    <button
                      onClick={() => toggle(a.key)}
                      aria-pressed={p.on}
                      style={{
                        width: 22, height: 22, borderRadius: 8,
                        border: '1.5px solid ' + (p.on ? 'transparent' : 'rgba(255,255,255,.3)'),
                        background: p.on ? 'var(--mkt-gradient)' : 'transparent',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, padding: 0
                      }}
                    >
                      {p.on && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6.5L4.8 9L10 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="attr-label" style={{ opacity: p.on ? 1 : .55 }}>{a.label}</div>
                      <div className="attr-hint">{a.hint}</div>
                    </div>
                    <WeightSegment
                      value={p.w}
                      disabled={!p.on}
                      onChange={(w) => setWeight(a.key, w)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- Right: leaderboard ---- */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                Žebříček podle tvého profilu
                <span style={{ marginLeft: 10, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
                  {firms.length} firem · živé skóre
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Skóre 0–100
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ranked.map((r, i) => {
                const isWinner = i === 0;
                const isUser = r.firm.id === highlight;
                return (
                  <div
                    key={r.firm.id}
                    className={'rank-card' + (isWinner ? ' is-winner' : '')}
                  >
                    <div className="rank-num">{i + 1}</div>
                    <div className="rank-firm">
                      <FirmAvatar firm={r.firm} />
                      <div>
                        <div className="firm-name">
                          {r.firm.name}
                          {isUser && (
                            <span className="pill" style={{ marginLeft: 8, background: 'var(--mkt-gradient)', color: '#fff' }}>VAŠE</span>
                          )}
                          {isWinner && !isUser && (
                            <span className="pill" style={{ marginLeft: 8, background: 'rgba(31,211,220,.18)', color: 'var(--mkt-turquoise)', border: '1px solid rgba(31,211,220,.4)' }}>VÍTĚZ</span>
                          )}
                        </div>
                        <div className="firm-tag">{r.firm.phasesLabel} · payout {r.firm.payoutSplit}% · ${r.firm.challengePrice}</div>
                      </div>
                    </div>
                    <div className="rank-bar-wrap" style={{ minWidth: 0 }}>
                      <div className="score-bar"><span style={{ width: `${r.score}%` }}></span></div>
                      <ScoreReasons firm={r.firm} prefs={prefs} attrs={attrs} firms={firms} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="rank-score-pct accent-gradient">{r.score}</div>
                      <div className="rank-score-label">match</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeCount === 0 && (
              <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: 'rgba(255,255,255,.04)', border: '1px dashed rgba(255,255,255,.18)', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                Zatím jsi nezvolil žádný atribut — vyber alespoň jeden a žebříček ožije.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// 1× / 2× / 3× segmented weight control
function WeightSegment({ value, onChange, disabled }) {
  const opts = [1, 2, 3];
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: 3,
        borderRadius: 999,
        background: 'rgba(255,255,255,.06)',
        opacity: disabled ? .4 : 1,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
    >
      {opts.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            border: 0, padding: '4px 10px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
            cursor: 'pointer',
            background: value === o ? 'var(--mkt-gradient)' : 'transparent',
            color: value === o ? '#fff' : 'rgba(255,255,255,.55)',
            transition: 'all .15s'
          }}
        >
          {o}×
        </button>
      ))}
    </div>
  );
}

// Show top 2 reasons this firm matched (or didn't) — small subtitle under bar
function ScoreReasons({ firm, prefs, attrs, firms }) {
  const active = attrs.filter(a => prefs[a.key].on);
  if (active.length === 0) return null;

  const contribs = active.map(a => {
    const w = prefs[a.key].w;
    let s = 0;
    if (a.direction === 'bool') {
      s = firm[a.key] ? 1 : 0;
    } else {
      const vals = firms.map(f => f[a.key]);
      const min = Math.min(...vals), max = Math.max(...vals);
      if (max === min) s = 1;
      else s = a.direction === 'lower'
        ? (max - firm[a.key]) / (max - min)
        : (firm[a.key] - min) / (max - min);
    }
    return { attr: a, s, w, contribution: s * w };
  });
  // top 2 strongest contributions
  contribs.sort((x, y) => y.contribution - x.contribution);
  const top = contribs.slice(0, 2);

  return (
    <div style={{ marginTop: 8, display: 'flex', gap: 14, fontSize: 11, color: 'rgba(255,255,255,.5)', flexWrap: 'wrap', minWidth: 0 }}>
      {top.map(c => (
        <span key={c.attr.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: c.s > .6 ? 'var(--mkt-turquoise)' : c.s > .3 ? '#fbbf24' : 'var(--mkt-pink)' }}></span>
          {c.attr.label.replace(/^(Nízká |Vysoký |Velkorysý |Rychlá |Méně |Vrátitelný |Vícejazyčná |Pozitivní |Držení )/, '')}: <strong style={{ color: '#fff', fontWeight: 600 }}>{c.attr.format(firm[c.attr.key])}</strong>
        </span>
      ))}
    </div>
  );
}

window.SectionAttributes = SectionAttributes;
