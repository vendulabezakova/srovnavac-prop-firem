// Mock data pro prop trading firmy — placeholder dokud Tým 1 nedoručí reálný JSON.
//
// Datový kontrakt s Týmem 1:
//  • Jeden řádek per firma (ne per account size); ceny jsou v poli `prices[size]`.
//  • `payoutHours` je normalizováno (instant=0, "24h"=24, "Do 3 dnů"=72, "Týdně"=168, "Měsíčně"=720).
//    Surový string je v `payoutRaw` pro tooltip.
//  • `campaign` je objekt { code, label, url, discount } nebo null.
//  • `popularity` a `supportRating` jsou už agregovaná čísla (T1 je počítá z Trustpilotu/Twitteru/Redditu via Claude).

window.ACCOUNT_SIZES = [10000, 25000, 50000, 100000, 200000];

window.priceFor = function (firm, size) {
  if (firm.prices && firm.prices[size] != null) return firm.prices[size];
  return firm.challengePrice;
};

// Helper: převede payoutHours zpět na lidsky čitelnou nálepku
window.formatPayoutSpeed = function (firm) {
  return firm.payoutRaw || (
    firm.payoutHours === 0 ? 'Instantně'
    : firm.payoutHours <= 24 ? 'Do 24 h'
    : firm.payoutHours <= 48 ? 'Do 48 h'
    : firm.payoutHours <= 168 ? 'Do týdne'
    : `Do ${Math.round(firm.payoutHours / 24)} dnů`
  );
};

window.PROP_FIRMS = [
  {
    id: 'fintokei',
    name: 'Fintokei',
    initials: 'FT',
    hq: 'Česko',
    tagline: 'Praha · est. 2023',
    brand: { from: '#6B03E5', to: '#F815B3' },
    // — hlavní řádek —
    prices:           { 10000: 49,  25000: 99,  50000: 189, 100000: 349, 200000: 599 },
    challengePrice:   99,
    profitTargetP1:   8,
    profitTargetP2:   null,           // 1-fázová
    steps:            1,
    maxDailyDD:       5,
    maxOverallDD:     10,
    payoutSplit:      90,
    payoutFreq:       'Na vyžádání',
    payoutHours:      24,             // do 24h od žádosti
    payoutRaw:        'Do 24 h',
    popularity:       78,
    popularityNote:   'Trustpilot 4.7 (520 recenzí), Reddit pozitivní, JP Twitter aktivní',
    supportRating:    4.8,
    supportNote:      '24/7 chat',
    campaign:         { code: 'NEW20', label: '−20 % na první výzvu', url: 'https://fintokei.com/promo/new20', discount: 20 },
    // — detail —
    timeMin:          0,
    timeMax:          null,
    newsTrading:      true,
    maxLeverage:      '1:100',
    commissionFree:   ['Forex', 'Indexy', 'Krypto'],
    avgPayout:        2400,
    robotsAllowed:    true,
    mobileApp:        true,
    platforms:        ['MT4', 'MT5', 'cTrader'],
    loyaltyProgram:   true,
    foundedYear:      2023,
    webLanguages:     ['CS', 'SK', 'EN', 'JP'],
    supportLanguages: ['CS', 'SK', 'EN', 'JP'],
    restrictedCountries: ['USA', 'Severní Korea', 'Írán'],
    paymentMethods:   ['Wire', 'Krypto', 'Wise', 'Karta'],
    education:        'academy',      // none|blog|videos|academy
    news: { headline: 'Spuštěn ProTrader Swing — držení pozic přes víkend', date: '15. 5. 2026', tag: 'Produkt' }
  },
  {
    id: 'ftmo',
    name: 'FTMO',
    initials: 'FT',
    hq: 'Česko',
    tagline: 'Praha · est. 2014',
    brand: { from: '#0F172A', to: '#1E40AF' },
    prices:           { 10000: 89,  25000: 155, 50000: 270, 100000: 540, 200000: 1080 },
    challengePrice:   155,
    profitTargetP1:   10,
    profitTargetP2:   5,
    steps:            2,
    maxDailyDD:       5,
    maxOverallDD:     10,
    payoutSplit:      80,
    payoutFreq:       'Měsíčně',
    payoutHours:      720,
    payoutRaw:        'Měsíčně (~30 dní)',
    popularity:       95,
    popularityNote:   'Trustpilot 4.8 (8 200 recenzí), nejcitovanější na Redditu',
    supportRating:    4.6,
    supportNote:      '24/7 chat + e-mail',
    campaign:         null,
    timeMin:          4,
    timeMax:          null,
    newsTrading:      false,
    maxLeverage:      '1:100',
    commissionFree:   ['Forex', 'Indexy'],
    avgPayout:        3200,
    robotsAllowed:    true,
    mobileApp:        true,
    platforms:        ['MT4', 'MT5', 'cTrader', 'DXtrade'],
    loyaltyProgram:   true,
    foundedYear:      2014,
    webLanguages:     ['CS', 'SK', 'EN', 'DE', 'PL', 'ES', 'FR', 'IT'],
    supportLanguages: ['CS', 'EN', 'DE', 'PL'],
    restrictedCountries: ['USA', 'Severní Korea', 'Írán', 'Sýrie'],
    paymentMethods:   ['Wire', 'Krypto', 'Wise', 'Karta', 'PayPal'],
    education:        'academy',
    news: { headline: 'FTMO mění strop na maximální velikost účtu z $400k na $200k', date: '11. 5. 2026', tag: 'Pravidla' }
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    initials: 'FN',
    hq: 'SAE',
    tagline: 'Dubaj · est. 2022',
    brand: { from: '#22C55E', to: '#0EA5E9' },
    prices:           { 10000: 59,  25000: 89,  50000: 179, 100000: 329, 200000: 549 },
    challengePrice:   89,
    profitTargetP1:   8,
    profitTargetP2:   5,
    steps:            2,
    maxDailyDD:       5,
    maxOverallDD:     10,
    payoutSplit:      85,
    payoutFreq:       'Měsíčně',
    payoutHours:      336,
    payoutRaw:        'Do 14 dnů',
    popularity:       82,
    popularityNote:   'Trustpilot 4.5 (3 400 recenzí), na Redditu smíšeno k velkým výplatám',
    supportRating:    4.4,
    supportNote:      '24/7 chat',
    campaign:         { code: 'STELLAR50', label: '−50 % Stellar Lite', url: '#', discount: 50 },
    timeMin:          5,
    timeMax:          null,
    newsTrading:      true,
    maxLeverage:      '1:100',
    commissionFree:   ['Forex'],
    avgPayout:        1800,
    robotsAllowed:    true,
    mobileApp:        true,
    platforms:        ['MT4', 'MT5', 'cTrader'],
    loyaltyProgram:   false,
    foundedYear:      2022,
    webLanguages:     ['EN', 'AR', 'ES'],
    supportLanguages: ['EN', 'AR'],
    restrictedCountries: ['USA', 'Severní Korea'],
    paymentMethods:   ['Wire', 'Krypto', 'Karta'],
    education:        'videos',
    news: { headline: 'FundedNext spouští "Stellar Lite" — instantní funded účet za $49', date: '14. 5. 2026', tag: 'Akce' }
  },
  {
    id: 'e8',
    name: 'E8 Markets',
    initials: 'E8',
    hq: 'USA',
    tagline: 'Dallas · est. 2021',
    brand: { from: '#F97316', to: '#EA580C' },
    prices:           { 10000: 139, 25000: 198, 50000: 388, 100000: 688, 200000: 1100 },
    challengePrice:   198,
    profitTargetP1:   8,
    profitTargetP2:   5,
    steps:            2,
    maxDailyDD:       5,
    maxOverallDD:     8,
    payoutSplit:      80,
    payoutFreq:       'Týdně',
    payoutHours:      504,
    payoutRaw:        'Do 21 dnů (první)',
    popularity:       65,
    popularityNote:   'Trustpilot 4.1 (1 100 recenzí), kritika nové cenovky',
    supportRating:    4.2,
    supportNote:      'Po–Pá chat',
    campaign:         null,
    timeMin:          0,
    timeMax:          null,
    newsTrading:      true,
    maxLeverage:      '1:100',
    commissionFree:   ['Forex', 'Komodity'],
    avgPayout:        1500,
    robotsAllowed:    true,
    mobileApp:        false,
    platforms:        ['MT4', 'MT5'],
    loyaltyProgram:   false,
    foundedYear:      2021,
    webLanguages:     ['EN'],
    supportLanguages: ['EN'],
    restrictedCountries: ['Severní Korea', 'Írán', 'Sýrie'],
    paymentMethods:   ['Wire', 'Krypto', 'Karta'],
    education:        'blog',
    news: { headline: 'E8 Markets navyšuje payout split u Elite účtu na 95 %', date: '8. 5. 2026', tag: 'Produkt' }
  },
  {
    id: 'the5ers',
    name: 'The 5%ers',
    initials: '5%',
    hq: 'Izrael',
    tagline: 'Tel Aviv · est. 2016',
    brand: { from: '#0EA5E9', to: '#6366F1' },
    prices:           { 10000: 145, 25000: 235, 50000: 425, 100000: 775, 200000: 1295 },
    challengePrice:   235,
    profitTargetP1:   6,
    profitTargetP2:   null,
    steps:            1,
    maxDailyDD:       0,
    maxOverallDD:     4,
    payoutSplit:      75,
    payoutFreq:       'Měsíčně',
    payoutHours:      336,
    payoutRaw:        'Do 14 dnů',
    popularity:       72,
    popularityNote:   'Trustpilot 4.6 (1 800 recenzí), oceňováno za nízké DD',
    supportRating:    4.3,
    supportNote:      '24/7 chat',
    campaign:         { code: 'RESET', label: 'Free reset (do vyprodání)', url: '#', discount: null },
    timeMin:          6,
    timeMax:          null,
    newsTrading:      true,
    maxLeverage:      '1:30',
    commissionFree:   ['Forex'],
    avgPayout:        1100,
    robotsAllowed:    false,
    mobileApp:        false,
    platforms:        ['MT5', 'TradingView'],
    loyaltyProgram:   true,
    foundedYear:      2016,
    webLanguages:     ['EN', 'ES', 'AR', 'HE'],
    supportLanguages: ['EN', 'HE'],
    restrictedCountries: ['Severní Korea', 'Írán'],
    paymentMethods:   ['Wire', 'Karta', 'PayPal'],
    education:        'videos',
    news: { headline: 'The 5%ers zavádí scaling plan — automatické navyšení po 3 výplatách', date: '6. 5. 2026', tag: 'Produkt' }
  },
  {
    id: 'fundingpips',
    name: 'FundingPips',
    initials: 'FP',
    hq: 'SAE',
    tagline: 'Dubaj · est. 2022',
    brand: { from: '#10B981', to: '#06B6D4' },
    prices:           { 10000: 49,  25000: 79,  50000: 149, 100000: 299, 200000: 599 },
    challengePrice:   79,
    profitTargetP1:   8,
    profitTargetP2:   5,
    steps:            2,
    maxDailyDD:       5,
    maxOverallDD:     10,
    payoutSplit:      80,
    payoutFreq:       'Bi-weekly',
    payoutHours:      336,
    payoutRaw:        'Bi-weekly',
    popularity:       79,
    popularityNote:   'Trustpilot 4.5 (2 100 recenzí), pozitivní na r/Forex',
    supportRating:    4.5,
    supportNote:      '24/7 chat',
    campaign:         { code: 'SAVE15', label: '−15 % na vše', url: '#', discount: 15 },
    timeMin:          3,
    timeMax:          null,
    newsTrading:      true,
    maxLeverage:      '1:100',
    commissionFree:   ['Forex', 'Indexy'],
    avgPayout:        1900,
    robotsAllowed:    true,
    mobileApp:        false,
    platforms:        ['MT4', 'MT5', 'cTrader'],
    loyaltyProgram:   false,
    foundedYear:      2022,
    webLanguages:     ['EN', 'AR'],
    supportLanguages: ['EN'],
    restrictedCountries: ['USA', 'Severní Korea'],
    paymentMethods:   ['Wire', 'Krypto'],
    education:        'blog',
    news: { headline: 'FundingPips otevírá office v Dubaji a najimá 30 lidí', date: '12. 5. 2026', tag: 'Firma' }
  },
  {
    id: 'topstep',
    name: 'Topstep',
    initials: 'TS',
    hq: 'USA',
    tagline: 'Chicago · est. 2012',
    brand: { from: '#DC2626', to: '#991B1B' },
    prices:           { 10000: 99,  25000: 165, 50000: 325, 100000: 550, 200000: 950 },
    challengePrice:   165,
    profitTargetP1:   6,
    profitTargetP2:   null,
    steps:            1,
    maxDailyDD:       3,
    maxOverallDD:     6,
    payoutSplit:      90,
    payoutFreq:       '2× měsíčně',
    payoutHours:      192,
    payoutRaw:        'Do 8 dnů',
    popularity:       70,
    popularityNote:   'Trustpilot 4.4 (2 300 recenzí), veterán futures scény',
    supportRating:    4.5,
    supportNote:      'Po–Pá tel. + chat',
    campaign:         { code: 'COMBINE99', label: '$50K Combine za $99', url: '#', discount: 40 },
    timeMin:          2,
    timeMax:          null,
    newsTrading:      true,
    maxLeverage:      '1:50',
    commissionFree:   [],
    avgPayout:        1700,
    robotsAllowed:    false,
    mobileApp:        true,
    platforms:        ['NinjaTrader', 'TradingView', 'Tradovate'],
    loyaltyProgram:   true,
    foundedYear:      2012,
    webLanguages:     ['EN'],
    supportLanguages: ['EN'],
    restrictedCountries: ['Severní Korea', 'Írán', 'Kuba'],
    paymentMethods:   ['Wire', 'Karta'],
    education:        'academy',
    news: { headline: 'Topstep snižuje cenu $50K Combine na $99 do konce května', date: '18. 5. 2026', tag: 'Akce' }
  },
  {
    id: 'fxcomet',
    name: 'FX Comet',
    initials: 'FX',
    hq: 'Belize',
    tagline: 'Belize · est. 2024',
    brand: { from: '#A78BFA', to: '#EC4899' },
    prices:           { 10000: 69,  25000: 119, 50000: 229, 100000: 399, 200000: 679 },
    challengePrice:   119,
    profitTargetP1:   10,
    profitTargetP2:   null,
    steps:            1,
    maxDailyDD:       5,
    maxOverallDD:     12,
    payoutSplit:      90,
    payoutFreq:       'Týdně',
    payoutHours:      120,
    payoutRaw:        'Do 5 dnů',
    popularity:       38,
    popularityNote:   'Trustpilot 3.6 (180 recenzí), nový hráč — málo dat',
    supportRating:    3.6,
    supportNote:      'Pouze e-mail',
    campaign:         { code: 'LAUNCH40', label: '−40 % launch sale', url: '#', discount: 40 },
    timeMin:          5,
    timeMax:          30,
    newsTrading:      true,
    maxLeverage:      '1:200',
    commissionFree:   ['Forex', 'Krypto', 'Komodity'],
    avgPayout:        900,
    robotsAllowed:    true,
    mobileApp:        false,
    platforms:        ['MT5', 'cTrader'],
    loyaltyProgram:   false,
    foundedYear:      2024,
    webLanguages:     ['EN'],
    supportLanguages: ['EN'],
    restrictedCountries: ['USA', 'Severní Korea', 'Írán'],
    paymentMethods:   ['Krypto', 'Karta'],
    education:        'none',
    news: { headline: 'FX Comet ohlašuje partnership s cTrader pro futures', date: '10. 5. 2026', tag: 'Partnerství' }
  }
];

// ─── Quiz definition ─────────────────────────────────────────────
// Otázka 2 (payout speed) má 4× váhu — viz `weight`.
// `hardFilter: true` znamená že firma bez shody dostane vysoký penalty (de-facto odsunutí dolů).
window.QUIZ = [
  {
    id: 'profitSplit',
    title: 'Jaký minimální podíl na zisku chceš mít?',
    sub: 'Firmy s nižším podílem budou v žebříčku penalizovány.',
    weight: 1,
    options: [
      { value: 0,   label: '90 % a méně' },
      { value: 90,  label: '90 %' },
      { value: 95,  label: '95 %' },
      { value: 100, label: '100 %' }
    ]
  },
  {
    id: 'popularity',
    title: 'Záleží ti na tom, jak je firma mezi tradery známá a důvěryhodná?',
    sub: 'Hodnotíme na základě recenzí na Trustpilotu, Redditu a sociálních sítích.',
    weight: 1,
    options: [
      { value: 'high', label: 'Ano, chci jen ověřené firmy' },
      { value: 'mid',  label: 'Trochu' },
      { value: 'no',   label: 'Ne, zajímají mě jen podmínky' }
    ]
  },
  {
    id: 'language',
    title: 'V jakém jazyce chceš komunikovat se supportem?',
    sub: null,
    weight: 1,
    hardFilter: true,
    options: [
      { value: 'CS', label: '🇨🇿 Čeština' },
      { value: 'SK', label: '🇸🇰 Slovenština' },
      { value: 'EN', label: '🇬🇧 Angličtina' },
      { value: 'DE', label: '🇩🇪 Němčina' },
      { value: 'PL', label: '🇵🇱 Polština' },
      { value: null, label: 'Je mi to jedno' }
    ]
  },
  {
    id: 'payment',
    title: 'Jakou platební metodu preferuješ pro výplaty?',
    sub: null,
    weight: 1,
    hardFilter: true,
    options: [
      { value: 'Wire',   label: 'Bankovní převod' },
      { value: 'Krypto', label: 'Krypto' },
      { value: 'Wise',   label: 'Wise' },
      { value: 'PayPal', label: 'PayPal' },
      { value: null,     label: 'Je mi to jedno' }
    ]
  },
  {
    id: 'platform',
    title: 'Na jaké platformě chceš obchodovat?',
    sub: null,
    weight: 1,
    hardFilter: true,
    options: [
      { value: 'MT4',     label: 'MetaTrader 4' },
      { value: 'MT5',     label: 'MetaTrader 5' },
      { value: 'cTrader', label: 'cTrader' },
      { value: 'other',   label: 'Vlastní platforma' },
      { value: null,      label: 'Je mi to jedno' }
    ]
  }
];

// ─── Scoring engine ───────────────────────────────────────────────
// Vstup: firm + answers (objekt klíč→value). Výstup: { score, reasons[] }
//   • Q2 (payoutSpeed) má 4× váhu (definováno v QUIZ.weight)
//   • hardFilter=true a neshoda = -40 bodů (firma spadne na dno)
//   • base score = 50; rozsah po klampnutí 0–100
window.scoreFirm = function (firm, answers) {
  let score = 50;
  const reasons = [];

  for (const q of window.QUIZ) {
    const ans = answers[q.id];
    if (ans == null) continue; // ještě nezodpovězeno
    const w = q.weight || 1;

    if (q.id === 'profitSplit') {
      // ans = 0 znamená "90 % a méně" — nulová laťka, jen jemný bonus podle splitu
      if (ans === 0) {
        score += Math.min(6, (firm.payoutSplit - 75) / 2);
        return;
      }
      const diff = firm.payoutSplit - ans;
      if (diff >= 0) {
        const bonus = Math.min(10, diff + 2) * w;
        score += bonus;
        if (bonus > 0) reasons.push(`+${bonus.toFixed(0)} profit split ${firm.payoutSplit}% ≥ tvých ${ans}%`);
      } else {
        const pen = Math.min(20, -diff * 2) * w;
        score -= pen;
        reasons.push(`−${pen.toFixed(0)} profit split jen ${firm.payoutSplit}%`);
      }
    }

    else if (q.id === 'popularity') {
      if (ans === 'high') {
        const bonus = (firm.popularity - 60) / 4;
        score += bonus * w;
        if (Math.abs(bonus) > 1) reasons.push(`${bonus > 0 ? '+' : '−'}${Math.abs(bonus).toFixed(0)} popularita ${firm.popularity}/100`);
      } else if (ans === 'mid') {
        score += ((firm.popularity - 60) / 8) * w;
      }
      // 'no' = ignore
    }

    else if (q.id === 'language') {
      if (ans != null && !firm.supportLanguages.includes(ans)) {
        score -= 40;
        reasons.push(`−40 support nemluví ${ans}`);
      }
    }

    else if (q.id === 'payment') {
      if (ans != null && !firm.paymentMethods.includes(ans)) {
        score -= 40;
        reasons.push(`−40 nepodporuje ${ans}`);
      }
    }

    else if (q.id === 'platform') {
      if (ans === 'other') {
        // user wants something exotic — penalize MT-only firms (heuristic)
        const hasNonMT = firm.platforms.some(p => !['MT4', 'MT5'].includes(p));
        if (!hasNonMT) { score -= 20; reasons.push(`−20 jen MetaTrader platformy`); }
      } else if (ans != null && !firm.platforms.includes(ans)) {
        score -= 40;
        reasons.push(`−40 chybí ${ans}`);
      }
    }
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reasons };
};
