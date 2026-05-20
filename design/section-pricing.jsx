// SECTION — Srovnávač prop firem (jediná sekce na stránce)
// Hlavní tabulka 12 sloupců, rozbalovací detail s 15 dalšími poli,
// seřazeno podle quiz score (firma s nejlepší shodou nahoře).

function SectionPricing({ accountSize, onAccountSize, answers, onEditQuiz, onTopIds }) {
  const firms = window.PROP_FIRMS;
  const sizes = window.ACCOUNT_SIZES;
  const { FirmAvatar } = window;

  const [openId, setOpenId] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);

  // Compute score for each firm based on quiz answers
  const scored = React.useMemo(() => {
    return firms.map(f => ({ firm: f, ...window.scoreFirm(f, answers) }));
  }, [firms, answers]);

  const sorted = React.useMemo(() => {
    return [...scored].sort((a, b) => b.score - a.score);
  }, [scored]);

  // Top 3 IDs — vystaveno parentům pro Novinky filter
  React.useEffect(() => {
    if (onTopIds) onTopIds(sorted.slice(0, 3).map(s => s.firm.id));
  }, [sorted, onTopIds]);

  const visible = showAll ? sorted : sorted.slice(0, 3);
  const hiddenCount = sorted.length - 3;

  // Multi-phase: zobrazit P2 sloupec jen když má aspoň jedna firma víc fází
  const hasMultiPhase = firms.some(f => f.profitTargetP2 != null);

  // Column definitions — order podle Vendyho spec
  const cols = React.useMemo(() => {
    const c = [
      { key: 'profitTargetP1', label: hasMultiPhase ? 'Profit target · F1' : 'Profit target', dir: 'lower',
        render: (f) => `${f.profitTargetP1}%`, val: (f) => f.profitTargetP1 }
    ];
    if (hasMultiPhase) {
      c.push({ key: 'profitTargetP2', label: 'Profit target · F2', dir: 'lower',
        render: (f) => f.profitTargetP2 != null ? `${f.profitTargetP2}%` : '—',
        val: (f) => f.profitTargetP2 });
    }
    c.push(
      { key: 'steps',          label: 'Steps',         dir: 'lower',  render: (f) => f.steps,                                              val: (f) => f.steps },
      { key: 'maxDailyDD',     label: 'Daily loss',    dir: 'higher', render: (f) => f.maxDailyDD === 0 ? '—' : `${f.maxDailyDD}%`,        val: (f) => f.maxDailyDD },
      { key: 'maxOverallDD',   label: 'Max loss',      dir: 'higher', render: (f) => `${f.maxOverallDD}%`,                                 val: (f) => f.maxOverallDD },
      { key: 'payoutSplit',    label: 'Profit split',  dir: 'higher', render: (f) => `${f.payoutSplit}%`,                                  val: (f) => f.payoutSplit },
      { key: 'payoutFreq',     label: 'Payout freq.',  dir: 'static', render: (f) => f.payoutFreq,                                          val: () => null },
      { key: 'payoutHours',    label: 'Payout speed',  dir: 'lower',  render: (f) => window.formatPayoutSpeed(f),                          val: (f) => f.payoutHours },
      { key: 'price',          label: 'Cena',          dir: 'lower',  render: (f) => `$${window.priceFor(f, accountSize)}`,                val: (f) => window.priceFor(f, accountSize) },
      { key: 'popularity',     label: 'Popularita',    dir: 'higher', render: (f) => f.popularity,                                          val: (f) => f.popularity },
      { key: 'supportRating',  label: 'Support',       dir: 'higher', render: (f) => f.supportRating,                                       val: (f) => f.supportRating },
      { key: 'campaign',       label: 'Kampaň',        dir: 'static', render: (f) => f.campaign?.label || '—',                              val: () => null }
    );
    return c;
  }, [accountSize, hasMultiPhase]);

  const leaders = React.useMemo(() => {
    const out = {};
    cols.forEach(c => {
      if (c.dir === 'static') return;
      const vals = firms.map(c.val).filter(v => v != null && v > 0);
      if (!vals.length) return;
      out[c.key] = c.dir === 'lower' ? Math.min(...vals) : Math.max(...vals);
    });
    return out;
  }, [cols, firms]);

  // Active answer chips (collapsable insight)
  const answerChips = React.useMemo(() => {
    const map = {
      profitSplit: (v) => v === 0 ? 'Profit split nehraje roli' : v != null ? `Profit split min ${v}%` : null,
      popularity: (v) => v === 'high' ? 'Jen ověřené firmy' : v === 'mid' ? 'Trochu populární' : null,
      language:   (v) => v ? `Support v ${v}` : null,
      payment:    (v) => v ? `Výplata ${v}` : null,
      platform:   (v) => v ? `Platforma ${v === 'other' ? 'vlastní' : v}` : null
    };
    return Object.entries(map)
      .map(([k, fn]) => ({ k, label: fn(answers[k]) }))
      .filter(x => x.label);
  }, [answers]);

  return (
    <section id="srovnani" className="cmp-root" data-screen-label="02 Srovnání">
      <div className="container">

        {/* Compact top bar: title + restart quiz + size selector */}
        <div className="cmp-topbar">
          <div className="cmp-topbar-left">
            <div className="h-eyebrow" style={{ marginBottom: 10 }}>02 — SROVNÁNI</div>
            <h2 className="cmp-h1">Tvé <span className="accent-gradient">top 3</span> firmy vedle sebe.</h2>
            <p className="cmp-sub">
              Vidíš to nejlepší — ostatní firmy si můžeš zobrazit níže. Klikni na řádek pro detail.
              {' '}<button className="cmp-link" onClick={onEditQuiz}>upravit dotazník</button>
            </p>
          </div>
          <div className="cmp-topbar-right">
            <div className="size-picker compact">
              <span className="size-label">Velikost účtu</span>
              {sizes.map(s => (
                <button
                  key={s}
                  className={'size-chip' + (s === accountSize ? ' is-on' : '')}
                  onClick={() => onAccountSize(s)}
                >
                  ${(s / 1000)}K
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active answer chips — quick summary */}
        {answerChips.length > 0 && (
          <div className="answer-chips">
            <span className="ac-label">Tvoje priority:</span>
            {answerChips.map(c => (
              <span key={c.k} className="ac-chip">
                {c.label}
              </span>
            ))}
          </div>
        )}

        <div className="cmp-scroll">
          <table className="cmp-wide">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th className="col-firm">Firma</th>
                {cols.map(c => (
                  <th key={c.key} className={c.dir === 'static' ? '' : 'col-num'}>{c.label}</th>
                ))}
                <th className="col-score col-num">Shoda</th>
                <th className="col-exp"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, idx) => {
                const f = row.firm;
                const isOpen = openId === f.id;
                const isTop = idx === 0;
                return (
                  <React.Fragment key={f.id}>
                    <tr
                      className={isTop ? 'row-top' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOpenId(isOpen ? null : f.id)}
                    >
                      <td className="col-rank">
                        <span className={'rank-num' + (isTop ? ' is-top' : '')}>{idx + 1}</span>
                      </td>
                      <td className="col-firm">
                        <div className="firm-cell">
                          <FirmAvatar firm={f} />
                          <div>
                            <div className="firm-name">
                              {f.name}
                              {isTop && <span className="vase-pill">NEJLEPŠÍ SHODA</span>}
                            </div>
                            <div className="firm-tag">{f.tagline}</div>
                          </div>
                        </div>
                      </td>
                      {cols.map(c => <CellByKey key={c.key} col={c} firm={f} leaders={leaders} />)}
                      <td className="col-num col-score">
                        <ScorePill score={row.score} />
                      </td>
                      <td className="col-exp">
                        <button
                          className={'exp-btn' + (isOpen ? ' is-open' : '')}
                          aria-label="Zobrazit více"
                          onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : f.id); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="row-detail">
                        <td colSpan={cols.length + 4} style={{ padding: 0 }}>
                          <DetailPanel firm={f} reasons={row.reasons} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Show-more / show-less toggle */}
        {hiddenCount > 0 && (
          <div className="show-more-wrap">
            <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll
                ? <>Sbalit zpět na top 3 <span className="arr">↑</span></>
                : <>Zobrazit zbylých {hiddenCount} firem <span className="arr">↓</span></>}
            </button>
          </div>
        )}

        <div className="cmp-legend">
          <span><span className="leader" style={{ color: 'var(--mkt-turquoise)' }}>★</span> Nejlepší hodnota v kategorii</span>
          <span>· Klikni na řádek pro zobrazení detailu</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Mock data k 20. 5. 2026 · srovnavac.fintokei.ai</span>
        </div>
      </div>
    </section>
  );
}


function ScorePill({ score }) {
  const tier = score >= 75 ? 'top' : score >= 50 ? 'mid' : 'low';
  return (
    <span className={'score-pill score-' + tier}>
      <span className="score-num">{Math.round(score)}</span>
      <span className="score-of">/100</span>
    </span>
  );
}


function CellByKey({ col, firm, leaders }) {
  const v = col.val(firm);
  const isLeader = col.dir !== 'static' && v != null && v > 0 && v === leaders[col.key];

  if (col.key === 'campaign') {
    return (
      <td>
        {firm.campaign
          ? (
            <a
              href={firm.campaign.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="campaign-pill"
              title={firm.campaign.label}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="campaign-code">{firm.campaign.code}</span>
              <span className="campaign-text">{firm.campaign.label}</span>
            </a>
          )
          : <span className="campaign-none">—</span>}
      </td>
    );
  }
  if (col.key === 'popularity') {
    return (
      <td className="col-num">
        <span className="pop-cell" title={firm.popularityNote}>
          <span className={'pop-num' + (isLeader ? ' leader' : '')}>{firm.popularity}</span>
          <span className="pop-bar"><span style={{ width: `${firm.popularity}%` }}></span></span>
        </span>
      </td>
    );
  }
  if (col.key === 'supportRating') {
    return (
      <td className="col-num">
        <span className="support-cell">
          <span className={'rating' + (isLeader ? ' leader' : '')}>{firm.supportRating}<span style={{ color: 'rgba(255,255,255,.35)' }}> / 5</span></span>
          <span className="note">{firm.supportNote}</span>
        </span>
      </td>
    );
  }
  if (col.key === 'payoutFreq') {
    return <td>{firm.payoutFreq}</td>;
  }
  if (col.key === 'payoutHours') {
    return (
      <td className="col-num">
        <span className={isLeader ? 'leader' : ''} title={firm.payoutRaw}>{window.formatPayoutSpeed(firm)}</span>
      </td>
    );
  }
  if (col.key === 'price') {
    return (
      <td className="col-num">
        <span className={isLeader ? 'leader' : ''} style={{ fontSize: 16, fontWeight: 600 }}>{col.render(firm)}</span>
      </td>
    );
  }
  return (
    <td className={col.dir === 'static' ? '' : 'col-num'}>
      <span className={isLeader ? 'leader' : ''}>{col.render(firm)}</span>
    </td>
  );
}


function DetailPanel({ firm, reasons }) {
  const yrs = 2026 - firm.foundedYear;
  const timeLimit = firm.timeMax
    ? `${firm.timeMin || 0}–${firm.timeMax} dní`
    : (firm.timeMin > 0 ? `min ${firm.timeMin} dní · max bez limitu` : 'Bez limitu');

  const yesNo = (b) => b
    ? <span className="yes">✓ Ano</span>
    : <span className="no">✗ Ne</span>;

  const eduLabel = {
    none: 'Žádné',
    blog: 'Blog',
    videos: 'Video tutoriály',
    academy: 'Akademie (kurzy)'
  };

  return (
    <div className="detail-panel">

      <div className="detail-group">
        <div className="detail-h">Trading podmínky</div>
        <div className="detail-row"><span className="dr-label">Time limit (min · max)</span><span className="dr-value">{timeLimit}</span></div>
        <div className="detail-row"><span className="dr-label">News trading</span><span className="dr-value">{yesNo(firm.newsTrading)}</span></div>
        <div className="detail-row"><span className="dr-label">Maximální páka</span><span className="dr-value">{firm.maxLeverage}</span></div>
        <div className="detail-row">
          <span className="dr-label">Commission-free</span>
          <span className="dr-value">
            {firm.commissionFree.length === 0
              ? <span style={{ color: 'rgba(255,255,255,.4)' }}>—</span>
              : <span className="tag-row">{firm.commissionFree.map(p => <span key={p} className="t">{p}</span>)}</span>}
          </span>
        </div>
        <div className="detail-row"><span className="dr-label">Average payout</span><span className="dr-value">${(firm.avgPayout || 0).toLocaleString('cs-CZ')}</span></div>
      </div>

      <div className="detail-group">
        <div className="detail-h">Platforma & nástroje</div>
        <div className="detail-row">
          <span className="dr-label">Platformy</span>
          <span className="dr-value">
            <span className="tag-row">{firm.platforms.map(p => <span key={p} className="t">{p}</span>)}</span>
          </span>
        </div>
        <div className="detail-row"><span className="dr-label">Povolení robotů (EA)</span><span className="dr-value">{yesNo(firm.robotsAllowed)}</span></div>
        <div className="detail-row"><span className="dr-label">Mobilní aplikace</span><span className="dr-value">{yesNo(firm.mobileApp)}</span></div>
        <div className="detail-row"><span className="dr-label">Loyalty program</span><span className="dr-value">{yesNo(firm.loyaltyProgram)}</span></div>
        <div className="detail-row"><span className="dr-label">Edukační materiály</span><span className="dr-value">{eduLabel[firm.education] || '—'}</span></div>
      </div>

      <div className="detail-group">
        <div className="detail-h">Firma & dostupnost</div>
        <div className="detail-row"><span className="dr-label">Původ firmy</span><span className="dr-value">{firm.hq} · od {firm.foundedYear}</span></div>
        <div className="detail-row"><span className="dr-label">Years in operation</span><span className="dr-value">{yrs} let</span></div>
        <div className="detail-row">
          <span className="dr-label">Jazyky webu</span>
          <span className="dr-value">
            <span className="tag-row">{firm.webLanguages.map(p => <span key={p} className="t">{p}</span>)}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="dr-label">Platební metody</span>
          <span className="dr-value">
            <span className="tag-row">{firm.paymentMethods.map(p => <span key={p} className="t">{p}</span>)}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="dr-label">Zakázané země</span>
          <span className="dr-value">
            <span className="tag-row">{firm.restrictedCountries.map(p => <span key={p} className="t" style={{ borderColor: 'rgba(248,21,179,.3)', color: '#fbcfe8' }}>{p}</span>)}</span>
          </span>
        </div>
      </div>

      {/* Why this score? — reasoning chips */}
      {reasons && reasons.length > 0 && (
        <div className="detail-group detail-group-full">
          <div className="detail-h">Proč toto skóre</div>
          <div className="reason-chips">
            {reasons.map((r, i) => {
              const isPlus = r.startsWith('+');
              return (
                <span key={i} className={'reason-chip ' + (isPlus ? 'is-plus' : 'is-minus')}>
                  {r}
                </span>
              );
            })}
          </div>
          <div className="reason-source">
            <strong>Popularita:</strong> {firm.popularityNote}
          </div>
        </div>
      )}
    </div>
  );
}


window.SectionPricing = SectionPricing;
