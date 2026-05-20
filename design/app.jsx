// Root app — quiz gate + Hero + Srovnávač (top 3 / expand) + Novinky

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "defaultAccountSize": 25000
}/*EDITMODE-END*/;

function App() {
  const { SectionHero, SectionPricing, SectionReviews, SectionNews, Quiz } = window;
  const { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakButton } = window;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [accountSize, setAccountSize] = React.useState(t.defaultAccountSize || 25000);

  const [answers, setAnswers] = React.useState(() => window.loadQuiz());
  const [quizOpen, setQuizOpen] = React.useState(() => !window.loadQuiz());
  const [topIds, setTopIds] = React.useState([]);
  const [reviewsFirm, setReviewsFirm] = React.useState(null);

  // Scroll-spy for anchor nav
  const [activeAnchor, setActiveAnchor] = React.useState('hero');
  React.useEffect(() => {
    function onScroll() {
      const anchors = ['hero', 'srovnani', 'recenze', 'novinky'];
      const offsets = anchors.map(id => {
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top } : null;
      }).filter(Boolean);
      const active = offsets.reduce((acc, s) => (s.top <= 160 ? s : acc), offsets[0]);
      if (active) setActiveAnchor(active.id);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [answers]);

  function handleComplete(next) {
    setAnswers(next);
    setQuizOpen(false);
    // After quiz, smooth scroll to comparator anchor
    setTimeout(() => {
      const el = document.getElementById('srovnani');
      if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    }, 280);
  }
  function handleEditQuiz() { setQuizOpen(true); }
  function handleReset() {
    window.clearQuiz();
    setAnswers(null);
    setQuizOpen(true);
    window.scrollTo({ top: 0 });
  }
  // X v quizu: pokud user ještě nic nevyplnil, uložíme prázdné {} aby se obsah
  // mohl vyrenderovat s nepersonalizovaným žebříčkem. Revisit (už něco vyplnil)
  // jen zavře overlay a původní odpovědi zůstanou. Skip-out je trvalý design
  // požadavek — viz memory `feedback-skippable-quiz`.
  function handleSkipQuiz() {
    if (!answers) {
      const empty = {};
      window.saveQuiz(empty);
      setAnswers(empty);
    }
    setQuizOpen(false);
  }

  function handleReviewsClick(firmId) {
    setReviewsFirm(firmId);
    setTimeout(() => {
      const el = document.getElementById('recenze');
      if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    }, 50);
  }

  const sizeOptions = window.ACCOUNT_SIZES.map(s => ({ value: s, label: `$${(s/1000)}K` }));

  return (
    <React.Fragment>
      <div className="page-bg"></div>

      <div className="page-shell">
        {/* App bar — slim brand bar */}
        <header className="app-bar">
          <div className="container app-bar-inner">
            <a href="#hero" className="brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.2 8.5L21 9.3L16 13.9L17.4 21L12 17.3L6.6 21L8 13.9L3 9.3L9.8 8.5L12 2Z" fill="url(#g_app)"/>
                <defs>
                  <linearGradient id="g_app" x1="3" y1="2" x2="21" y2="21">
                    <stop offset="0" stopColor="#6B03E5"/>
                    <stop offset="1" stopColor="#F815B3"/>
                  </linearGradient>
                </defs>
              </svg>
              <span>fintokei<span style={{ color: 'var(--mkt-turquoise)' }}>.ai</span></span>
              <span className="pill pill-violet" style={{ marginLeft: 6 }}>BETA</span>
            </a>

            {/* Anchor nav inline */}
            {answers && (
              <nav className="anchor-nav">
                {[
                  ['hero',     '01', 'Tvůj výběr'],
                  ['srovnani', '02', 'Srovnání'],
                  ['recenze',  '03', 'Recenze'],
                  ['novinky',  '04', 'Novinky']
                ].map(([id, num, label]) => (
                  <a key={id} href={'#' + id} className={activeAnchor === id ? 'is-on' : ''}>
                    <span className="an-num">{num}</span>
                    <span className="an-label">{label}</span>
                  </a>
                ))}
              </nav>
            )}

            <div className="app-bar-right">
              {answers && (
                <button className="ab-link" onClick={handleEditQuiz}>
                  Upravit dotazník
                </button>
              )}
            </div>
          </div>
        </header>

        <main className={'app-main' + (quizOpen && !answers ? ' is-locked' : '')}>
          {answers
            ? <React.Fragment>
                <SectionHero answers={answers} topFirm={topIds[0]} />
                <SectionPricing
                  accountSize={accountSize}
                  onAccountSize={setAccountSize}
                  answers={answers}
                  onEditQuiz={handleEditQuiz}
                  onTopIds={setTopIds}
                  onReviewsClick={handleReviewsClick}
                />
                <SectionReviews
                  topIds={topIds}
                  selectedFirmId={reviewsFirm}
                  onSelectFirm={setReviewsFirm}
                />
                <SectionNews topIds={topIds} />
              </React.Fragment>
            : <div className="cmp-placeholder">
                <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
                  <div className="h-eyebrow" style={{ marginBottom: 16 }}>
                    <span className="pink-glow-dot" style={{ display: 'inline-block', marginRight: 8 }}></span>
                    SROVNÁVAČ PROP FIREM · BETA
                  </div>
                  <h1 className="h-display" style={{ margin: '0 auto', maxWidth: 820 }}>
                    Najdi firmu, která <span className="accent-gradient">opravdu sedí</span> tvému stylu.
                  </h1>
                  <p style={{ maxWidth: 540, margin: '20px auto 0', color: 'rgba(255,255,255,.7)', fontSize: 17 }}>
                    Než ti ukážeme srovnávač, polož ti pár otázek — žebříček se seřadí podle <strong style={{ color: '#fff' }}>tvých</strong> priorit.
                  </p>
                </div>
              </div>
          }
        </main>

        {answers && (
          <footer className="app-footer">
            <div className="container app-footer-inner">
              <div>fintokei.ai · Srovnávač prop firem · postaveno na Fintokei AI Hackathonu 2026</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
                Mock data — bude nahrazeno reálným JSON od Týmu 1
              </div>
            </div>
          </footer>
        )}

        {/* Quiz overlay — onClose vždy předán, viz handleSkipQuiz */}
        {quizOpen && (
          <Quiz
            initialAnswers={answers || {}}
            onComplete={handleComplete}
            onClose={handleSkipQuiz}
          />
        )}

        {/* Tweaks */}
        <TweaksPanel title="Tweaks">
          <TweakSection label="Default">
            <TweakSelect
              label="Výchozí velikost účtu"
              value={accountSize}
              options={sizeOptions}
              onChange={(v) => { setAccountSize(Number(v)); setTweak('defaultAccountSize', Number(v)); }}
            />
            <TweakButton
              label="Resetovat dotazník"
              onClick={handleReset}
            />
          </TweakSection>
        </TweaksPanel>
      </div>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
