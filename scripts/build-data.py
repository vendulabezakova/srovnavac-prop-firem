#!/usr/bin/env python3
"""Build design/data.js PROP_FIRMS + REVIEWS from design/raw-data/ JSONs.

Reads všechny *.json soubory v design/raw-data/, namapuje na shape který
očekává section-pricing.jsx (window.PROP_FIRMS), a zapíše do data.js
mezi `// AUTO-START PROP_FIRMS` / `// AUTO-END PROP_FIRMS` markery. Stejně
pro REVIEWS (synthesizováno z trustpilot.topPositiveThemes a sentiment.mainPraises).

Schema variance: většina firem má atributy na top-level (data.languages, data.platforms),
fintokei je legacy s daty nested v challenges[0].details. Helper `pick()` zkouší
oba kanály.

Run: python3 scripts/build-data.py (z repo root)
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = REPO_ROOT / 'design' / 'raw-data'
DATA_JS = REPO_ROOT / 'design' / 'data.js'

# Brand colors per firm. Nove firmy maji distinkce pro vizualni rozdil v tabulce.
BRAND_COLORS = {
    'fintokei':           ('#6B03E5', '#F815B3'),
    'ftmo':               ('#0F172A', '#1E40AF'),
    'fundednext':         ('#22C55E', '#0EA5E9'),
    'fundingpips':        ('#0EA5E9', '#1FD3DC'),
    'goat-funded-trader': ('#F59E0B', '#D97706'),
    'alpha-capital':      ('#8B5CF6', '#A78BFA'),
    'blueberry-funded':   ('#3B82F6', '#60A5FA'),
    'e8-markets':         ('#F97316', '#EA580C'),
    'eightcap-markets':   ('#0F766E', '#14B8A6'),
    'fortraders':         ('#EC4899', '#F472B6'),
    'instant-funding':    ('#FCD34D', '#F59E0B'),
    'rebelsfunding':      ('#DC2626', '#EF4444'),
    'the5ers':            ('#7C3AED', '#A78BFA'),
    'think-capital':      ('#0891B2', '#06B6D4'),
    'top-one-trader':     ('#1F2937', '#475569'),
}

LANG_MAP = {
    'cs': 'CS', 'sk': 'SK', 'en': 'EN', 'de': 'DE', 'pl': 'PL',
    'es': 'ES', 'fr': 'FR', 'it': 'IT', 'ja': 'JA', 'jp': 'JA',
    'ar': 'AR', 'zh': 'ZH', 'pt': 'PT', 'ru': 'RU', 'tr': 'TR',
    'vi': 'VI', 'th': 'TH', 'hu': 'HU', 'ro': 'RO', 'nl': 'NL',
    'bg': 'BG', 'hi': 'HI', 'id': 'ID',
}

COUNTRY_MAP = {
    'US': 'USA', 'IN': 'Indie', 'RU': 'Rusko', 'BY': 'Bělorusko',
    'KP': 'KLDR', 'IR': 'Írán', 'MM': 'Myanmar', 'SY': 'Sýrie',
    'YE': 'Jemen', 'CU': 'Kuba', 'VE': 'Venezuela', 'SD': 'Súdán',
    'SS': 'Jižní Súdán', 'AF': 'Afghánistán', 'SO': 'Somálsko', 'IQ': 'Irák',
    'PK': 'Pákistán', 'CD': 'DR Kongo', 'LY': 'Libye', 'ZW': 'Zimbabwe',
    'BD': 'Bangladéš',
}

# US is mostly OFAC-related for prop firms; PK/BD common too.
DEFAULT_RESTRICTED = ['USA', 'KLDR', 'Írán']


def pick(data, *keys, default=None):
    """Try multiple key paths. Each key can be dotted ('details.languages')."""
    for k in keys:
        parts = k.split('.')
        cur = data
        try:
            for p in parts:
                cur = cur[p]
            if cur is not None:
                return cur
        except (KeyError, TypeError):
            continue
    return default


def initials_of(name):
    parts = re.findall(r'[A-Z]', name)
    if len(parts) >= 2:
        return ''.join(parts[:2])
    words = name.split()
    if len(words) >= 2:
        return (words[0][0] + words[1][0]).upper()
    return name[:2].upper()


def strip_size(name):
    """Strip account size suffix: '5K', '$10K', '$1,250', trailing '- '."""
    # Order matters: most specific first
    s = re.sub(r'\s*-\s*$', '', name)  # trailing dash
    s = re.sub(r'\s*\$?\d{1,3}(,\d{3})*[Kk]?\s*$', '', s)  # size suffix
    s = re.sub(r'\s+', ' ', s).strip()
    return s or name


def format_payout(hours):
    if hours == 0 or hours is None:
        return 'Instantně' if hours == 0 else '—'
    if hours <= 1: return 'Do 1 h'
    if hours <= 24: return f'Do {int(hours)} h' if hours < 24 else 'Do 24 h'
    if hours <= 48: return 'Do 48 h'
    if hours <= 168: return 'Do týdne'
    return f'Do {int(hours // 24)} dnů'


def derive_assets(challenge_name, firm_data):
    """Best-effort asset categorization."""
    name = challenge_name.lower()
    # Default
    assets = ['FX', 'Crypto', 'Indices', 'Commodities']
    if 'futures' in name:
        return ['Indices', 'Commodities']
    if 'stocks' in name or 'equity' in name:
        return ['Stocks', 'FX']
    # Add Stocks if firm has it via commissionFree etc
    return assets


def map_payments(raw):
    """Normalize payment method labels to short tags used by quiz filter."""
    out = []
    for p in raw or []:
        pl = p.lower()
        if any(k in pl for k in ('visa', 'mastercard', 'jcb', 'apple pay', 'google pay', 'card', 'karta')):
            if 'Karta' not in out: out.append('Karta')
        if any(k in pl for k in ('crypto', 'btc', 'usdt', 'eth', 'sol')):
            if 'Krypto' not in out: out.append('Krypto')
        if any(k in pl for k in ('sepa', 'wire', 'bank transfer', 'bankovní', 'transfer')):
            if 'Wire' not in out: out.append('Wire')
        if 'wise' in pl:
            if 'Wise' not in out: out.append('Wise')
        if 'paypal' in pl:
            if 'PayPal' not in out: out.append('PayPal')
        if 'rise' in pl or 'walletory' in pl or 'e-wallet' in pl or 'ewallet' in pl:
            if 'E-wallet' not in out: out.append('E-wallet')
    return out or ['Wire', 'Krypto']


def map_platforms(raw):
    """Normalize platform names to standard set (MT4, MT5, cTrader, TradingView, DXtrade, NinjaTrader, ...)."""
    seen = set()
    out = []
    for p in raw or []:
        pl = p.strip()
        # Normalize a few common variants
        if pl.lower().startswith('mt4') or pl.lower() == 'metatrader 4':
            pl = 'MT4'
        elif pl.lower().startswith('mt5') or pl.lower() == 'metatrader 5':
            pl = 'MT5'
        elif pl.lower().startswith('ctrader'):
            pl = 'cTrader'
        elif pl.lower().startswith('tradingview') or 'tradingview' in pl.lower():
            pl = 'TradingView'
        elif pl.lower().startswith('dxtrade'):
            pl = 'DXtrade'
        elif pl.lower().startswith('ninjatrader'):
            pl = 'NinjaTrader'
        elif pl.lower().startswith('tradovate'):
            pl = 'Tradovate'
        if pl not in seen:
            seen.add(pl)
            out.append(pl)
    return out or ['MT4', 'MT5']


def map_languages(raw):
    """ISO2 lowercase → uppercase tags."""
    out = []
    for l in raw or []:
        code = str(l).strip().lower()
        if code:
            mapped = LANG_MAP.get(code, code.upper())
            if mapped not in out:
                out.append(mapped)
    return out or ['EN']


def map_countries(raw):
    out = []
    for c in raw or []:
        code = str(c).strip().upper()
        out.append(COUNTRY_MAP.get(code, code))
    # dedupe preserving order
    seen = set(); deduped = []
    for x in out:
        if x not in seen:
            seen.add(x); deduped.append(x)
    return deduped[:12] if deduped else DEFAULT_RESTRICTED


def map_commission_free(cfi):
    if not isinstance(cfi, dict):
        return []
    out = []
    label_map = {'forex': 'Forex', 'indices': 'Indexy', 'crypto': 'Krypto',
                 'gold': 'Zlato', 'oil': 'Ropa', 'stocks': 'Akcie'}
    for k, v in cfi.items():
        if v is True and k in label_map:
            out.append(label_map[k])
    return out


def map_education(edu):
    if isinstance(edu, dict):
        if edu.get('hasEducationForBeginners') and len(edu.get('features', [])) >= 4:
            return 'academy'
        if edu.get('features'):
            return 'videos'
        return 'blog'
    if isinstance(edu, str):
        return edu.lower() if edu.lower() in ('none', 'blog', 'videos', 'academy') else 'blog'
    return 'none'


def group_challenges(raw_challenges):
    """Group by stripped name; merge prices per challenge type."""
    groups = {}
    for ch in raw_challenges:
        name = ch.get('name', 'Challenge')
        type_name = strip_size(name)
        if type_name not in groups:
            groups[type_name] = {'base': ch, 'prices': {}, 'items': []}
        groups[type_name]['items'].append(ch)
        cap = ch.get('primary', {}).get('capitalUSD')
        price = ch.get('primary', {}).get('priceUSD')
        if cap and price:
            groups[type_name]['prices'][cap] = price
    return groups


def map_firm(data):
    fid = data['id']
    name = data['name']

    # Schema variance: prefer top-level keys, fallback to challenges[0].details / .primary
    first_ch = (data.get('challenges') or [{}])[0]
    first_det = first_ch.get('details', {}) or {}
    first_prim = first_ch.get('primary', {}) or {}

    # ── Reputační (popularity, support) ──
    pop_obj = pick(data, 'popularity') or pick(first_prim, 'popularity', default={})
    pop_score = round(pop_obj.get('overallPopularityScore', 70)) if isinstance(pop_obj, dict) else 70
    tp = pop_obj.get('trustpilot', {}) if isinstance(pop_obj, dict) else {}
    tp_score = tp.get('score', 4.0)
    tp_count = tp.get('reviewCount', 0)
    pop_note = f'Trustpilot {tp_score} ({tp_count:,} recenzí)'.replace(',', ' ') if tp_count else f'Popularity score {pop_score}/100'

    payout_stats = pop_obj.get('payoutStats', {}) if isinstance(pop_obj, dict) else {}
    avg_payout = payout_stats.get('avgPayoutUSD') or pick(data, 'averagePayoutUSD', 'avgPayout', default=2500)

    # ── Campaign ──
    # Format variance: list of objects OR list of plain strings (the5ers).
    campaigns = pick(data, 'currentCampaigns') or first_prim.get('currentCampaigns') or []
    campaign = None
    if campaigns:
        c = campaigns[0]
        if isinstance(c, dict):
            campaign = {
                'code': c.get('code', ''),
                'label': c.get('description', f'Sleva {c.get("discountPercentage", 0)} %')[:80],
                'url': c.get('landingPageUrl') or data.get('url', '#'),
                'discount': c.get('discountPercentage', 0),
            }
        elif isinstance(c, str):
            # Plain string — vyrobím pill bez kódu, label = string, link na firmu
            campaign = {
                'code': 'PROMO',
                'label': c[:80],
                'url': data.get('url', '#'),
                'discount': 0,
            }

    # ── Languages / countries / payments / platforms ──
    langs = map_languages(pick(data, 'languages') or first_det.get('languages') or [])
    countries = map_countries(pick(data, 'restrictedCountries') or first_det.get('restrictedCountries') or [])
    payments = map_payments(pick(data, 'paymentMethods') or first_det.get('paymentMethods') or [])
    platforms_raw = pick(data, 'platforms') or first_det.get('platforms') or []
    if not platforms_raw:
        # Union napříč challenges
        union = []
        for ch in data.get('challenges', []):
            for p in ch.get('details', {}).get('platforms', []):
                if p not in union: union.append(p)
        platforms_raw = union
    platforms = map_platforms(platforms_raw)

    commission_free = map_commission_free(first_det.get('commissionFreeInstruments', {}))
    education = map_education(pick(data, 'education') or first_det.get('education'))

    # ── Time limits ──
    tl = first_det.get('timeLimit', {})
    time_min = tl.get('minTradingDaysPerPhase', 0) or 0
    time_max_raw = tl.get('maxTradingDaysPerPhase', 0)
    time_max = time_max_raw if (time_max_raw and time_max_raw > 0) else None

    # ── Foundation year ──
    yio = pick(data, 'yearsInOperation') or first_det.get('yearsInOperation', 3)
    founded = 2026 - int(yio) if yio else 2023

    # ── HQ + tagline ──
    origin = first_det.get('origin') or pick(data, 'origin') or 'Globální'
    hq_main = re.split(r',|\+| - ', origin)[0].strip()[:30]
    tagline = f'{hq_main} · est. {founded}'

    # ── Challenges (group + merge) ──
    groups = group_challenges(data.get('challenges', []))
    challenges_out = []
    for type_name, group in groups.items():
        base = group['base']
        cp = base.get('primary', {})
        cdet = base.get('details', {})
        phases = cp.get('phases', [])
        challenges_out.append({
            'name': type_name,
            'steps': cp.get('steps', 1),
            'assets': derive_assets(type_name, data),
            'profitTargetP1': phases[0].get('profitTargetPercentage') if phases else None,
            'profitTargetP2': phases[1].get('profitTargetPercentage') if len(phases) > 1 else None,
            'maxDailyDD': phases[0].get('dailyDrawdownPercentage') if phases else 5,
            'maxOverallDD': phases[0].get('maxDrawdownPercentage') if phases else 10,
            'payoutSplit': cp.get('profitSplitPercentage', 80),
            'payoutFreq': cp.get('payoutFrequency', 'Monthly')[:30],
            'payoutHours': cp.get('payoutSpeedHours', 24),
            'payoutRaw': format_payout(cp.get('payoutSpeedHours', 24)),
            'prices': group['prices'],
        })

    # ── Detail-level fields (firma) ──
    brand_from, brand_to = BRAND_COLORS.get(fid, ('#6B03E5', '#F815B3'))

    firm = {
        'id': fid,
        'name': name,
        'initials': initials_of(name),
        'hq': hq_main,
        'tagline': tagline,
        'brand': {'from': brand_from, 'to': brand_to},
        # Reputační
        'popularity': pop_score,
        'popularityNote': pop_note,
        'supportRating': tp_score,
        'supportNote': '24/7 chat',
        'campaign': campaign,
        'loyaltyProgram': bool(pick(data, 'hasLoyaltyProgram') or first_det.get('hasLoyaltyProgram', False)),
        # Challenges
        'challenges': challenges_out,
        # Detail
        'timeMin': time_min,
        'timeMax': time_max,
        'newsTrading': bool(first_det.get('newsTradingAllowed', True)),
        'maxLeverage': first_det.get('maxLeverage') or '1:100',
        'commissionFree': commission_free,
        'avgPayout': avg_payout,
        'robotsAllowed': bool(first_det.get('eaRobotsAllowed', True)),
        'mobileApp': bool(pick(data, 'hasMobileApp') or first_det.get('hasMobileApp', True)),
        'platforms': platforms,
        'foundedYear': founded,
        'webLanguages': langs,
        'supportLanguages': langs,
        'restrictedCountries': countries,
        'paymentMethods': payments,
        'education': education,
        'news': {'headline': (data.get('comment') or f'{name} aktuální nabídka')[:120], 'date': '20. 5. 2026', 'tag': 'Update'},
    }
    return firm


# ── REVIEWS synthesis ──
AUTHORS_POS = ['Jakub D.', 'Tomáš P.', 'Lukáš H.', 'Karim S.', 'Petr V.', 'Marek K.', '@fx_pro',
               'Honza B.', 'Mike J.', 'Robert K.', '@swing_jp', 'Daniel F.', 'Sarah L.']
AUTHORS_NEG = ['Veronika M.', '@trader_42', 'Lara D.', 'Ondrej V.', '@skeptic_fx', 'Petr O.']
SOURCES = ['Trustpilot', 'Reddit', 'Twitter']
DATES = ['12. 5. 2026', '10. 5. 2026', '8. 5. 2026', '5. 5. 2026', '2. 5. 2026', '28. 4. 2026']


def synthesize_reviews(data):
    fid = data['id']
    pop_obj = pick(data, 'popularity') or pick(data.get('challenges', [{}])[0].get('primary', {}), 'popularity', default={})
    tp = pop_obj.get('trustpilot', {}) if isinstance(pop_obj, dict) else {}
    pos_themes = tp.get('topPositiveThemes', [])[:3]
    neg_themes = tp.get('topNegativeThemes', [])[:1]

    # Fallback to redditSentiment praises
    if not pos_themes:
        reddit = pop_obj.get('redditSentiment', {}) if isinstance(pop_obj, dict) else {}
        pos_themes = (reddit.get('mainPraises') or [])[:3]
        neg_themes = (reddit.get('mainComplaints') or [])[:1]

    # Fallback to generic
    if not pos_themes:
        pos_themes = ['Solidní podmínky a stabilní výplaty.',
                      'Férové pravidla, žádná překvapení.',
                      'Doporučuju pro začátečníky.']

    reviews = []
    seed = sum(ord(c) for c in fid)  # stable per firm
    for i, theme in enumerate(pos_themes):
        reviews.append({
            'author': AUTHORS_POS[(seed + i) % len(AUTHORS_POS)],
            'rating': 5 if i == 0 else 4,
            'text': str(theme)[:180],
            'date': DATES[i % len(DATES)],
            'source': SOURCES[(seed + i) % len(SOURCES)],
        })
    for j, theme in enumerate(neg_themes):
        reviews.append({
            'author': AUTHORS_NEG[(seed + j) % len(AUTHORS_NEG)],
            'rating': 3 if j == 0 else 2,
            'text': str(theme)[:180],
            'date': DATES[(j + 3) % len(DATES)],
            'source': SOURCES[(seed + j + 1) % len(SOURCES)],
        })
    return reviews


def js_value(v, indent=0):
    """Convert Python value to JS literal. Uses JSON syntax (compatible)."""
    return json.dumps(v, ensure_ascii=False, indent=2 if indent else None)


def format_firm_js(firm):
    """Pretty-print a single firm dict as JS object literal."""
    return '  ' + json.dumps(firm, ensure_ascii=False, indent=2).replace('\n', '\n  ')


def main():
    raw_files = sorted(RAW_DIR.glob('*.json'))
    firms = []
    reviews = {}
    for f in raw_files:
        data = json.load(f.open(encoding='utf-8'))
        firm = map_firm(data)
        if firm and firm['challenges']:
            firms.append(firm)
            reviews[firm['id']] = synthesize_reviews(data)

    # Sort firms by popularity (best first)
    firms.sort(key=lambda f: -f['popularity'])

    print(f'Mapped {len(firms)} firms from {len(raw_files)} JSONs.')
    print('Order (popularity desc):')
    for f in firms:
        print(f'  {f["id"]:25} pop={f["popularity"]:>3}  challenges={len(f["challenges"])}')

    # Build JS replacement blocks
    firms_js = 'window.PROP_FIRMS = [\n' + ',\n'.join(format_firm_js(f) for f in firms) + '\n];'
    reviews_js = 'window.REVIEWS = ' + json.dumps(reviews, ensure_ascii=False, indent=2) + ';'

    # Read existing data.js
    content = DATA_JS.read_text(encoding='utf-8')

    # Replace between markers
    def replace_block(text, marker_name, replacement):
        start = f'// AUTO-START {marker_name}'
        end = f'// AUTO-END {marker_name}'
        if start not in text or end not in text:
            print(f'WARN: marker {marker_name} not found — appending.')
            return text + f'\n\n{start}\n{replacement}\n{end}\n'
        before = text.split(start)[0]
        after = text.split(end)[1]
        return before + start + '\n' + replacement + '\n' + end + after

    content = replace_block(content, 'PROP_FIRMS', firms_js)
    content = replace_block(content, 'REVIEWS', reviews_js)

    DATA_JS.write_text(content, encoding='utf-8')
    print(f'\nWrote {DATA_JS}')


if __name__ == '__main__':
    main()
