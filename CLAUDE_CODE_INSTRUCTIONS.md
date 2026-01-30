# Target Heart Rate Calculator - Claude Code Instructions

## Project: targetheartratecalculator.org

### ✅ COMPLETED
- `/index.html` - 4-tab calculator (Max HR, Target HR, Zones, Karvonen)
- `/assets/css/styles.css` - Red cardio theme (#ef4444)
- `/assets/js/calculator.js` - All calculations + visual zones
- `/about/`, `/contact/`, `/privacy/`, `/terms/`
- `/blog/index.html` - 10 article listings
- `/sitemap.xml`, `/robots.txt`, `/favicon.svg`

### ✅ COMPLETED (Additional)
1. ✅ Generated 10 blog articles (2000+ words each)
2. ✅ Generated PNG favicons (16x16, 32x32, 48x48, apple-touch-icon 180x180, android-chrome 192x192, 512x512)
3. ✅ Generated OG image (1200x630 PNG with red theme)

### Blog Articles
1. max-heart-rate-by-age (2,900 searches)
2. target-heart-rate-chart (880)
3. exercise-heart-rate-by-age (2,400)
4. karvonen-formula-explained (720)
5. heart-rate-zones-for-training (480)
6. max-heart-rate-formula (1,600)
7. fat-burning-heart-rate-zone (supporting)
8. how-to-calculate-target-heart-rate (1,900)
9. resting-heart-rate-guide (supporting)
10. heart-rate-training-for-beginners (supporting)

### Key Formulas
- Standard: 220 - Age
- Tanaka: 208 - (0.7 × Age)
- Gulati (women): 206 - (0.88 × Age)
- HUNT: 211 - (0.64 × Age)
- Karvonen: (HRR × %) + Resting HR
- HRR = Max HR - Resting HR

### Training Zones
| Zone | % Max HR | Purpose |
|------|----------|---------|
| Warm-up | 50-60% | Recovery |
| Fat Burn | 60-70% | Weight loss |
| Cardio | 70-80% | Aerobic fitness |
| Hard | 80-90% | Performance |
| Peak | 90-100% | Max effort |

### Deploy
```bash
git init && git add . && git commit -m "Initial"
vercel --prod
```
