// Quiz — onboarding overlay. Po dokončení posílá answers do parent přes onComplete(answers).
// X v pravém horním rohu umožňuje quiz PŘESKOČIT (žebříček není personalizovaný, ale
// user se dostane na obsah). Skip-out je trvalý design požadavek — neodstraňovat ani
// při redesignu, viz memory `feedback-skippable-quiz`. Stav přežije refresh přes localStorage.

const QUIZ_STORAGE = 'srovnavac_quiz_v1';

function loadQuiz() {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function saveQuiz(answers) {
  try { localStorage.setItem(QUIZ_STORAGE, JSON.stringify(answers)); } catch (e) {}
}

function clearQuiz() {
  try { localStorage.removeItem(QUIZ_STORAGE); } catch (e) {}
}

window.loadQuiz = loadQuiz;
window.saveQuiz = saveQuiz;
window.clearQuiz = clearQuiz;


function Quiz({ initialAnswers, onComplete, onClose }) {
  const questions = window.QUIZ;
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState(initialAnswers || {});

  const q = questions[step];
  const total = questions.length;
  const isLast = step === total - 1;
  const currentAnswer = answers[q.id];

  function pick(value) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    // Auto-advance po krátké pauze
    setTimeout(() => {
      if (isLast) {
        saveQuiz(next);
        onComplete(next);
      } else {
        setStep(step + 1);
      }
    }, 280);
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <div className="quiz-bg"></div>

      <div className="quiz-card">

        {/* X — vždy viditelné, umožňuje quiz přeskočit / zavřít. */}
        {onClose && (
          <button
            className="quiz-close-x"
            onClick={onClose}
            aria-label="Zavřít / přeskočit dotazník"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Header — progress + meta */}
        <div className="quiz-header">
          <div className="quiz-progress-bar">
            {questions.map((_, i) => (
              <span key={i} className={'quiz-progress-step' + (i <= step ? ' is-done' : '')}></span>
            ))}
          </div>
          <div className="quiz-step-meta">
            <span>Otázka {step + 1} z {total}</span>
            {q.weight > 1 && <span className="quiz-weight-badge">{q.weight}× váha</span>}
          </div>
        </div>

        {/* Question */}
        <div className="quiz-body">
          <h2 id="quiz-title" className="quiz-title">{q.title}</h2>
          {q.sub && <p className="quiz-sub">{q.sub}</p>}

          <div className="quiz-options">
            {q.options.map((opt) => {
              const isOn = currentAnswer === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  className={'quiz-opt' + (isOn ? ' is-on' : '')}
                  onClick={() => pick(opt.value)}
                >
                  <span className="quiz-opt-radio">
                    {isOn && <span className="quiz-opt-dot"></span>}
                  </span>
                  <span className="quiz-opt-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer — back + skip link */}
        <div className="quiz-footer">
          <button
            className="quiz-back"
            onClick={goBack}
            disabled={step === 0}
            aria-label="Předchozí otázka"
          >
            ← Zpět
          </button>
          <div className="quiz-foot-note">
            Personalizujeme žebříček podle <strong>tvých</strong> priorit · můžeš ale i přeskočit
          </div>
          {onClose && (
            <button
              className="quiz-close-link"
              onClick={onClose}
              aria-label={Object.keys(answers).length === total ? 'Zavřít' : 'Přeskočit dotazník'}
            >
              {Object.keys(answers).length === total ? 'Hotovo' : 'Přeskočit →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

window.Quiz = Quiz;
