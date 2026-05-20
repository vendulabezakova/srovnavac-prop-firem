// Mock data — challenge-driven model.
//
// Datový kontrakt s Týmem 1:
//  • Firma má REPUTAČNÍ pole (popularita, support, kampaň, loyalty, jazyky)
//  • Challenge-level pole (profit target, steps, DD, split, payout, ceny, assets)
//    žijí v poli firm.challenges[] — jedna firma má 1–3 varianty výzev.
//  • `payoutHours` je normalizováno (instant=0, "24h"=24, "Do 3 dnů"=72, "Týdně"=168, "Měsíčně"=720).
//  • `campaign` je objekt { code, label, url, discount } nebo null.

window.ACCOUNT_SIZES = [10000, 25000, 50000, 100000, 200000];

window.priceFor = function (challenge, size) {
  if (challenge.prices && challenge.prices[size] != null) return challenge.prices[size];
  return null;
};

window.formatPayoutSpeed = function (challenge) {
  return challenge.payoutRaw || (
    challenge.payoutHours === 0 ? 'Instantně'
    : challenge.payoutHours <= 24 ? 'Do 24 h'
    : challenge.payoutHours <= 48 ? 'Do 48 h'
    : challenge.payoutHours <= 168 ? 'Do týdne'
    : `Do ${Math.round(challenge.payoutHours / 24)} dnů`
  );
};

// ─── Recenze per firma (Trustpilot / Reddit / Twitter agregace) ───────
window.REVIEWS = {
  fintokei: [
    { author: 'Tomáš K.',       rating: 5, text: 'První výplata mi přišla za 18 hodin, doslova jsem nevěřil. Support na chatu odpovídá česky a hned.', date: '12. 5. 2026', source: 'Trustpilot' },
    { author: 'Petra M.',       rating: 5, text: 'Japonsky orientovaná podpora je top, konečně někdo kdo bere asijský trh vážně.',                  date: '8. 5. 2026',  source: 'Reddit' },
    { author: '@swing_jp',      rating: 4, text: 'ProTrader Swing je gamechanger, držet pozice přes víkend mi otevřelo nový styl obchodování.',     date: '6. 5. 2026',  source: 'Twitter' },
    { author: 'Marek V.',       rating: 5, text: '90% split a payout na vyžádání. Po FTMO je to jako přejít z auta na motorku.',                    date: '2. 5. 2026',  source: 'Trustpilot' },
    { author: 'Jakub D.',       rating: 4, text: 'Komunita kolem značky roste, na Discordu reálně pomáhají i ostatní traders.',                      date: '28. 4. 2026', source: 'Reddit' }
  ],
  ftmo: [
    { author: 'Alex H.',       rating: 5, text: 'Veterán scény. Pravidla jsou přísná, ale platí jak hodinky a payout přijde vždy.',                date: '14. 5. 2026', source: 'Trustpilot' },
    { author: 'Lukáš P.',      rating: 4, text: 'Dvoufázová výzva je dlouhá ale férová. Trochu mě zlobí omezení news tradingu.',                   date: '10. 5. 2026', source: 'Trustpilot' },
    { author: '@fxnerd',       rating: 3, text: 'Snížili max account na $200k. Pro skalpera jako já trochu zklamání.',                              date: '11. 5. 2026', source: 'Twitter' },
    { author: 'Honza B.',      rating: 5, text: 'Stabilita, transparentnost, žádná překvapení. Pro začátečníka nejbezpečnější volba.',             date: '5. 5. 2026',  source: 'Trustpilot' },
    { author: 'David N.',      rating: 4, text: 'Mobilní aplikace funguje slušně, ale UI by mohlo být modernější.',                                date: '1. 5. 2026',  source: 'Reddit' }
  ],
  fundednext: [
    { author: 'Karim R.',      rating: 5, text: 'Stellar Lite je nejlevnější instant funded co znám, za $49 se nedá nic ztratit.',                   date: '14. 5. 2026', source: 'Trustpilot' },
    { author: 'Emma S.',       rating: 4, text: 'Výplaty chodí spolehlivě, ale větší částky čekají déle než slibují.',                                date: '9. 5. 2026',  source: 'Trustpilot' },
    { author: '@trader_uae',   rating: 3, text: 'Support zvládne anglicky, ale složitější dotazy si vyžádají eskalaci. Trvá to.',                     date: '3. 5. 2026',  source: 'Twitter' },
    { author: 'Pavel T.',      rating: 5, text: 'Po 6 měsících konzistentního obchodování jsem získal 85% split. Spokojenost.',                       date: '29. 4. 2026', source: 'Reddit' }
  ],
  e8: [
    { author: 'Mike J.',       rating: 4, text: 'Týdenní výplaty u Elite jsou pro mě lákadlo. 95% split je už extrém.',                              date: '8. 5. 2026',  source: 'Trustpilot' },
    { author: '@e8_skeptic',   rating: 2, text: 'Nové ceny jsou drahé proti FundingPips. Za stejné podmínky platím dvakrát.',                         date: '7. 5. 2026',  source: 'Twitter' },
    { author: 'Robert K.',     rating: 4, text: 'Klasická 2-fázová s 8% drawdownem. Tvrdší než většina, ale pravidla jsou jasná.',                    date: '2. 5. 2026',  source: 'Reddit' },
    { author: 'Ondrej V.',     rating: 3, text: 'Chybí mi mobilní appka, jinak slušná firma.',                                                        date: '26. 4. 2026', source: 'Trustpilot' }
  ],
  the5ers: [
    { author: 'Sarah L.',      rating: 5, text: 'Low-risk přístup je přesně pro mě. 4% max DD si vyžaduje disciplínu, ale dlouhodobě to platí.',     date: '7. 5. 2026',  source: 'Trustpilot' },
    { author: 'Daniel F.',     rating: 4, text: 'Vyšší cena výzvy, ale scaling plan kompenzuje. Po 3 výplatách mi účet zdvojnásobili.',               date: '4. 5. 2026',  source: 'Reddit' },
    { author: '@5p_trader',    rating: 4, text: 'Nepouštějí roboty, což je pro algo-tradera deal-breaker. Pro discretionary OK.',                     date: '30. 4. 2026', source: 'Twitter' },
    { author: 'Martina P.',    rating: 5, text: 'Komunita 5%ers je nejlepší co znám. Reálně si pomáhají, ne jen marketingové žvásty.',               date: '24. 4. 2026', source: 'Trustpilot' }
  ],
  fundingpips: [
    { author: 'Ahmed S.',      rating: 5, text: 'Nejlepší poměr cena/podmínky na trhu. $79 za $25k výzvu, bi-weekly výplaty fungují.',                date: '13. 5. 2026', source: 'Trustpilot' },
    { author: 'Veronika H.',   rating: 4, text: 'Nový hráč ale slušné jméno. Reddit /r/Forex je k nim vesměs pozitivní.',                             date: '9. 5. 2026',  source: 'Reddit' },
    { author: '@fundingpipsfan', rating: 4, text: 'Vyrostli rychle, oficiální office v Dubaji vidět. Stability se ale dosud nedotkli.',              date: '12. 5. 2026', source: 'Twitter' },
    { author: 'Jan Š.',        rating: 3, text: 'Support jen anglicky, pro CZ tradera mírná překážka. Jinak v pořádku.',                              date: '5. 5. 2026',  source: 'Trustpilot' }
  ],
  topstep: [
    { author: 'Greg M.',       rating: 5, text: 'Futures specialist. Pokud chceš NinjaTrader/Tradovate, jiná volba v podstatě není.',                date: '15. 5. 2026', source: 'Trustpilot' },
    { author: 'Nikol B.',      rating: 4, text: 'Veterán z 2012, stabilita je nezpochybnitelná. 6% max DD je úzké ale férové.',                       date: '10. 5. 2026', source: 'Reddit' },
    { author: '@futuresgrl',   rating: 3, text: 'Není pro FX tradery. Jen futures, jen US burzy. Vědět to dopředu.',                                  date: '7. 5. 2026',  source: 'Twitter' },
    { author: 'Mirek L.',      rating: 5, text: '$50K Combine za $99 je pro vstup ideální. Telefonický support — kdo to dnes ještě má?',              date: '19. 5. 2026', source: 'Trustpilot' }
  ],
  fxcomet: [
    { author: 'Lara D.',       rating: 4, text: 'Nový hráč, ale 90% split a týdenní výplaty znějí dobře. Uvidíme za rok.',                            date: '11. 5. 2026', source: 'Trustpilot' },
    { author: '@cometrider',   rating: 3, text: 'Pouze e-mail support, žádný chat. Pro early-stage firmu očekávané.',                                 date: '8. 5. 2026',  source: 'Twitter' },
    { author: 'Tomáš H.',      rating: 4, text: '1:200 páka je u FX nejvyšší co jsem viděl. Pozor na risk, ale pro pro-tradera lákavé.',              date: '3. 5. 2026',  source: 'Reddit' },
    { author: 'Petr O.',       rating: 2, text: 'Trustpilot má jen 180 recenzí, na rozhodování málo dat. Počkám rok.',                                date: '27. 4. 2026', source: 'Trustpilot' }
  ]
};

window.reviewsFor = function(id) { return window.REVIEWS[id] || []; };


// ─── Firmy + challenges ─────────────────────────────────────────────
window.PROP_FIRMS = [
  {
    id: 'fintokei',
    name: 'Fintokei',
    initials: 'FT',
    hq: 'Česko',
    tagline: 'Praha · est. 2023',
    brand: { from: '#6B03E5', to: '#F815B3' },

    // — Reputační (firma jako značka) —
    popularity:       78,
    popularityNote:   'Trustpilot 4.7 (520 recenzí), Reddit pozitivní, JP Twitter aktivní',
    supportRating:    4.8,
    supportNote:      '24/7 chat',
    campaign:         { code: 'NEW20', label: '−20 % na první výzvu', url: 'https://fintokei.com/promo/new20', discount: 20 },
    loyaltyProgram:   true,

    // — Challenges —
    challenges: [
      {
        name: '1-Step Standard',
        steps: 1,
        assets: ['FX', 'Crypto', 'Indices', 'Commodities'],
        profitTargetP1: 8,
        profitTargetP2: null,
        maxDailyDD: 5,
        maxOverallDD: 10,
        payoutSplit: 90,
        payoutFreq: 'Na vyžádání',
        payoutHours: 24,
        payoutRaw: 'Do 24 h',
        prices: { 10000: 49, 25000: 99, 50000: 189, 100000: 349, 200000: 599 }
      },
      {
        name: 'ProTrader Swing',
        steps: 1,
        assets: ['FX', 'Indices'],
        profitTargetP1: 10,
        profitTargetP2: null,
        maxDailyDD: 4,
        maxOverallDD: 8,
        payoutSplit: 90,
        payoutFreq: 'Na vyžádání',
        payoutHours: 12,
        payoutRaw: 'Tentýž den',
        prices: { 10000: 79, 25000: 149, 50000: 269, 100000: 489, 200000: 829 }
      }
    ],

    // — Detail —
    timeMin: 0, timeMax: null,
    newsTrading: true,
    maxLeverage: '1:100',
    commissionFree: ['Forex', 'Indexy', 'Krypto'],
    avgPayout: 2400,
    robotsAllowed: true,
    mobileApp: true,
    platforms: ['MT4', 'MT5', 'cTrader'],
    foundedYear: 2023,
    webLanguages: ['CS', 'SK', 'EN', 'JP'],
    supportLanguages: ['CS', 'SK', 'EN', 'JP'],
    restrictedCountries: ['USA', 'Severní Korea', 'Írán'],
    paymentMethods: ['Wire', 'Krypto', 'Wise', 'Karta'],
    education: 'academy',
    news: { headline: 'Spuštěn ProTrader Swing — držení pozic přes víkend', date: '15. 5. 2026', tag: 'Produkt' }
  },

  {
    id: 'ftmo',
    name: 'FTMO',
    initials: 'FT',
    hq: 'Česko',
    tagline: 'Praha · est. 2014',
    brand: { from: '#0F172A', to: '#1E40AF' },

    popularity: 95,
    popularityNote: 'Trustpilot 4.8 (8 200 recenzí), nejcitovanější na Redditu',
    supportRating: 4.6,
    supportNote: '24/7 chat + e-mail',
    campaign: null,
    loyaltyProgram: true,

    challenges: [
      {
        name: '2-Step Normal',
        steps: 2,
        assets: ['FX', 'Crypto', 'Indices', 'Commodities', 'Stocks'],
        profitTargetP1: 10,
        profitTargetP2: 5,
        maxDailyDD: 5,
        maxOverallDD: 10,
        payoutSplit: 80,
        payoutFreq: 'Měsíčně',
        payoutHours: 720,
        payoutRaw: 'Měsíčně',
        prices: { 10000: 89, 25000: 155, 50000: 270, 100000: 540, 200000: 1080 }
      },
      {
        name: '2-Step Aggressive',
        steps: 2,
        assets: ['FX', 'Indices', 'Commodities'],
        profitTargetP1: 20,
        profitTargetP2: 10,
        maxDailyDD: 10,
        maxOverallDD: 20,
        payoutSplit: 90,
        payoutFreq: 'Měsíčně',
        payoutHours: 720,
        payoutRaw: 'Měsíčně',
        prices: { 10000: 179, 25000: 299, 50000: 549, 100000: 999, 200000: 1899 }
      }
    ],

    timeMin: 4, timeMax: null,
    newsTrading: false,
    maxLeverage: '1:100',
    commissionFree: ['Forex', 'Indexy'],
    avgPayout: 3200,
    robotsAllowed: true,
    mobileApp: true,
    platforms: ['MT4', 'MT5', 'cTrader', 'DXtrade'],
    foundedYear: 2014,
    webLanguages: ['CS', 'SK', 'EN', 'DE', 'PL', 'ES', 'FR', 'IT'],
    supportLanguages: ['CS', 'EN', 'DE', 'PL'],
    restrictedCountries: ['USA', 'Severní Korea', 'Írán', 'Sýrie'],
    paymentMethods: ['Wire', 'Krypto', 'Wise', 'Karta', 'PayPal'],
    education: 'academy',
    news: { headline: 'FTMO mění strop na maximální velikost účtu z $400k na $200k', date: '11. 5. 2026', tag: 'Pravidla' }
  },

  {
    id: 'fundednext',
    name: 'FundedNext',
    initials: 'FN',
    hq: 'SAE',
    tagline: 'Dubaj · est. 2022',
    brand: { from: '#22C55E', to: '#0EA5E9' },

    popularity: 82,
    popularityNote: 'Trustpilot 4.5 (3 400 recenzí), na Redditu smíšeno k velkým výplatám',
    supportRating: 4.4,
    supportNote: '24/7 chat',
    campaign: { code: 'STELLAR50', label: '−50 % Stellar Lite', url: '#', discount: 50 },
    loyaltyProgram: false,

    challenges: [
      {
        name: 'Stellar 2-Step',
        steps: 2,
        assets: ['FX', 'Crypto', 'Indices', 'Commodities'],
        profitTargetP1: 8,
        profitTargetP2: 5,
        maxDailyDD: 5,
        maxOverallDD: 10,
        payoutSplit: 85,
        payoutFreq: 'Měsíčně',
        payoutHours: 336,
        payoutRaw: 'Do 14 dnů',
        prices: { 10000: 59, 25000: 89, 50000: 179, 100000: 329, 200000: 549 }
      },
      {
        name: 'Stellar Lite (instant)',
        steps: 0,
        assets: ['FX', 'Crypto'],
        profitTargetP1: null,
        profitTargetP2: null,
        maxDailyDD: 3,
        maxOverallDD: 8,
        payoutSplit: 60,
        payoutFreq: 'Týdně',
        payoutHours: 168,
        payoutRaw: 'Týdně',
        prices: { 10000: 49, 25000: 79, 50000: 149, 100000: 279, 200000: 449 }
      },
      {
        name: 'Stellar 1-Step',
        steps: 1,
        assets: ['FX', 'Crypto', 'Indices'],
        profitTargetP1: 10,
        profitTargetP2: null,
        maxDailyDD: 4,
        maxOverallDD: 6,
        payoutSplit: 80,
        payoutFreq: 'Měsíčně',
        payoutHours: 336,
        payoutRaw: 'Do 14 dnů',
        prices: { 10000: 65, 25000: 99, 50000: 195, 100000: 359, 200000: 595 }
      }
    ],

    timeMin: 5, timeMax: null,
    newsTrading: true,
    maxLeverage: '1:100',
    commissionFree: ['Forex'],
    avgPayout: 1800,
    robotsAllowed: true,
    mobileApp: true,
    platforms: ['MT4', 'MT5', 'cTrader'],
    foundedYear: 2022,
    webLanguages: ['EN', 'AR', 'ES'],
    supportLanguages: ['EN', 'AR'],
    restrictedCountries: ['USA', 'Severní Korea'],
    paymentMethods: ['Wire', 'Krypto', 'Karta'],
    education: 'videos',
    news: { headline: 'FundedNext spouští "Stellar Lite" — instantní funded účet za $49', date: '14. 5. 2026', tag: 'Akce' }
  },

  {
    id: 'e8',
    name: 'E8 Markets',
    initials: 'E8',
    hq: 'USA',
    tagline: 'Dallas · est. 2021',
    brand: { from: '#F97316', to: '#EA580C' },

    popularity: 65,
    popularityNote: 'Trustpilot 4.1 (1 100 recenzí), kritika nové cenovky',
    supportRating: 4.2,
    supportNote: 'Po–Pá chat',
    campaign: null,
    loyaltyProgram: false,

    challenges: [
      {
        name: 'E8 Standard',
        steps: 2,
        assets: ['FX', 'Crypto', 'Indices', 'Commodities'],
        profitTargetP1: 8,
        profitTargetP2: 5,
        maxDailyDD: 5,
        maxOverallDD: 8,
        payoutSplit: 80,
        payoutFreq: 'Týdně',
        payoutHours: 504,
        payoutRaw: 'Do 21 dnů',
        prices: { 10000: 139, 25000: 198, 50000: 388, 100000: 688, 200000: 1100 }
      },
      {
        name: 'E8 Elite',
        steps: 2,
        assets: ['FX', 'Crypto', 'Indices', 'Commodities'],
        profitTargetP1: 8,
        profitTargetP2: 5,
        maxDailyDD: 5,
        maxOverallDD: 8,
        payoutSplit: 95,
        payoutFreq: 'Týdně',
        payoutHours: 168,
        payoutRaw: 'Týdně',
        prices: { 10000: 199, 25000: 298, 50000: 588, 100000: 988, 200000: 1700 }
      }
    ],

    timeMin: 0, timeMax: null,
    newsTrading: true,
    maxLeverage: '1:100',
    commissionFree: ['Forex', 'Komodity'],
    avgPayout: 1500,
    robotsAllowed: true,
    mobileApp: false,
    platforms: ['MT4', 'MT5'],
    foundedYear: 2021,
    webLanguages: ['EN'],
    supportLanguages: ['EN'],
    restrictedCountries: ['Severní Korea', 'Írán', 'Sýrie'],
    paymentMethods: ['Wire', 'Krypto', 'Karta'],
    education: 'blog',
    news: { headline: 'E8 Markets navyšuje payout split u Elite účtu na 95 %', date: '8. 5. 2026', tag: 'Produkt' }
  },

  {
    id: 'the5ers',
    name: 'The 5%ers',
    initials: '5%',
    hq: 'Izrael',
    tagline: 'Tel Aviv · est. 2016',
    brand: { from: '#0EA5E9', to: '#6366F1' },

    popularity: 72,
    popularityNote: 'Trustpilot 4.6 (1 800 recenzí), oceňováno za nízké DD',
    supportRating: 4.3,
    supportNote: '24/7 chat',
    campaign: { code: 'RESET', label: 'Free reset (do vyprodání)', url: '#', discount: null },
    loyaltyProgram: true,

    challenges: [
      {
        name: 'Hyper Growth (1-Step)',
        steps: 1,
        assets: ['FX', 'Indices', 'Commodities'],
        profitTargetP1: 6,
        profitTargetP2: null,
        maxDailyDD: 0,
        maxOverallDD: 4,
        payoutSplit: 75,
        payoutFreq: 'Měsíčně',
        payoutHours: 336,
        payoutRaw: 'Do 14 dnů',
        prices: { 10000: 145, 25000: 235, 50000: 425, 100000: 775, 200000: 1295 }
      },
      {
        name: 'Bootcamp (3-Step)',
        steps: 3,
        assets: ['FX', 'Indices'],
        profitTargetP1: 6,
        profitTargetP2: 6,
        maxDailyDD: 0,
        maxOverallDD: 4,
        payoutSplit: 80,
        payoutFreq: 'Měsíčně',
        payoutHours: 336,
        payoutRaw: 'Do 14 dnů',
        prices: { 10000: 95, 25000: 165, 50000: 295, 100000: 545, 200000: 895 }
      }
    ],

    timeMin: 6, timeMax: null,
    newsTrading: true,
    maxLeverage: '1:30',
    commissionFree: ['Forex'],
    avgPayout: 1100,
    robotsAllowed: false,
    mobileApp: false,
    platforms: ['MT5', 'TradingView'],
    foundedYear: 2016,
    webLanguages: ['EN', 'ES', 'AR', 'HE'],
    supportLanguages: ['EN', 'HE'],
    restrictedCountries: ['Severní Korea', 'Írán'],
    paymentMethods: ['Wire', 'Karta', 'PayPal'],
    education: 'videos',
    news: { headline: 'The 5%ers zavádí scaling plan — automatické navýšení po 3 výplatách', date: '6. 5. 2026', tag: 'Produkt' }
  },

  {
    id: 'fundingpips',
    name: 'FundingPips',
    initials: 'FP',
    hq: 'SAE',
    tagline: 'Dubaj · est. 2022',
    brand: { from: '#10B981', to: '#06B6D4' },

    popularity: 79,
    popularityNote: 'Trustpilot 4.5 (2 100 recenzí), pozitivní na r/Forex',
    supportRating: 4.5,
    supportNote: '24/7 chat',
    campaign: { code: 'SAVE15', label: '−15 % na vše', url: '#', discount: 15 },
    loyaltyProgram: false,

    challenges: [
      {
        name: '2-Step Standard',
        steps: 2,
        assets: ['FX', 'Crypto', 'Indices', 'Commodities'],
        profitTargetP1: 8,
        profitTargetP2: 5,
        maxDailyDD: 5,
        maxOverallDD: 10,
        payoutSplit: 80,
        payoutFreq: 'Bi-weekly',
        payoutHours: 336,
        payoutRaw: 'Bi-weekly',
        prices: { 10000: 49, 25000: 79, 50000: 149, 100000: 299, 200000: 599 }
      },
      {
        name: '1-Step Express',
        steps: 1,
        assets: ['FX', 'Crypto'],
        profitTargetP1: 10,
        profitTargetP2: null,
        maxDailyDD: 4,
        maxOverallDD: 6,
        payoutSplit: 80,
        payoutFreq: 'Bi-weekly',
        payoutHours: 336,
        payoutRaw: 'Bi-weekly',
        prices: { 10000: 69, 25000: 99, 50000: 189, 100000: 359, 200000: 699 }
      }
    ],

    timeMin: 3, timeMax: null,
    newsTrading: true,
    maxLeverage: '1:100',
    commissionFree: ['Forex', 'Indexy'],
    avgPayout: 1900,
    robotsAllowed: true,
    mobileApp: false,
    platforms: ['MT4', 'MT5', 'cTrader'],
    foundedYear: 2022,
    webLanguages: ['EN', 'AR'],
    supportLanguages: ['EN'],
    restrictedCountries: ['USA', 'Severní Korea'],
    paymentMethods: ['Wire', 'Krypto'],
    education: 'blog',
    news: { headline: 'FundingPips otevírá office v Dubaji a najímá 30 lidí', date: '12. 5. 2026', tag: 'Firma' }
  },

  {
    id: 'topstep',
    name: 'Topstep',
    initials: 'TS',
    hq: 'USA',
    tagline: 'Chicago · est. 2012',
    brand: { from: '#DC2626', to: '#991B1B' },

    popularity: 70,
    popularityNote: 'Trustpilot 4.4 (2 300 recenzí), veterán futures scény',
    supportRating: 4.5,
    supportNote: 'Po–Pá tel. + chat',
    campaign: { code: 'COMBINE99', label: '$50K Combine za $99', url: '#', discount: 40 },
    loyaltyProgram: true,

    challenges: [
      {
        name: 'Trading Combine',
        steps: 1,
        assets: ['Indices', 'Commodities'],
        profitTargetP1: 6,
        profitTargetP2: null,
        maxDailyDD: 3,
        maxOverallDD: 6,
        payoutSplit: 90,
        payoutFreq: '2× měsíčně',
        payoutHours: 192,
        payoutRaw: 'Do 8 dnů',
        prices: { 10000: 99, 25000: 165, 50000: 325, 100000: 550, 200000: 950 }
      }
    ],

    timeMin: 2, timeMax: null,
    newsTrading: true,
    maxLeverage: '1:50',
    commissionFree: [],
    avgPayout: 1700,
    robotsAllowed: false,
    mobileApp: true,
    platforms: ['NinjaTrader', 'TradingView', 'Tradovate'],
    foundedYear: 2012,
    webLanguages: ['EN'],
    supportLanguages: ['EN'],
    restrictedCountries: ['Severní Korea', 'Írán', 'Kuba'],
    paymentMethods: ['Wire', 'Karta'],
    education: 'academy',
    news: { headline: 'Topstep snižuje cenu $50K Combine na $99 do konce května', date: '18. 5. 2026', tag: 'Akce' }
  },

  {
    id: 'fxcomet',
    name: 'FX Comet',
    initials: 'FX',
    hq: 'Belize',
    tagline: 'Belize · est. 2024',
    brand: { from: '#A78BFA', to: '#EC4899' },

    popularity: 38,
    popularityNote: 'Trustpilot 3.6 (180 recenzí), nový hráč — málo dat',
    supportRating: 3.6,
    supportNote: 'Pouze e-mail',
    campaign: { code: 'LAUNCH40', label: '−40 % launch sale', url: '#', discount: 40 },
    loyaltyProgram: false,

    challenges: [
      {
        name: 'Launch 1-Step',
        steps: 1,
        assets: ['FX', 'Crypto', 'Commodities'],
        profitTargetP1: 10,
        profitTargetP2: null,
        maxDailyDD: 5,
        maxOverallDD: 12,
        payoutSplit: 90,
        payoutFreq: 'Týdně',
        payoutHours: 120,
        payoutRaw: 'Do 5 dnů',
        prices: { 10000: 69, 25000: 119, 50000: 229, 100000: 399, 200000: 679 }
      }
    ],

    timeMin: 5, timeMax: 30,
    newsTrading: true,
    maxLeverage: '1:200',
    commissionFree: ['Forex', 'Krypto', 'Komodity'],
    avgPayout: 900,
    robotsAllowed: true,
    mobileApp: false,
    platforms: ['MT5', 'cTrader'],
    foundedYear: 2024,
    webLanguages: ['EN'],
    supportLanguages: ['EN'],
    restrictedCountries: ['USA', 'Severní Korea', 'Írán'],
    paymentMethods: ['Krypto', 'Karta'],
    education: 'none',
    news: { headline: 'FX Comet ohlašuje partnership s cTrader pro futures', date: '10. 5. 2026', tag: 'Partnerství' }
  }
];


// ─── Quiz ─────────────────────────────────────────────────────────
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


// ─── Scoring ─────────────────────────────────────────────────────────
// Firma se boduje proti NEJLEPŠÍ své challenge (nebo nejlepší z filtru).
// Reputační otázky se aplikují per firma; profit split na úrovni challenge.

window.scoreFirm = function (firm, answers, eligibleChallenges) {
  const challenges = eligibleChallenges || firm.challenges || [];
  if (!challenges.length) return { score: 0, reasons: [], bestChallenge: null };

  let best = null;
  for (const ch of challenges) {
    const res = scoreOne(firm, ch, answers);
    if (!best || res.score > best.score) best = { ...res, bestChallenge: ch };
  }
  return best;
};

function scoreOne(firm, challenge, answers) {
  let score = 50;
  const reasons = [];

  for (const q of window.QUIZ) {
    const ans = answers[q.id];
    if (ans == null) continue;
    const w = q.weight || 1;

    if (q.id === 'profitSplit') {
      if (ans === 0) {
        score += Math.min(6, (challenge.payoutSplit - 75) / 2);
        continue;
      }
      const diff = challenge.payoutSplit - ans;
      if (diff >= 0) {
        const bonus = Math.min(10, diff + 2) * w;
        score += bonus;
        if (bonus > 0) reasons.push(`+${bonus.toFixed(0)} split ${challenge.payoutSplit}% ≥ ${ans}%`);
      } else {
        const pen = Math.min(20, -diff * 2) * w;
        score -= pen;
        reasons.push(`−${pen.toFixed(0)} split jen ${challenge.payoutSplit}%`);
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
}
