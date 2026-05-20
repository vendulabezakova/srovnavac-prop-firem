// Root app: wires together header + 3 sections + tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "preferredFirm": "fintokei",
  "showHighlight": true,
  "compactNews": false
}/*EDITMODE-END*/;

function App() {
  const { TopNav, Hero, SubNav, SectionNews, SectionPricing, SectionAttributes } = window;
  const { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakToggle } = window;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const highlight = t.showHighlight ? t.preferredFirm : null;

  const firmOptions = window.PROP_FIRMS.map(f => ({ value: f.id, label: f.name }));

  return (
    <React.Fragment>
      <div className="page-bg"></div>
      <div className="page-shell">
        <TopNav />
        <Hero />
        <SubNav active="novinky" />
        <SectionNews     highlight={highlight} />
        <SectionPricing  highlight={highlight} />
        <SectionAttributes highlight={highlight} />

        <footer style={{ borderTop: '1px solid rgba(255,255,255,.06)', background: '#0a001a', padding: '40px 0 30px', color: 'rgba(255,255,255,.5)', fontSize: 13 }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>fintokei.ai · Prop Firm Finder · postaveno na Fintokei AI Hackathonu 2026</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
              Mock data — bude nahrazeno reálným JSON od Týmu 1
            </div>
          </div>
        </footer>

        <TweaksPanel title="Tweaks">
          <TweakSection title="Highlight">
            <TweakSelect
              label="Preferovaná firma"
              value={t.preferredFirm}
              options={firmOptions}
              onChange={(v) => setTweak('preferredFirm', v)}
            />
            <TweakToggle
              label="Zvýraznit vlastní firmu"
              value={t.showHighlight}
              onChange={(v) => setTweak('showHighlight', v)}
            />
          </TweakSection>
        </TweaksPanel>
      </div>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
