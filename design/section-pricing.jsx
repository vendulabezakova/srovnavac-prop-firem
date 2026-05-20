// SECTION — Srovnávač prop firem (challenge-driven model)
// Firma jako značka = reputační sloupce. Pod ní podřádky per challenge, které prošly filtrem.

function SectionPricing({ accountSize, onAccountSize, answers, onEditQuiz, onTopIds, onReviewsClick, onClearAnswer }) {
  const firms = window.PROP_FIRMS;
  const sizes = window.ACCOUNT_SIZES;
  const { FirmAvatar } = window;

  const [openId, setOpenId] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);
  const [filterAssets, setFilterAssets] = React.useState('all');
  const [filterSteps, setFilterSteps] = React.useState('all');
  const [expandedFirms, setExpandedFirms] = React.useState({});

  // Filter challenges first → firms which still have ≥1 matching challenge
  const firmsWithMatching = React.useMemo(() => {
    return firms.
    map((f) => {
      const matching = (f.challenges || []).filter((ch) => {
        if (filterAssets !== 'all' && !(ch.assets || []).includes(filterAssets)) return false;
        if (filterSteps !== 'all' && ch.steps !== filterSteps) return false;
        // Size: výzva musí mít cenu pro vybraný account size
        if (window.priceFor(ch, accountSize) == null) return false;
        return true;
      });
      return { firm: f, matching };
    }).
    filter((x) => x.matching.length > 0);
  }, [firms, filterAssets, filterSteps, accountSize]);

  // Score per firm (přes nejlepší matching challenge)
  const scored = React.useMemo(() => {
    return firmsWithMatching.map(({ firm, matching }) => {
      const res = window.scoreFirm(firm, answers, matching);
      return { firm, matching, ...res };
    });
  }, [firmsWithMatching, answers]);

  const sorted = React.useMemo(() => {
    return [...scored].sort((a, b) => b.score - a.score);
  }, [scored]);

  React.useEffect(() => {
    if (onTopIds) onTopIds(sorted.slice(0, 3).map((s) => s.firm.id));
  }, [sorted, onTopIds]);

  const visible = showAll ? sorted : sorted.slice(0, 3);
  const hiddenCount = sorted.length - 3;

  // Leaders pro reputační sloupce (přes všechny firmy, ne jen vidět)
  const leaders = React.useMemo(() => {
    const vals = {
      loyaltyProgram: firms.some((f) => f.loyaltyProgram) ? 1 : null,
      popularity: Math.max(...firms.map((f) => f.popularity)),
      supportRating: Math.max(...firms.map((f) => f.supportRating))
    };
    return vals;
  }, [firms]);

  // Leaders přes všechny matching challenges (global) — pro označení nejlepší ceny / DD / splitu
  const allMatchingChallenges = React.useMemo(() => {
    return firmsWithMatching.flatMap((x) => x.matching);
  }, [firmsWithMatching]);

  const chLeaders = React.useMemo(() => {
    if (!allMatchingChallenges.length) return {};
    const lowerIs = (key) => Math.min(...allMatchingChallenges.map((c) => c[key]).filter((v) => v != null && v > 0));
    const higherIs = (key) => Math.max(...allMatchingChallenges.map((c) => c[key]).filter((v) => v != null && v > 0));
    return {
      profitTargetP1: lowerIs('profitTargetP1'),
      profitTargetP2: lowerIs('profitTargetP2'),
      maxDailyDD: higherIs('maxDailyDD'),
      maxOverallDD: higherIs('maxOverallDD'),
      payoutSplit: higherIs('payoutSplit'),
      payoutHours: lowerIs('payoutHours'),
      price: Math.min(...allMatchingChallenges.map((c) => window.priceFor(c, accountSize)).filter((v) => v != null && v > 0))
    };
  }, [allMatchingChallenges, accountSize]);

  const answerChips = React.useMemo(() => {
    const map = {
      profitSplit: (v) => v === 0 ? 'Profit split nehraje roli' : v != null ? `Profit split min ${v}%` : null,
      popularity: (v) => v === 'high' ? 'Jen ověřené firmy' : v === 'mid' ? 'Trochu populární' : null,
      language: (v) => v ? `Support v ${v}` : null,
      payment: (v) => v ? `Výplata ${v}` : null,
      platform: (v) => v ? `Platforma ${v === 'other' ? 'vlastní' : v}` : null
    };
    return Object.entries(map).
    map(([k, fn]) => ({ k, label: fn(answers[k]) })).
    filter((x) => x.label);
  }, [answers]);

  return (
    <section id="srovnani" className="cmp-root" data-screen-label="02 Srovnání">
      <div className="container">

        <div className="cmp-topbar">
          <div className="cmp-topbar-left">
            <div className="h-eyebrow" style={{ marginBottom: 10 }}>02 — SROVNÁNÍ</div>
            <h2 className="cmp-h1">Tvé <span className="accent-gradient">top 3</span> firmy vedle sebe.</h2>
            <p className="cmp-sub">
              Pod každou firmou vidíš její výzvy, které vyhovují vyplněnému dotazníku.
              {' '}<button className="cmp-link" onClick={onEditQuiz}>upravit dotazník</button>
            </p>
          </div>
          <div className="cmp-topbar-right"></div>
        </div>

        {/* Filter row */}
        <div className="filter-row">
          <div className="filter-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Filter
          </div>

          <FilterDropdown
            label="Assets"
            value={filterAssets}
            onChange={setFilterAssets}
            onReset={filterAssets !== 'all' ? () => setFilterAssets('all') : null}
            options={[
            { value: 'all', label: 'Všechny' },
            { value: 'FX', label: 'FX' },
            { value: 'Crypto', label: 'Crypto' },
            { value: 'Stocks', label: 'Stocks' },
            { value: 'Indices', label: 'Indices' },
            { value: 'Commodities', label: 'Commodities' }]
            } />
          

          <FilterDropdown
            label="Size"
            value={accountSize}
            onChange={(v) => onAccountSize(Number(v))}
            onReset={accountSize !== 25000 ? () => onAccountSize(25000) : null}
            options={sizes.map((s) => ({ value: s, label: `$${s / 1000}K` }))} />
          

          <FilterDropdown
            label="Steps"
            value={filterSteps}
            onChange={setFilterSteps}
            onReset={filterSteps !== 'all' ? () => setFilterSteps('all') : null}
            options={[
            { value: 'all', label: 'Všechny' },
            { value: 0, label: 'Instant' },
            { value: 1, label: '1 Step' },
            { value: 2, label: '2 Steps' },
            { value: 3, label: '3 Steps' }]
            } />
          

          <div className="filter-summary">
            <strong>{firmsWithMatching.length}</strong> {firmsWithMatching.length === 1 ? 'firma' : firmsWithMatching.length < 5 ? 'firmy' : 'firem'}
            {' · '}
            <strong>{allMatchingChallenges.length}</strong> {allMatchingChallenges.length === 1 ? 'výzva' : allMatchingChallenges.length < 5 ? 'výzvy' : 'výzev'}
          </div>
        </div>

        {answerChips.length > 0 &&
        <div className="answer-chips">
            <span className="ac-label">Tvoje priority:</span>
            {answerChips.map((c) =>
          <span key={c.k} className="ac-chip">
                {c.label}
                {onClearAnswer && (
                  <button
                    type="button"
                    className="ac-chip-clear"
                    onClick={() => onClearAnswer(c.k)}
                    aria-label={`Zrušit prioritu: ${c.label}`}
                    title="Zrušit tuto prioritu">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </span>
          )}
          </div>
        }

        {firmsWithMatching.length === 0 ?
        <div className="empty-state">
              <div className="empty-icon">∅</div>
              <h3>Žádná výzva neodpovídá tomuto výběru</h3>
              <p>Zkus uvolnit filtry — např. změň Assets na "Všechny" nebo větší velikost účtu.</p>
              <button
            className="show-more-btn"
            onClick={() => {setFilterAssets('all');setFilterSteps('all');}}>
            
                Resetovat filtry
              </button>
            </div> :
        <React.Fragment>

        <div className="cmp-scroll">
          <table className="cmp-firm-table">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th className="col-firm">Firma</th>
                <th>Kampaň</th>
                <th className="col-num">Loyalty</th>
                <th className="col-num">Popularita</th>
                <th className="col-num">Support</th>
                <th className="col-num col-score">Shoda</th>
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
                        className={'firm-row' + (isTop ? ' is-top' : '')}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOpenId(isOpen ? null : f.id)}>
                        
                      <td className="col-rank">
                        <span className={'rank-num' + (isTop ? ' is-top' : '')}>{idx + 1}</span>
                      </td>
                      <td className="col-firm">
                        <div className="firm-cell">
                          <FirmAvatar firm={f} />
                          <div className="firm-cell-text">
                            <div className="firm-name">
                              {f.name}
                              {isTop && <span className="vase-pill">NEJLEPŠÍ SHODA</span>}
                            </div>
                            <div className="firm-tag">{f.tagline} · <span style={{ color: 'var(--mkt-turquoise)' }}>{row.matching.length} {row.matching.length === 1 ? 'výzva' : row.matching.length < 5 ? 'výzvy' : 'výzev'} ve výběru</span></div>
                            <RotatingReview firmId={f.id} delayOffset={idx * 700} onClick={() => onReviewsClick && onReviewsClick(f.id)} />
                          </div>
                        </div>
                      </td>

                      <td>
                        {f.campaign ?
                          <a
                            href={f.campaign.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="campaign-pill"
                            title={f.campaign.label}
                            onClick={(e) => e.stopPropagation()}>
                            
                              <span className="campaign-code">{f.campaign.code}</span>
                              <span className="campaign-text">{f.campaign.label}</span>
                            </a> :
                          <span className="campaign-none">—</span>}
                      </td>

                      <td className="col-num">
                        {f.loyaltyProgram ?
                          <span className="loyalty-yes">✓ Ano</span> :
                          <span className="loyalty-no">—</span>}
                      </td>

                      <td className="col-num">
                        <span className="pop-cell" title={f.popularityNote}>
                          <span className={'pop-num' + (f.popularity === leaders.popularity ? ' leader' : '')}>{f.popularity}</span>
                          <span className="pop-bar"><span style={{ width: `${f.popularity}%` }}></span></span>
                        </span>
                      </td>

                      <td className="col-num">
                        <span className="support-cell">
                          <span className={'rating' + (f.supportRating === leaders.supportRating ? ' leader' : '')}>{f.supportRating}<span style={{ color: 'rgba(255,255,255,.35)' }}> / 5</span></span>
                          <span className="note">{f.supportNote}</span>
                        </span>
                      </td>

                      <td className="col-num col-score">
                        <ScorePill score={row.score} />
                      </td>

                      <td className="col-exp">
                        <button
                            className={'exp-btn' + (isOpen ? ' is-open' : '')}
                            aria-label="Zobrazit více"
                            onClick={(e) => {e.stopPropagation();setOpenId(isOpen ? null : f.id);}}>
                            
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* Challenge sub-rows — max 2 visible, then expand button */}
                    {(() => {
                      const isExpanded = !!expandedFirms[f.id];
                      const visibleChs = isExpanded ? row.matching : row.matching.slice(0, 2);
                      const hiddenChs = row.matching.length - 2;
                      return (
                        <React.Fragment>
                          {visibleChs.map((ch, chIdx) =>
                            <tr key={'ch-' + chIdx} className="challenge-row">
                              <td colSpan={8}>
                                <ChallengeRow
                                  firm={f}
                                  challenge={ch}
                                  accountSize={accountSize}
                                  chLeaders={chLeaders}
                                  isBest={row.bestChallenge === ch} />
                              </td>
                            </tr>
                          )}
                          {hiddenChs > 0 && (
                            <tr className="challenge-row ch-expand-row">
                              <td colSpan={8}>
                                <button
                                  className="ch-expand-btn"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedFirms({ ...expandedFirms, [f.id]: !isExpanded });
                                  }}>
                                  {isExpanded
                                    ? <>Sbalit výzvy <span className="chev">↑</span></>
                                    : <>Zobrazit zbylé {hiddenChs} {hiddenChs === 1 ? 'výzvu' : hiddenChs < 5 ? 'výzvy' : 'výzev'} u {f.name} <span className="chev">↓</span></>}
                                </button>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })()}

                    {isOpen &&
                      <tr className="row-detail">
                        <td colSpan={8} style={{ padding: 0 }}>
                          <DetailPanel firm={f} reasons={row.reasons} />
                        </td>
                      </tr>
                      }
                  </React.Fragment>);

                })}
            </tbody>
          </table>
        </div>

        {hiddenCount > 0 &&
          <div className="show-more-wrap">
            <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ?
              <>Sbalit zpět na top 3 <span className="arr">↑</span></> :
              <>Zobrazit zbylých {hiddenCount} firem <span className="arr">↓</span></>}
            </button>
          </div>
          }

        <div className="cmp-legend">
          <span><span className="leader" style={{ color: 'var(--mkt-turquoise)' }}>★</span> Nejlepší hodnota v kategorii</span>
          <span>· Klikni na firmu pro detail</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Mock data k 20. 5. 2026 · srovnavac.fintokei.ai</span>
        </div>

          </React.Fragment>
        }
      </div>
    </section>);

}


// ── Challenge sub-row — kompaktní jednořádkový layout ──────────────────────
function ChallengeRow({ firm, challenge, accountSize, chLeaders, isBest }) {
  const price = window.priceFor(challenge, accountSize);
  const ch = challenge;
  const leader = (key, val) => val != null && val === chLeaders[key];

  const targetText = ch.profitTargetP1 == null
    ? '—'
    : ch.profitTargetP2 != null
      ? <><span className={leader('profitTargetP1', ch.profitTargetP1) ? 'leader' : ''}>{ch.profitTargetP1}%</span> <span style={{ color: 'rgba(255,255,255,.4)' }}>/</span> <span className={leader('profitTargetP2', ch.profitTargetP2) ? 'leader' : ''}>{ch.profitTargetP2}%</span></>
      : <span className={leader('profitTargetP1', ch.profitTargetP1) ? 'leader' : ''}>{ch.profitTargetP1}%</span>;

  return (
    <div className={'ch-row ch-row-compact' + (isBest ? ' is-best' : '')}>
      <div className="ch-arrow" aria-hidden="true">↳</div>

      <div className="ch-id">
        <div className="ch-name">
          {ch.name}
          {isBest && <span className="ch-best-tag">nejlepší shoda</span>}
        </div>
        <div className="ch-assets">
          {(ch.assets || []).map((a) => <span key={a} className="ch-asset">{a}</span>)}
        </div>
      </div>

      <div className="ch-params">
        <span className="ch-p">
          <span className="cp-l">P. target</span>
          <span className="cp-v">{targetText}</span>
        </span>
        <span className="ch-p">
          <span className="cp-l">Daily loss</span>
          <span className="cp-v">{ch.maxDailyDD === 0 ? '—' : <span className={leader('maxDailyDD', ch.maxDailyDD) ? 'leader' : ''}>{ch.maxDailyDD}%</span>}</span>
        </span>
        <span className="ch-p">
          <span className="cp-l">Max loss</span>
          <span className="cp-v"><span className={leader('maxOverallDD', ch.maxOverallDD) ? 'leader' : ''}>{ch.maxOverallDD}%</span></span>
        </span>
        <span className="ch-p ch-p-hi">
          <span className="cp-l">Split</span>
          <span className="cp-v"><span className={leader('payoutSplit', ch.payoutSplit) ? 'leader' : ''}>{ch.payoutSplit}%</span></span>
        </span>
        <span className="ch-p">
          <span className="cp-l">Frequency</span>
          <span className="cp-v">{ch.payoutFreq}</span>
        </span>
        <span className="ch-p">
          <span className="cp-l">Speed</span>
          <span className="cp-v" title={ch.payoutRaw}><span className={leader('payoutHours', ch.payoutHours) ? 'leader' : ''}>{window.formatPayoutSpeed(ch)}</span></span>
        </span>
      </div>

      <div className="ch-pricetag">
        <span className="ch-size-badge">${accountSize / 1000}K účet</span>
        <span className={'ch-price-num' + (leader('price', price) ? ' leader' : '')}>${price?.toLocaleString('cs-CZ')}</span>
      </div>
    </div>);

}

function ChField({ label, value, highlight }) {
  // legacy — neused
  return null;
}


// ── Rotující recenze pod firmou — random stagger ──────────────────────
function RotatingReview({ firmId, delayOffset = 0, onClick }) {
  const reviews = window.REVIEWS[firmId] || [];
  // Náhodný start, aby se firmy nestriedaly synchronizovaně
  const [idx, setIdx] = React.useState(() => {
    return reviews.length ? Math.floor(Math.random() * reviews.length) : 0;
  });

  React.useEffect(() => {
    if (reviews.length < 2) return;
    // Initial delay (staggered) — pak interval 2.4-2.6s s drobným jitterem
    let timerId;
    const initial = setTimeout(() => {
      const tick = () => {
        setIdx((i) => (i + 1) % reviews.length);
        timerId = setTimeout(tick, 2200 + Math.random() * 600);
      };
      timerId = setTimeout(tick, 2200 + Math.random() * 600);
    }, delayOffset);
    return () => {
      clearTimeout(initial);
      clearTimeout(timerId);
    };
  }, [reviews.length, delayOffset]);

  if (!reviews.length) return null;
  const r = reviews[idx];

  return (
    <button
      className="firm-review-box"
      onClick={(e) => {e.stopPropagation();onClick && onClick();}}
      title="Klikni pro všechny recenze této firmy">
      
      <div className="frb-head">
        <span className="frb-stars" aria-label={`${r.rating} hvězd z 5`}>
          {'★'.repeat(r.rating)}<span className="frb-stars-empty">{'★'.repeat(5 - r.rating)}</span>
        </span>
        <span className={'frb-source frb-source-' + r.source.toLowerCase()}>{r.source}</span>
      </div>
      <div className="frb-body" key={idx}>
        <p className="frb-text">„{r.text}"</p>
      </div>
      <div className="frb-foot">
        <span className="frb-author">— {r.author}</span>
        <span className="frb-link">Všechny recenze →</span>
      </div>
    </button>);

}


// ── Filter dropdown ──────────────────────────────────────────────
function FilterDropdown({ label, value, onChange, options, onReset }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const current = options.find((o) => o.value === value);
  const currentLabel = current?.label || '—';
  const isDefault = value === 'all' || value === undefined;

  return (
    <div className={'fdrop' + (open ? ' is-open' : '') + (isDefault ? '' : ' is-active') + (onReset ? ' has-reset' : '')} ref={ref}>
      <button
        className="fdrop-btn"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}>
        
        <span className="fdrop-label">{label}:</span>
        <strong>{currentLabel}</strong>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="fdrop-chev">
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {onReset && (
        <button
          className="fdrop-reset"
          onClick={(e) => { e.stopPropagation(); onReset(); setOpen(false); }}
          aria-label="Vymazat filtr"
          title="Vymazat filtr"
          type="button">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      {open &&
      <div className="fdrop-menu" role="listbox">
          {options.map((o) =>
        <button
          key={String(o.value)}
          className={'fdrop-opt' + (o.value === value ? ' is-on' : '')}
          onClick={() => {onChange(o.value);setOpen(false);}}
          role="option"
          aria-selected={o.value === value}>
          
              <span>{o.label}</span>
              {o.value === value &&
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
          }
            </button>
        )}
        </div>
      }
    </div>);

}


function ScorePill({ score }) {
  const tier = score >= 75 ? 'top' : score >= 50 ? 'mid' : 'low';
  return (
    <span className={'score-pill score-' + tier}>
      <span className="score-num">{Math.round(score)}</span>
      <span className="score-of">/100</span>
    </span>);

}


function DetailPanel({ firm, reasons }) {
  const yrs = 2026 - firm.foundedYear;
  const timeLimit = firm.timeMax ?
  `${firm.timeMin || 0}–${firm.timeMax} dní` :
  firm.timeMin > 0 ? `min ${firm.timeMin} dní · max bez limitu` : 'Bez limitu';

  const yesNo = (b) => b ?
  <span className="yes">✓ Ano</span> :
  <span className="no">✗ Ne</span>;

  const eduLabel = {
    none: 'Žádné',
    blog: 'Blog',
    videos: 'Video tutoriály',
    academy: 'Akademie (kurzy)'
  };

  return (
    <div className="detail-panel ch-row ch-row-compact is-best">

      <div className="detail-group">
        <div className="detail-h">Trading podmínky (per firma)</div>
        <div className="detail-row">
          <span className="dr-label">Počet fází výzev</span>
          <span className="dr-value">
            <span className="tag-row">
              {[...new Set((firm.challenges || []).map((c) => c.steps))]
                .sort((a, b) => a - b)
                .map((s) =>
                  <span key={s} className="t">{s === 0 ? 'Instant' : s === 1 ? '1 Step' : s + ' Steps'}</span>
                )}
            </span>
          </span>
        </div>
        <div className="detail-row"><span className="dr-label">Time limit (min · max)</span><span className="dr-value">{timeLimit}</span></div>
        <div className="detail-row"><span className="dr-label">News trading</span><span className="dr-value">{yesNo(firm.newsTrading)}</span></div>
        <div className="detail-row"><span className="dr-label">Maximální páka</span><span className="dr-value">{firm.maxLeverage}</span></div>
        <div className="detail-row">
          <span className="dr-label">Commission-free</span>
          <span className="dr-value">
            {firm.commissionFree.length === 0 ?
            <span style={{ color: 'rgba(255,255,255,.4)' }}>—</span> :
            <span className="tag-row">{firm.commissionFree.map((p) => <span key={p} className="t">{p}</span>)}</span>}
          </span>
        </div>
        <div className="detail-row"><span className="dr-label">Average payout</span><span className="dr-value">${(firm.avgPayout || 0).toLocaleString('cs-CZ')}</span></div>
      </div>

      <div className="detail-group">
        <div className="detail-h">Platforma & nástroje</div>
        <div className="detail-row">
          <span className="dr-label">Platformy</span>
          <span className="dr-value">
            <span className="tag-row">{firm.platforms.map((p) => <span key={p} className="t">{p}</span>)}</span>
          </span>
        </div>
        <div className="detail-row"><span className="dr-label">Povolení robotů (EA)</span><span className="dr-value">{yesNo(firm.robotsAllowed)}</span></div>
        <div className="detail-row"><span className="dr-label">Mobilní aplikace</span><span className="dr-value">{yesNo(firm.mobileApp)}</span></div>
        <div className="detail-row"><span className="dr-label">Edukační materiály</span><span className="dr-value">{eduLabel[firm.education] || '—'}</span></div>
      </div>

      <div className="detail-group">
        <div className="detail-h">Firma & dostupnost</div>
        <div className="detail-row"><span className="dr-label">Původ firmy</span><span className="dr-value">{firm.hq} · od {firm.foundedYear}</span></div>
        <div className="detail-row"><span className="dr-label">Years in operation</span><span className="dr-value">{yrs} let</span></div>
        <div className="detail-row">
          <span className="dr-label">Jazyky webu</span>
          <span className="dr-value">
            <span className="tag-row">{firm.webLanguages.map((p) => <span key={p} className="t">{p}</span>)}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="dr-label">Platební metody</span>
          <span className="dr-value">
            <span className="tag-row">{firm.paymentMethods.map((p) => <span key={p} className="t">{p}</span>)}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="dr-label">Zakázané země</span>
          <span className="dr-value">
            <span className="tag-row">{firm.restrictedCountries.map((p) => <span key={p} className="t" style={{ borderColor: 'rgba(248,21,179,.3)', color: '#fbcfe8' }}>{p}</span>)}</span>
          </span>
        </div>
      </div>

    </div>);

}


window.SectionPricing = SectionPricing;