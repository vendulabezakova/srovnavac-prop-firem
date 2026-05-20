// Hero LP — první sekce po vyplnění dotazníku.
// Layout: nadpis + podnadpis + trust signaly vlevo, obličej (image-slot) vpravo.

function SectionHero({ answers, topFirm }) {
  const today = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  const answeredCount = Object.values(answers || {}).filter(v => v !== undefined).length;

  return (
    <section id="hero" className="hero-lp" data-screen-label="01 Hero">
      <div className="container">
        <div className="hero-grid">

          {/* LEFT — copy */}
          <div className="hero-copy">
            <div className="h-eyebrow" style={{ marginBottom: 18 }}>
              <span className="pink-glow-dot" style={{ display: 'inline-block', marginRight: 8 }}></span>
              TVŮJ ŽEBŘÍČEK · {today.toUpperCase()}
            </div>

            <h1 className="hero-title">
              Tvoje <span className="accent-gradient">top 3 prop firmy</span>.<br />
              Podle <span className="accent-gradient">tvých priorit</span>.
            </h1>

            <p className="hero-sub">
              {answeredCount > 0
                ? <>Sestavili jsme žebříček z 8 ověřených prop firem na základě tvých {answeredCount} odpovědí.</>
                : <>Srovnání 8 ověřených prop firem. Pro personalizaci žebříčku otevři krátký dotazník v horní liště (<em>Upravit dotazník</em>).</>
              }
              <strong style={{ color: '#fff' }}> Žádné affiliate odkazy, žádné placené ranky </strong>—
              jen surová data o cenách, payoutu a podmínkách.
            </p>

            <div className="hero-ctas">
              <a href="#srovnani" className="btn btn-gradient btn-lg">
                ZOBRAZIT MŮJ ŽEBŘÍČEK <span style={{ marginLeft: 4 }}>→</span>
              </a>
              <a href="#novinky" className="btn btn-outline btn-lg">PŘEČÍST NOVINKY</a>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <div className="trust-v">12 480+</div>
                <div className="trust-l">Traderů našlo svou firmu</div>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <div className="trust-v">
                  <span style={{ color: 'var(--mkt-turquoise)' }}>4.8</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}> /5</span>
                </div>
                <div className="trust-l">Trustpilot · 2 100 recenzí</div>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <div className="trust-v">Denně</div>
                <div className="trust-l">Aktualizace dat o firmách</div>
              </div>
            </div>
          </div>

          {/* RIGHT — obličej + testimonial card */}
          <div className="hero-art">
            <div className="hero-face-wrap">
              {/* Decorative pink blob — Fintokei marketing motif */}
              <div className="hero-blob"></div>

              {/* Trader face — Bernd Skorupinski */}
              <image-slot
                id="hero-face"
                shape="circle"
                src="assets/img/bernd-skorupinski.webp"
                placeholder="Přetáhni foto trader / CEO"
                style={{ width: '320px', height: '320px', display: 'block', position: 'relative', zIndex: 2 }}
              ></image-slot>

              {/* Testimonial card */}
              <div className="hero-testimonial">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">
                  „Tahle aplikace mi za 2 minuty řekla, že jsem celý rok platil za špatnou prop firmu. Doslova."
                </p>
                <div className="testimonial-author">
                  <strong>Bernd Skorupinski</strong>
                  <span>full-time trader, Fintokei</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

window.SectionHero = SectionHero;
