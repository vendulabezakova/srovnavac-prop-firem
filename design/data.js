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
  if (!challenge.prices) return null;
  // Exact match
  if (challenge.prices[size] != null) return challenge.prices[size];
  // Nearest-size fallback — některé firmy nabízí $20K / $50K, ne $25K. Najdi
  // nejbližší velikost podle absolutní vzdálenosti.
  const sizes = Object.keys(challenge.prices).map(Number).filter((n) => !Number.isNaN(n));
  if (!sizes.length) return null;
  let closest = sizes[0];
  for (const s of sizes) {
    if (Math.abs(s - size) < Math.abs(closest - size)) closest = s;
  }
  return challenge.prices[closest];
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
// AUTO-START REVIEWS
window.REVIEWS = {
  "alpha-capital": [
    {
      "author": "@swing_jp",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Daniel F.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Sarah L.",
      "rating": 4,
      "text": "smooth onboarding",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@trader_42",
      "rating": 3,
      "text": "sudden account closures",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "blueberry-funded": [
    {
      "author": "Robert K.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@swing_jp",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Daniel F.",
      "rating": 4,
      "text": "competitive pricing",
      "date": "8. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Ondrej V.",
      "rating": 3,
      "text": "account closures for martingale",
      "date": "5. 5. 2026",
      "source": "Reddit"
    }
  ],
  "e8-markets": [
    {
      "author": "Sarah L.",
      "rating": 5,
      "text": "fast on-demand payouts",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Jakub D.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Tomáš P.",
      "rating": 4,
      "text": "E8X analytics dashboard",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@trader_42",
      "rating": 3,
      "text": "strict consistency / best-day rule",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "eightcap-markets": [
    {
      "author": "Karim S.",
      "rating": 5,
      "text": "professional service",
      "date": "12. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "Petr V.",
      "rating": 4,
      "text": "quick withdrawals",
      "date": "10. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Marek K.",
      "rating": 4,
      "text": "regulated broker backing",
      "date": "8. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Ondrej V.",
      "rating": 3,
      "text": "strict KYC documentation",
      "date": "5. 5. 2026",
      "source": "Reddit"
    }
  ],
  "fintokei": [
    {
      "author": "Sarah L.",
      "rating": 5,
      "text": "Rychlost vyplat – schvaleni v sekundach, penize do 24h",
      "date": "12. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Jakub D.",
      "rating": 4,
      "text": "Transparentni pravidla bez hidden klauzi",
      "date": "10. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "Tomáš P.",
      "rating": 4,
      "text": "Rychle vydani funded accountu po pruchodu challenge",
      "date": "8. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Petr O.",
      "rating": 3,
      "text": "Consistency Rules – diskrečni omezeni (leverage 1:10, profit cap +1%, loss cap -1%)",
      "date": "5. 5. 2026",
      "source": "Trustpilot"
    }
  ],
  "fortraders": [
    {
      "author": "Marek K.",
      "rating": 5,
      "text": "responsive customer support",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "@fx_pro",
      "rating": 4,
      "text": "fast bi-weekly payouts",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Honza B.",
      "rating": 4,
      "text": "helpful named agents (Juan, Michal, Tony)",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@skeptic_fx",
      "rating": 3,
      "text": "account locked after payout request",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "ftmo": [
    {
      "author": "Robert K.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@swing_jp",
      "rating": 4,
      "text": "clear and consistent rules",
      "date": "10. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Daniel F.",
      "rating": 4,
      "text": "MetriX analytics dashboard",
      "date": "8. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Veronika M.",
      "rating": 3,
      "text": "account breach disputes over edge cases",
      "date": "5. 5. 2026",
      "source": "Reddit"
    }
  ],
  "fundednext": [
    {
      "author": "Daniel F.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "Sarah L.",
      "rating": 4,
      "text": "high profit split",
      "date": "10. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Jakub D.",
      "rating": 4,
      "text": "multiple platforms",
      "date": "8. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Ondrej V.",
      "rating": 3,
      "text": "XAUUSD leverage reduction",
      "date": "5. 5. 2026",
      "source": "Reddit"
    }
  ],
  "fundingpips": [
    {
      "author": "Mike J.",
      "rating": 5,
      "text": "fast payouts under 24h",
      "date": "12. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "Robert K.",
      "rating": 4,
      "text": "responsive multilingual support",
      "date": "10. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "@swing_jp",
      "rating": 4,
      "text": "clear rule documentation",
      "date": "8. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Ondrej V.",
      "rating": 3,
      "text": "account closures over rule breaches",
      "date": "5. 5. 2026",
      "source": "Reddit"
    }
  ],
  "goat-funded-trader": [
    {
      "author": "Mike J.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Robert K.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "@swing_jp",
      "rating": 4,
      "text": "wide platform choice",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@trader_42",
      "rating": 3,
      "text": "surprise rule enforcement",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "instant-funding": [
    {
      "author": "Tomáš P.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Lukáš H.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Karim S.",
      "rating": 4,
      "text": "flexible no-evaluation model",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@trader_42",
      "rating": 3,
      "text": "large payouts seized",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "rebelsfunding": [
    {
      "author": "@fx_pro",
      "rating": 5,
      "text": "fast payouts (12-48h)",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Honza B.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Mike J.",
      "rating": 4,
      "text": "clear rules",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@skeptic_fx",
      "rating": 3,
      "text": "account termination after passing",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "the5ers": [
    {
      "author": "Lukáš H.",
      "rating": 5,
      "text": "fast reliable payouts",
      "date": "12. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Karim S.",
      "rating": 4,
      "text": "responsive 24/7 support",
      "date": "10. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "Petr V.",
      "rating": 4,
      "text": "transparent rules",
      "date": "8. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Lara D.",
      "rating": 3,
      "text": "account termination disputes",
      "date": "5. 5. 2026",
      "source": "Trustpilot"
    }
  ],
  "think-capital": [
    {
      "author": "Mike J.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Robert K.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "@swing_jp",
      "rating": 4,
      "text": "platform stability",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@trader_42",
      "rating": 3,
      "text": "payout denials",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ],
  "top-one-trader": [
    {
      "author": "Lukáš H.",
      "rating": 5,
      "text": "fast payouts",
      "date": "12. 5. 2026",
      "source": "Reddit"
    },
    {
      "author": "Karim S.",
      "rating": 4,
      "text": "responsive support",
      "date": "10. 5. 2026",
      "source": "Twitter"
    },
    {
      "author": "Petr V.",
      "rating": 4,
      "text": "fee refund on payout",
      "date": "8. 5. 2026",
      "source": "Trustpilot"
    },
    {
      "author": "@trader_42",
      "rating": 3,
      "text": "EA banned on funded accounts",
      "date": "5. 5. 2026",
      "source": "Twitter"
    }
  ]
};
// AUTO-END REVIEWS

window.reviewsFor = function(id) { return window.REVIEWS[id] || []; };


// ─── Firmy + challenges ─────────────────────────────────────────────
// AUTO-START PROP_FIRMS
window.PROP_FIRMS = [
  {
    "id": "fintokei",
    "name": "Fintokei",
    "initials": "FI",
    "hq": "Brno",
    "tagline": "Brno · est. 2023",
    "brand": {
      "from": "#6B03E5",
      "to": "#F815B3"
    },
    "popularity": 82,
    "popularityNote": "Trustpilot 4.5 (1 137 recenzí)",
    "supportRating": 4.5,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "NEW20",
      "label": "20% sleva na všechny nové challange",
      "url": "https://www.fintokei.com",
      "discount": 20
    },
    "loyaltyProgram": true,
    "challenges": [
      {
        "name": "StartTrader",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 2,
        "profitTargetP2": 3,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 50,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 3,
        "payoutRaw": "Do 3 h",
        "prices": {
          "5000": 44,
          "20000": 119,
          "50000": 244,
          "100000": 419
        }
      },
      {
        "name": "ProTrader",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 6,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 3,
        "payoutRaw": "Do 3 h",
        "prices": {
          "10000": 99,
          "20000": 159,
          "50000": 319,
          "100000": 529,
          "200000": 1149,
          "400000": 2399
        }
      },
      {
        "name": "ProTrader Swing",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 6,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 3,
        "payoutRaw": "Do 3 h",
        "prices": {
          "50000": 319
        }
      },
      {
        "name": "SwiftTrader",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 100,
        "payoutFreq": "Bi-weekly + min. +3% profit na",
        "payoutHours": 0,
        "payoutRaw": "Instantně",
        "prices": {
          "10000": 119,
          "20000": 179,
          "50000": 369,
          "100000": 599,
          "200000": 1299
        }
      }
    ],
    "timeMin": 3,
    "timeMax": 180,
    "newsTrading": true,
    "maxLeverage": "1:25",
    "commissionFree": [],
    "avgPayout": 3881,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "TradingView",
      "MT5",
      "cTrader"
    ],
    "foundedYear": 2023,
    "webLanguages": [
      "CS",
      "EN",
      "JA",
      "IT"
    ],
    "supportLanguages": [
      "CS",
      "EN",
      "JA",
      "IT"
    ],
    "restrictedCountries": [
      "USA",
      "Indie",
      "Rusko",
      "Bělorusko",
      "KLDR",
      "Írán",
      "Myanmar",
      "Sýrie",
      "Jemen",
      "Kuba",
      "Venezuela",
      "Súdán"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire",
      "E-wallet"
    ],
    "education": "academy",
    "news": {
      "headline": "Česko-japonská prop firma pod záštitou Purple Group (fintech od 2011). XP loyalty program, sub-sekundové schvalování výp",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "ftmo",
    "name": "FTMO",
    "initials": "FT",
    "hq": "Globální",
    "tagline": "Globální · est. 2015",
    "brand": {
      "from": "#0F172A",
      "to": "#1E40AF"
    },
    "popularity": 32,
    "popularityNote": "Trustpilot 4.8 (40 000 recenzí)",
    "supportRating": 4.8,
    "supportNote": "24/7 chat",
    "campaign": null,
    "loyaltyProgram": true,
    "challenges": [
      {
        "name": "FTMO Challenge 2-Step",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "10000": 96,
          "25000": 270,
          "50000": 373,
          "100000": 583,
          "200000": 1166
        }
      },
      {
        "name": "FTMO Challenge 1-Step",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 10,
        "payoutSplit": 90,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "10000": 85,
          "25000": 215,
          "50000": 344,
          "100000": 539,
          "200000": 1079
        }
      },
      {
        "name": "FTMO Challenge 2-Step Swing",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "10000": 96,
          "25000": 270,
          "50000": 373,
          "100000": 583
        }
      }
    ],
    "timeMin": 4,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:100",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT4",
      "MT5",
      "cTrader"
    ],
    "foundedYear": 2015,
    "webLanguages": [
      "EN",
      "AR",
      "CS",
      "ES",
      "FR",
      "DE",
      "HE",
      "IT",
      "JA",
      "PL",
      "PT",
      "RU",
      "SR",
      "SW",
      "FIL",
      "TR",
      "UK",
      "VI",
      "RO",
      "SV"
    ],
    "supportLanguages": [
      "EN",
      "AR",
      "CS",
      "ES",
      "FR",
      "DE",
      "HE",
      "IT",
      "JA",
      "PL",
      "PT",
      "RU",
      "SR",
      "SW",
      "FIL",
      "TR",
      "UK",
      "VI",
      "RO",
      "SV"
    ],
    "restrictedCountries": [
      "USA",
      "Írán",
      "Sýrie",
      "Myanmar",
      "KLDR",
      "Afghánistán",
      "AI",
      "AG",
      "BT",
      "Kuba"
    ],
    "paymentMethods": [
      "Karta",
      "Wire",
      "Krypto"
    ],
    "education": "academy",
    "news": {
      "headline": "Prague-based prop trading firm founded in 2015, one of the largest and most established prop firms globally, offering 1-",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "the5ers",
    "name": "The5ers",
    "initials": "TH",
    "hq": "Globální",
    "tagline": "Globální · est. 2016",
    "brand": {
      "from": "#7C3AED",
      "to": "#A78BFA"
    },
    "popularity": 32,
    "popularityNote": "Trustpilot 4.8 (26 867 recenzí)",
    "supportRating": 4.8,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "PROMO",
      "label": "10-year anniversary celebration",
      "url": "https://the5ers.com",
      "discount": 0
    },
    "loyaltyProgram": true,
    "challenges": [
      {
        "name": "Hyper Growth",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "5000": 260,
          "10000": 450,
          "20000": 850
        }
      },
      {
        "name": "High Stakes",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "5000": 39,
          "10000": 78,
          "20000": 165,
          "60000": 329,
          "100000": 545
        }
      },
      {
        "name": "Bootcamp",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 6,
        "profitTargetP2": 6,
        "maxDailyDD": 0,
        "maxOverallDD": 5,
        "payoutSplit": 50,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "100000": 281,
          "250000": 530
        }
      }
    ],
    "timeMin": 0,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:30",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader"
    ],
    "foundedYear": 2016,
    "webLanguages": [
      "EN",
      "ES"
    ],
    "supportLanguages": [
      "EN",
      "ES"
    ],
    "restrictedCountries": [
      "USA",
      "Afghánistán",
      "Bělorusko",
      "BI",
      "CF",
      "Kuba",
      "CG",
      "DR Kongo",
      "ER",
      "GN",
      "GW",
      "Irák"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire",
      "E-wallet"
    ],
    "education": "academy",
    "news": {
      "headline": "Israel-based proprietary trading firm founded in 2016, offering multiple evaluation paths (Hyper Growth 1-step, High Sta",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "alpha-capital",
    "name": "Alpha Capital Group",
    "initials": "AC",
    "hq": "Globální",
    "tagline": "Globální · est. 2022",
    "brand": {
      "from": "#8B5CF6",
      "to": "#A78BFA"
    },
    "popularity": 30,
    "popularityNote": "Trustpilot 4.7 (19 000 recenzí)",
    "supportRating": 4.7,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "TRUSTED",
      "label": "Sleva 0 %",
      "url": "https://alphacapitalgroup.uk",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "Alpha One",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 50,
          "10000": 97,
          "25000": 197,
          "50000": 297,
          "100000": 497,
          "200000": 997
        }
      },
      {
        "name": "Alpha Pro 6%",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 6,
        "profitTargetP2": 6,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 40,
          "10000": 77,
          "25000": 167,
          "50000": 257,
          "100000": 427,
          "200000": 847
        }
      },
      {
        "name": "Alpha Pro 8%",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 4,
        "maxOverallDD": 8,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 77,
          "10000": 97,
          "25000": 197,
          "50000": 297,
          "100000": 547,
          "200000": 1097
        }
      },
      {
        "name": "Alpha Pro 10%",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 50,
          "10000": 97,
          "25000": 197,
          "50000": 297,
          "100000": 497,
          "200000": 997
        }
      },
      {
        "name": "Alpha Swing",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 70,
          "10000": 127,
          "25000": 227,
          "50000": 327,
          "100000": 577,
          "200000": 1097
        }
      },
      {
        "name": "Alpha Three",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 4,
        "maxDailyDD": 4,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "10000": 67,
          "25000": 157,
          "50000": 247,
          "100000": 397,
          "200000": 697
        }
      }
    ],
    "timeMin": 1,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:30",
    "commissionFree": [
      "Forex",
      "Indexy",
      "Zlato",
      "Ropa"
    ],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader",
      "DXtrade",
      "TradeLocker"
    ],
    "foundedYear": 2022,
    "webLanguages": [
      "EN"
    ],
    "supportLanguages": [
      "EN"
    ],
    "restrictedCountries": [
      "Afghánistán",
      "Bělorusko",
      "Írán",
      "KLDR",
      "Rusko",
      "Sýrie",
      "Venezuela"
    ],
    "paymentMethods": [
      "Karta",
      "Wire",
      "E-wallet",
      "Wise"
    ],
    "education": "academy",
    "news": {
      "headline": "UK-based proprietary trading firm (founded November 2021, London) offering simulated forex/CFD evaluations up to $200K w",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "fundingpips",
    "name": "FundingPips",
    "initials": "FP",
    "hq": "Globální",
    "tagline": "Globální · est. 2022",
    "brand": {
      "from": "#0EA5E9",
      "to": "#1FD3DC"
    },
    "popularity": 30,
    "popularityNote": "Trustpilot 4.5 (52 648 recenzí)",
    "supportRating": 4.5,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "",
      "label": "Discount codes (e.g. VIBES) provide 20% off any challenge plan",
      "url": "https://fundingpips.com",
      "discount": 0
    },
    "loyaltyProgram": true,
    "challenges": [
      {
        "name": "1-Step Challenge",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 59,
          "10000": 89,
          "25000": 189,
          "50000": 299,
          "100000": 555
        }
      },
      {
        "name": "2-Step Standard Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 36,
          "10000": 59,
          "25000": 159,
          "50000": 289,
          "100000": 529
        }
      },
      {
        "name": "2-Step Pro Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 6,
        "profitTargetP2": 6,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "10000": 79,
          "25000": 199,
          "50000": 359,
          "100000": 599,
          "200000": 998
        }
      },
      {
        "name": "Zero (Instant Funding)",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 95,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 69,
          "25000": 199,
          "50000": 299,
          "100000": 499,
          "200000": 998
        }
      }
    ],
    "timeMin": 3,
    "timeMax": null,
    "newsTrading": false,
    "maxLeverage": "1:100",
    "commissionFree": [
      "Indexy",
      "Krypto"
    ],
    "avgPayout": 2500,
    "robotsAllowed": false,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader",
      "Match-Trader"
    ],
    "foundedYear": 2022,
    "webLanguages": [
      "EN",
      "AR",
      "ES",
      "FR",
      "HI",
      "NL",
      "UR"
    ],
    "supportLanguages": [
      "EN",
      "AR",
      "ES",
      "FR",
      "HI",
      "NL",
      "UR"
    ],
    "restrictedCountries": [
      "USA",
      "Írán",
      "AE",
      "VN",
      "KLDR",
      "Sýrie",
      "Kuba"
    ],
    "paymentMethods": [
      "Krypto",
      "E-wallet"
    ],
    "education": "academy",
    "news": {
      "headline": "Dubai-based prop trading firm founded in 2022 by Khaled Ayesh under FP Funding LLC / Funding Pips Services Ltd. Reports ",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "top-one-trader",
    "name": "Top One Trader",
    "initials": "TO",
    "hq": "Globální",
    "tagline": "Globální · est. 2023",
    "brand": {
      "from": "#1F2937",
      "to": "#475569"
    },
    "popularity": 30,
    "popularityNote": "Trustpilot 4.5 (3 149 recenzí)",
    "supportRating": 4.5,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "PRO",
      "label": "Sleva 0 %",
      "url": "https://www.toponetrader.com/",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "Flash 1-Step",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 7,
        "payoutSplit": 90,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 2,
        "payoutRaw": "Do 2 h",
        "prices": {
          "5000": 19,
          "10000": 43,
          "25000": 99,
          "50000": 179,
          "100000": 299,
          "200000": 539
        }
      },
      {
        "name": "Pro 2-Step",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 4,
        "maxOverallDD": 9,
        "payoutSplit": 90,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 2,
        "payoutRaw": "Do 2 h",
        "prices": {
          "5000": 23,
          "10000": 45,
          "25000": 119,
          "50000": 209,
          "100000": 499,
          "150000": 699
        }
      },
      {
        "name": "Instant Funding",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 90,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 2,
        "payoutRaw": "Do 2 h",
        "prices": {
          "5000": 41,
          "10000": 79,
          "25000": 199,
          "50000": 319,
          "100000": 571,
          "200000": 1268
        }
      },
      {
        "name": "Instant Prime",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 100,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 2,
        "payoutRaw": "Do 2 h",
        "prices": {
          "5000": 28,
          "10000": 55,
          "25000": 139,
          "50000": 239,
          "100000": 449,
          "200000": 888
        }
      },
      {
        "name": "Nova Challenge",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 100,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 2,
        "payoutRaw": "Do 2 h",
        "prices": {
          "25000": 7
        }
      }
    ],
    "timeMin": 0,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:10",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader",
      "Match-Trader",
      "TradeLocker",
      "TradingView"
    ],
    "foundedYear": 2023,
    "webLanguages": [
      "EN"
    ],
    "supportLanguages": [
      "EN"
    ],
    "restrictedCountries": [
      "Afghánistán",
      "AL",
      "DZ",
      "AM",
      "AZ",
      "Bělorusko",
      "Kuba",
      "HT",
      "Írán",
      "Irák",
      "KZ",
      "KW"
    ],
    "paymentMethods": [
      "Krypto",
      "Wire",
      "E-wallet",
      "PayPal"
    ],
    "education": "academy",
    "news": {
      "headline": "US-based proprietary trading firm founded in 2023, headquartered in Sheridan, Wyoming. Known for ultra-fast payouts (ave",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "e8-markets",
    "name": "E8 Markets",
    "initials": "EM",
    "hq": "Globální",
    "tagline": "Globální · est. 2021",
    "brand": {
      "from": "#F97316",
      "to": "#EA580C"
    },
    "popularity": 29,
    "popularityNote": "Trustpilot 4.4 (3 227 recenzí)",
    "supportRating": 4.4,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "TRUSTED",
      "label": "Sleva 0 %",
      "url": "https://e8markets.com",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "E8 One",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 9,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "5000": 40,
          "10000": 78,
          "25000": 158,
          "50000": 250,
          "100000": 398,
          "200000": 798,
          "500000": 1998
        }
      },
      {
        "name": "E8 Signature",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 6,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 4,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "25000": 110,
          "50000": 150,
          "100000": 260,
          "150000": 390
        }
      },
      {
        "name": "E8 Track",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 4,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "10000": 54,
          "25000": 128,
          "50000": 288,
          "100000": 588,
          "200000": 1188,
          "400000": 2357
        }
      },
      {
        "name": "E8 Classic",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 4,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 72,
        "payoutRaw": "Do týdne",
        "prices": {
          "5000": 48,
          "25000": 158,
          "50000": 298,
          "100000": 498,
          "200000": 998
        }
      }
    ],
    "timeMin": 0,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:30",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader",
      "Match-Trader",
      "TradeLocker",
      "NinjaTrader",
      "TradingView"
    ],
    "foundedYear": 2021,
    "webLanguages": [
      "EN",
      "ES",
      "PT",
      "AR",
      "TR",
      "FR",
      "DE",
      "ID",
      "VI",
      "HI",
      "JA",
      "NL",
      "IT",
      "KO",
      "PL",
      "ZH",
      "MS",
      "TH",
      "CS",
      "RU",
      "UK",
      "HU",
      "RO"
    ],
    "supportLanguages": [
      "EN",
      "ES",
      "PT",
      "AR",
      "TR",
      "FR",
      "DE",
      "ID",
      "VI",
      "HI",
      "JA",
      "NL",
      "IT",
      "KO",
      "PL",
      "ZH",
      "MS",
      "TH",
      "CS",
      "RU",
      "UK",
      "HU",
      "RO"
    ],
    "restrictedCountries": [
      "Afghánistán",
      "AL",
      "DZ",
      "Bělorusko",
      "BI",
      "CF",
      "CG",
      "DR Kongo",
      "Kuba",
      "ET",
      "HK",
      "Írán"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire"
    ],
    "education": "videos",
    "news": {
      "headline": "E8 Markets (formerly E8 Funding) is a US-headquartered prop trading firm founded in 2021, offering multi-asset simulated",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "fundednext",
    "name": "FundedNext",
    "initials": "FN",
    "hq": "Globální",
    "tagline": "Globální · est. 2022",
    "brand": {
      "from": "#22C55E",
      "to": "#0EA5E9"
    },
    "popularity": 29,
    "popularityNote": "Trustpilot 4.5 (62 711 recenzí)",
    "supportRating": 4.5,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "",
      "label": "Payout processed within 24 hours or FundedNext pays $1,000 extra",
      "url": "https://fundednext.com",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "Stellar 2-Step",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "6000": 59.99,
          "15000": 119.99,
          "25000": 199.99,
          "50000": 299.99,
          "100000": 549.99,
          "200000": 1099.99
        }
      },
      {
        "name": "Stellar 1-Step",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "6000": 59.99,
          "15000": 119.99,
          "25000": 199.99,
          "50000": 299.99,
          "100000": 549.99,
          "200000": 1099.99
        }
      },
      {
        "name": "Stellar Lite",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 4,
        "profitTargetP2": 4,
        "maxDailyDD": 4,
        "maxOverallDD": 8,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 32.99,
          "10000": 59.99,
          "25000": 139.99,
          "50000": 229.99,
          "100000": 399.99,
          "200000": 798.99
        }
      },
      {
        "name": "Stellar Instant",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 70,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "2000": 59,
          "5000": 149,
          "10000": 299,
          "20000": 599
        }
      }
    ],
    "timeMin": 5,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:100",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT4",
      "MT5",
      "cTrader",
      "Match-Trader",
      "TradingView",
      "Tradovate"
    ],
    "foundedYear": 2022,
    "webLanguages": [
      "EN"
    ],
    "supportLanguages": [
      "EN"
    ],
    "restrictedCountries": [
      "USA",
      "Bangladéš",
      "Myanmar",
      "Bělorusko",
      "KLDR",
      "Sýrie",
      "GD",
      "TD",
      "MY",
      "BZ",
      "AG",
      "CV"
    ],
    "paymentMethods": [
      "Karta",
      "PayPal",
      "Krypto"
    ],
    "education": "videos",
    "news": {
      "headline": "FundedNext is a UAE-based proprietary trading firm founded in 2022 offering challenge-based simulated funded accounts on",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "rebelsfunding",
    "name": "RebelsFunding",
    "initials": "RF",
    "hq": "Globální",
    "tagline": "Globální · est. 2023",
    "brand": {
      "from": "#DC2626",
      "to": "#EF4444"
    },
    "popularity": 29,
    "popularityNote": "Trustpilot 4.4 (2 300 recenzí)",
    "supportRating": 4.4,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "",
      "label": "Promotional discount displayed on homepage for new traders' first challenge purc",
      "url": "https://www.rebelsfunding.com/",
      "discount": 30
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "RF Copper",
        "steps": 4,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 5,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 12,
        "payoutRaw": "Do 12 h",
        "prices": {
          "5000": 25,
          "10000": 49,
          "25000": 119,
          "50000": 229,
          "100000": 399,
          "200000": 649,
          "320000": 890
        }
      },
      {
        "name": "RF Bronze",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 5,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 90,
        "payoutFreq": "On-demand",
        "payoutHours": 12,
        "payoutRaw": "Do 12 h",
        "prices": {
          "5000": 40,
          "10000": 70,
          "25000": 150,
          "50000": 280,
          "100000": 480,
          "160000": 660
        }
      },
      {
        "name": "RF Silver",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 90,
        "payoutFreq": "On-demand",
        "payoutHours": 12,
        "payoutRaw": "Do 12 h",
        "prices": {
          "2500": 35,
          "5000": 55,
          "10000": 85,
          "25000": 155,
          "40000": 230
        }
      },
      {
        "name": "RF Gold",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 6,
        "payoutSplit": 90,
        "payoutFreq": "On-demand",
        "payoutHours": 12,
        "payoutRaw": "Do 12 h",
        "prices": {
          "2500": 50,
          "5000": 75,
          "10000": 110,
          "25000": 190,
          "40000": 280
        }
      },
      {
        "name": "RF Diamond",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 0,
        "maxOverallDD": 5,
        "payoutSplit": 75,
        "payoutFreq": "On-demand",
        "payoutHours": 12,
        "payoutRaw": "Do 12 h",
        "prices": {
          "1000": 50,
          "5000": 100,
          "10000": 150,
          "25000": 250,
          "50000": 350,
          "100000": 500,
          "200000": 700,
          "320000": 890
        }
      }
    ],
    "timeMin": 5,
    "timeMax": 999,
    "newsTrading": true,
    "maxLeverage": "1:200",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": false,
    "mobileApp": true,
    "platforms": [
      "RF-Trader",
      "TradingView"
    ],
    "foundedYear": 2023,
    "webLanguages": [
      "EN"
    ],
    "supportLanguages": [
      "EN"
    ],
    "restrictedCountries": [
      "Írán",
      "KLDR",
      "Sýrie",
      "Pákistán"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire",
      "E-wallet"
    ],
    "education": "academy",
    "news": {
      "headline": "Slovakia-based proprietary trading firm (RIFM, s.r.o., Bratislava) launched in 2023, offering five evaluation programs (",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "fortraders",
    "name": "For Traders",
    "initials": "FT",
    "hq": "Globální",
    "tagline": "Globální · est. 2023",
    "brand": {
      "from": "#EC4899",
      "to": "#F472B6"
    },
    "popularity": 28,
    "popularityNote": "Trustpilot 4.4 (1 000 recenzí)",
    "supportRating": 4.4,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "MAYBOGO",
      "label": "Buy one challenge, get a second free plus 30% off",
      "url": "https://www.fortraders.com",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "Fast Challenge (1-Step) -",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 9,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 8,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "6000": 49,
          "15000": 99,
          "25000": 179,
          "50000": 249,
          "100000": 469
        }
      },
      {
        "name": "Classic Challenge (2-Step) -",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 4,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {}
      },
      {
        "name": "Strike Challenge (3-Step) -",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 4,
        "profitTargetP2": 4,
        "maxDailyDD": 3,
        "maxOverallDD": 5,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {}
      },
      {
        "name": "Instant Funding -",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 70,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {}
      }
    ],
    "timeMin": 3,
    "timeMax": null,
    "newsTrading": false,
    "maxLeverage": "1:125",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": false,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader",
      "TradeLocker"
    ],
    "foundedYear": 2023,
    "webLanguages": [
      "EN",
      "ES",
      "CS"
    ],
    "supportLanguages": [
      "EN",
      "ES",
      "CS"
    ],
    "restrictedCountries": [
      "Pákistán",
      "Írán",
      "Sýrie",
      "Myanmar",
      "Bangladéš",
      "KLDR",
      "Rusko",
      "Bělorusko",
      "Kuba",
      "LB",
      "Libye",
      "Súdán"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto"
    ],
    "education": "videos",
    "news": {
      "headline": "Dubai-based proprietary trading firm founded in 2023 offering Forex, Futures and Crypto evaluation challenges with up to",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "blueberry-funded",
    "name": "Blueberry Funded",
    "initials": "BF",
    "hq": "Globální",
    "tagline": "Globální · est. 2024",
    "brand": {
      "from": "#3B82F6",
      "to": "#60A5FA"
    },
    "popularity": 27,
    "popularityNote": "Trustpilot 4.2 (1 422 recenzí)",
    "supportRating": 4.2,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "",
      "label": "Sleva 0 %",
      "url": "https://blueberryfunded.com/",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "1-Step Challenge",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 40,
          "10000": 75,
          "25000": 150,
          "50000": 275,
          "100000": 550,
          "200000": 1100
        }
      },
      {
        "name": "2-Step Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 40,
          "10000": 67,
          "25000": 150,
          "50000": 300,
          "100000": 590,
          "200000": 1180
        }
      },
      {
        "name": "Prime 2-Step 2.",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 6,
        "maxDailyDD": 4,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "2500": 30
        }
      },
      {
        "name": "Prime 2-Step",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 6,
        "maxDailyDD": 4,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 55,
          "10000": 90,
          "25000": 165,
          "50000": 325,
          "100000": 650,
          "200000": 1170
        }
      },
      {
        "name": "Rapid 10-Day",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 5,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 4,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "10000": 50,
          "25000": 100,
          "50000": 200,
          "100000": 300
        }
      },
      {
        "name": "Synthetic Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 4,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 25,
          "10000": 50,
          "25000": 115,
          "50000": 225,
          "100000": 450
        }
      },
      {
        "name": "Instant Elite 2.",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "2500": 100
        }
      },
      {
        "name": "Instant Elite",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 200,
          "10000": 400,
          "25000": 800,
          "50000": 1500
        }
      },
      {
        "name": "Instant Lite 1.",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "1250": 42
        }
      },
      {
        "name": "Instant Lite 2.",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "2500": 65
        }
      },
      {
        "name": "Instant Lite",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 48,
        "payoutRaw": "Do 48 h",
        "prices": {
          "5000": 95,
          "10000": 145,
          "25000": 215,
          "50000": 420,
          "100000": 850
        }
      }
    ],
    "timeMin": 3,
    "timeMax": null,
    "newsTrading": false,
    "maxLeverage": "1:50",
    "commissionFree": [
      "Indexy",
      "Ropa",
      "Krypto"
    ],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT4",
      "MT5",
      "DXtrade",
      "TradeLocker"
    ],
    "foundedYear": 2024,
    "webLanguages": [
      "EN"
    ],
    "supportLanguages": [
      "EN"
    ],
    "restrictedCountries": [
      "USA",
      "AU",
      "AE",
      "Rusko",
      "Kuba",
      "Írán",
      "Irák",
      "Myanmar",
      "KLDR",
      "Somálsko",
      "Sýrie",
      "Jemen"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire",
      "E-wallet"
    ],
    "education": "videos",
    "news": {
      "headline": "Broker-backed prop firm launched in 2024 by Blueberry Markets (ASIC-regulated parent broker), registered in St. Vincent ",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "eightcap-markets",
    "name": "Eightcap Challenges",
    "initials": "EC",
    "hq": "Globální",
    "tagline": "Globální · est. 2025",
    "brand": {
      "from": "#0F766E",
      "to": "#14B8A6"
    },
    "popularity": 27,
    "popularityNote": "Trustpilot 4.0 (3 429 recenzí)",
    "supportRating": 4.0,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "PROPINDER20",
      "label": "Sleva 0 %",
      "url": "https://challenges.eightcap.com/",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "1-Phase Challenge",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 8,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 69,
          "10000": 119,
          "25000": 259,
          "50000": 429,
          "100000": 659,
          "200000": 1299
        }
      },
      {
        "name": "2-Phase Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 8,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 59,
          "10000": 99,
          "25000": 219,
          "50000": 389,
          "100000": 599,
          "200000": 1199
        }
      }
    ],
    "timeMin": 5,
    "timeMax": null,
    "newsTrading": false,
    "maxLeverage": "1:100",
    "commissionFree": [
      "Krypto"
    ],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT4",
      "MT5",
      "TradeLocker"
    ],
    "foundedYear": 2025,
    "webLanguages": [
      "EN"
    ],
    "supportLanguages": [
      "EN"
    ],
    "restrictedCountries": [
      "USA",
      "AU",
      "Kuba",
      "Írán",
      "Irák",
      "KLDR",
      "Myanmar",
      "Rusko",
      "Somálsko",
      "Sýrie",
      "CF",
      "DR Kongo"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire"
    ],
    "education": "academy",
    "news": {
      "headline": "Broker-backed prop arm of Eightcap (multi-regulated CFD broker, FCA/ASIC/CySEC/SCB). Relaunched in November 2025 as 'Eig",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "think-capital",
    "name": "ThinkCapital",
    "initials": "TC",
    "hq": "Globální",
    "tagline": "Globální · est. 2024",
    "brand": {
      "from": "#0891B2",
      "to": "#06B6D4"
    },
    "popularity": 27,
    "popularityNote": "Trustpilot 4.0 (608 recenzí)",
    "supportRating": 4.0,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "",
      "label": "Bolt instant funding accounts available without a challenge, starting from $49.",
      "url": "https://www.thinkcapital.com",
      "discount": 0
    },
    "loyaltyProgram": false,
    "challenges": [
      {
        "name": "Lightning 1-Step",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 336,
        "payoutRaw": "Do 14 dnů",
        "prices": {
          "5000": 59,
          "10000": 99,
          "25000": 199,
          "50000": 299,
          "100000": 499,
          "200000": 1099
        }
      },
      {
        "name": "Dual Step 2-Step",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 9,
        "profitTargetP2": 5,
        "maxDailyDD": 4,
        "maxOverallDD": 7,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 336,
        "payoutRaw": "Do 14 dnů",
        "prices": {
          "5000": 59,
          "10000": 99,
          "25000": 199,
          "50000": 299,
          "100000": 499,
          "200000": 1099
        }
      },
      {
        "name": "Nexus 3-Step",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 7,
        "profitTargetP2": 6,
        "maxDailyDD": 4,
        "maxOverallDD": 8,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 336,
        "payoutRaw": "Do 14 dnů",
        "prices": {
          "5000": 39,
          "10000": 79,
          "25000": 139,
          "50000": 199,
          "100000": 349,
          "200000": 749
        }
      },
      {
        "name": "Bolt Instant Funding",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Bi-weekly",
        "payoutHours": 336,
        "payoutRaw": "Do 14 dnů",
        "prices": {}
      }
    ],
    "timeMin": 3,
    "timeMax": null,
    "newsTrading": false,
    "maxLeverage": "1:30",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "TradingView"
    ],
    "foundedYear": 2024,
    "webLanguages": [
      "EN",
      "ES",
      "JA",
      "DE",
      "ZH"
    ],
    "supportLanguages": [
      "EN",
      "ES",
      "JA",
      "DE",
      "ZH"
    ],
    "restrictedCountries": [
      "Afghánistán",
      "AL",
      "AU",
      "Myanmar",
      "BI",
      "CF",
      "Kuba",
      "CY",
      "Írán",
      "XK",
      "LB",
      "Libye"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto"
    ],
    "education": "blog",
    "news": {
      "headline": "Broker-backed prop trading firm launched in 2024 and powered by ThinkMarkets, offering 1-step (Lightning), 2-step (Dual ",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "instant-funding",
    "name": "Instant Funding",
    "initials": "IF",
    "hq": "Globální",
    "tagline": "Globální · est. 2021",
    "brand": {
      "from": "#FCD34D",
      "to": "#F59E0B"
    },
    "popularity": 22,
    "popularityNote": "Trustpilot 4.6 (4 634 recenzí)",
    "supportRating": 4.6,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "",
      "label": "Promo codes LEGEND20/LEGEND25 offering 20-35% off challenge fees",
      "url": "https://instantfunding.com",
      "discount": 0
    },
    "loyaltyProgram": true,
    "challenges": [
      {
        "name": "Instant Funding",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 0,
        "profitTargetP2": null,
        "maxDailyDD": 0,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "Weekly",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "625": 44,
          "1250": 79,
          "2500": 159,
          "5000": 299,
          "10000": 549,
          "20000": 999,
          "40000": 1899,
          "80000": 3460,
          "120000": 5499
        }
      },
      {
        "name": "One-Phase Challenge",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 3,
        "maxOverallDD": 8,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 49,
          "10000": 89,
          "25000": 199,
          "50000": 349,
          "100000": 599,
          "200000": 1199
        }
      },
      {
        "name": "Two-Phase Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 8,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 39,
          "10000": 79,
          "25000": 169,
          "50000": 289,
          "100000": 499,
          "200000": 999
        }
      }
    ],
    "timeMin": 0,
    "timeMax": null,
    "newsTrading": false,
    "maxLeverage": "1:100",
    "commissionFree": [],
    "avgPayout": 2500,
    "robotsAllowed": false,
    "mobileApp": true,
    "platforms": [
      "MT5",
      "cTrader",
      "Match-Trader",
      "DXtrade"
    ],
    "foundedYear": 2021,
    "webLanguages": [
      "EN",
      "FR",
      "IT",
      "ES",
      "NL",
      "PT",
      "DE",
      "HI",
      "JA",
      "MS"
    ],
    "supportLanguages": [
      "EN",
      "FR",
      "IT",
      "ES",
      "NL",
      "PT",
      "DE",
      "HI",
      "JA",
      "MS"
    ],
    "restrictedCountries": [
      "USA",
      "Afghánistán",
      "KLDR",
      "Írán"
    ],
    "paymentMethods": [
      "Karta",
      "Krypto",
      "Wire",
      "E-wallet"
    ],
    "education": "videos",
    "news": {
      "headline": "UK-based no-evaluation prop firm (Acello Ltd, London) founded 2020-2021 that pioneered the 'instant funding' model with ",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  },
  {
    "id": "goat-funded-trader",
    "name": "Goat Funded Trader",
    "initials": "GF",
    "hq": "Globální",
    "tagline": "Globální · est. 2023",
    "brand": {
      "from": "#F59E0B",
      "to": "#D97706"
    },
    "popularity": 19,
    "popularityNote": "Trustpilot 3.9 (3 500 recenzí)",
    "supportRating": 3.9,
    "supportNote": "24/7 chat",
    "campaign": {
      "code": "HBGFT",
      "label": "Buy one get one plus 50% off promotion",
      "url": "https://www.goatfundedtrader.com",
      "discount": 0
    },
    "loyaltyProgram": true,
    "challenges": [
      {
        "name": "1-Step Challenge",
        "steps": 1,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": null,
        "maxDailyDD": 4,
        "maxOverallDD": 6,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 59,
          "10000": 89,
          "25000": 178,
          "50000": 297,
          "100000": 519,
          "200000": 998
        }
      },
      {
        "name": "2-Step Challenge",
        "steps": 2,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 10,
        "profitTargetP2": 5,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 80,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 39,
          "10000": 69,
          "25000": 158,
          "50000": 268,
          "100000": 598,
          "200000": 1098
        }
      },
      {
        "name": "3-Step Challenge",
        "steps": 3,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": 6,
        "profitTargetP2": 6,
        "maxDailyDD": 4,
        "maxOverallDD": 8,
        "payoutSplit": 90,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "10000": 55,
          "25000": 119,
          "50000": 219,
          "100000": 439,
          "200000": 819
        }
      },
      {
        "name": "Instant Funding",
        "steps": 0,
        "assets": [
          "FX",
          "Crypto",
          "Indices",
          "Commodities"
        ],
        "profitTargetP1": null,
        "profitTargetP2": null,
        "maxDailyDD": 5,
        "maxOverallDD": 10,
        "payoutSplit": 50,
        "payoutFreq": "On-demand",
        "payoutHours": 24,
        "payoutRaw": "Do 24 h",
        "prices": {
          "5000": 199,
          "10000": 379,
          "25000": 899,
          "50000": 1699,
          "100000": 3299
        }
      }
    ],
    "timeMin": 3,
    "timeMax": null,
    "newsTrading": true,
    "maxLeverage": "1:100",
    "commissionFree": [],
    "avgPayout": 2180,
    "robotsAllowed": true,
    "mobileApp": true,
    "platforms": [
      "MT4",
      "MT5",
      "cTrader",
      "TradeLocker",
      "Match-Trader"
    ],
    "foundedYear": 2023,
    "webLanguages": [
      "EN",
      "ES",
      "DE",
      "FR",
      "HI",
      "IT"
    ],
    "supportLanguages": [
      "EN",
      "ES",
      "DE",
      "FR",
      "HI",
      "IT"
    ],
    "restrictedCountries": [
      "USA",
      "Kuba",
      "Írán",
      "JO",
      "LB",
      "Libye",
      "Sýrie",
      "Bangladéš",
      "HK",
      "JP",
      "MY",
      "Myanmar"
    ],
    "paymentMethods": [
      "Karta",
      "PayPal",
      "Krypto",
      "E-wallet"
    ],
    "education": "academy",
    "news": {
      "headline": "Prop trading firm founded in 2023, operating via Wishes Tower International Limited (Hong Kong) and Goat Funded LTD (Sai",
      "date": "20. 5. 2026",
      "tag": "Update"
    }
  }
];
// AUTO-END PROP_FIRMS


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
