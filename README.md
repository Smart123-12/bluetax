<div align="center">

<img src="https://img.shields.io/badge/Tax%20Year-2026-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMSAxNUg5VjhoMnY5em00IDBoLTJWOGgydjl6Ii8+PC9zdmc+" alt="2026" />
<img src="https://img.shields.io/badge/Privacy-100%25%20Client--Side-green?style=for-the-badge" alt="Privacy" />
<img src="https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-orange?style=for-the-badge&logo=github" alt="GitHub Pages" />

# 💙 BlueTax

### *Keep More of Your Paycheck*

**A free, privacy-first US tax optimizer for W2 employees**

[🚀 Live Demo](https://smitparmar.github.io/bluetax) · [📖 How It Works](#how-it-works) · [🛠 Local Setup](#local-setup)

</div>

---

## ✨ What is BlueTax?

BlueTax is a **browser-based tax optimization tool** that helps U.S. salaried employees:

- 📊 Understand exactly where their money goes (federal, state, FICA)
- 💡 Discover personalized ways to **legally reduce their tax bill**
- 🔄 Work from **monthly take-home OR annual salary** — we reverse-engineer the rest
- 🔒 All **100% client-side** — your numbers never leave your browser

> **"Tell us what you take home → we tell you how to keep more."**

---

## 🎯 Who Is This For?

| User | Supported |
|------|-----------|
| W2 employees (California) | ✅ Full support |
| W2 employees (other states) | ✅ Federal + FICA |
| Self-employed / freelancers | 🔜 Phase 2 |
| RSU / stock compensation | 🔜 Phase 2 |

---

## ⚙️ Features

### 1. 🧙 Conversational 7-Step Wizard
One question at a time — no tax forms, no jargon.

| Step | Question |
|------|----------|
| 1 | Salary or monthly take-home? |
| 2 | Enter your income |
| 3 | Filing status |
| 4 | State (California fully supported) |
| 5 | 401(k) contributions |
| 6 | HSA contributions |
| 7 | Dependents (children under 17) |

### 2. 🧮 Real-Time 2026 Tax Engine
- **Federal**: Progressive brackets (10%–37%), 2026 IRS official numbers
- **California**: FTB brackets (1%–13.3%) + 1.1% CA SDI
- **FICA**: Social Security (6.2%, capped at **$184,500**) + Medicare (1.45% + 0.9% surtax)
- **Standard deductions**: $16,100 (Single), $32,200 (MFJ) — 2026 IRS

### 3. 🔄 Reverse Take-Home Estimator
Enter your monthly bank deposit — BlueTax uses a **binary search algorithm** to find your exact gross salary, converging within $10 accuracy in under 60 iterations.

### 4. 💡 Optimization Engine (5 Rules)
| Rule | Suggestion | Max Savings |
|------|-----------|-------------|
| R1 | Maximize 401(k) to $24,500 | ~$5,000–8,000/yr |
| R2 | Open/max HSA ($4,400–$8,750) | ~$1,000–2,500/yr |
| R3 | Child Tax Credit ($2,000/child) | Up to $6,000/yr |
| R4 | Dependent Care FSA ($5,000) | ~$1,500/yr |
| R5 | Itemized deductions hint | Varies |

### 5. 📊 Results Dashboard
- Net take-home (monthly + annual)
- Visual SVG arc gauge for effective tax rate
- Bar chart breakdown per tax type
- Color-coded savings recommendations

---

## 🔒 Privacy

```
All computation: JavaScript in your browser
Data storage:    None
Network calls:   None (after initial page load)
Login required:  No
```

Your income data is **never transmitted** anywhere.

---

## 🚀 Live Demo

**[https://smitparmar.github.io/bluetax](https://smitparmar.github.io/bluetax)**

Auto-deploys on every push to `main` via GitHub Actions.

---

## 🛠 Local Setup

```bash
# Clone the repo
git clone https://github.com/smitparmar/bluetax.git
cd bluetax

# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:3000/bluetax
```

### Build for production

```bash
npm run build
# Output in ./out/ (static HTML/CSS/JS)
```

---

## 🏗 Architecture

```
bluetax/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + Inter font + SEO
│   ├── page.tsx            # Landing page
│   └── globals.css         # Design system (CSS variables)
│
├── components/
│   ├── wizard/             # Step-by-step question flow
│   │   ├── WizardShell.tsx # Orchestrator + state
│   │   ├── ProgressBar.tsx # Animated step indicator
│   │   ├── QuestionCard.tsx # Reusable card wrapper
│   │   └── steps/          # 7 individual step components
│   │
│   └── output/             # Results dashboard
│       ├── ResultsDashboard.tsx
│       ├── TaxBreakdownCard.tsx   # Bar chart breakdown
│       ├── EffectiveRateGauge.tsx # SVG arc gauge
│       └── OptimizationPanel.tsx  # Savings suggestions
│
├── lib/
│   ├── tax/
│   │   ├── federal.ts      # 2026 IRS brackets
│   │   ├── california.ts   # 2025/2026 CA FTB + SDI
│   │   ├── fica.ts         # SS + Medicare 2026
│   │   └── engine.ts       # calculateTax() main function
│   ├── optimizer/
│   │   └── suggestions.ts  # 5-rule optimization engine
│   └── reverseEstimator.ts # Binary search: take-home → gross
│
└── types/
    └── tax.ts              # Shared TypeScript types
```

---

## 🧪 Tax Calculation Verification

| Scenario | Gross | Calculated Net | Expected Net |
|----------|-------|---------------|--------------|
| Single, CA, $80k | $80,000 | ~$55,800/yr | ✅ |
| Married, CA, $150k | $150,000 | ~$103,000/yr | ✅ |
| Single, CA, $250k | $250,000 | ~$155,000/yr | ✅ (SS cap applies at $184,500) |

---

## 📅 Tax Year Data Sources

| Data | Source | Year |
|------|--------|------|
| Federal brackets | IRS Rev. Proc. (Oct 2025) | **2026** |
| Standard deduction | IRS Rev. Proc. (Oct 2025) | **2026** |
| Social Security wage base | SSA.gov | **$184,500 (2026)** |
| 401(k) limit | IRS Notice 2025-xx | **$24,500 (2026)** |
| HSA limit | IRS Rev. Proc. 2025-19 | **$4,400/$8,750 (2026)** |
| California brackets | CA FTB | 2025/2026 |

---

## 🗺 Roadmap

- [x] California W2 MVP
- [x] 2026 tax brackets
- [x] Take-home reverse estimation
- [x] Optimization suggestions
- [ ] New York, Texas, Washington state support
- [ ] RSU / equity compensation
- [ ] Freelancer / 1099 mode
- [ ] Multi-state comparison ("Move to save tax")
- [ ] PDF export

---

## 📄 Disclaimer

> BlueTax is an **estimation tool** for educational purposes only.
> It uses 2026 IRS and California FTB rates to approximate tax liability.
> This is **not tax advice**. For actual tax filing, consult a licensed CPA or tax professional.

---

## 👨‍💻 Author

Built by **Smit Parmar** · [GitHub](https://github.com/smitparmar)

---

<div align="center">

⭐ **Star this repo if it helped you understand your taxes!**

</div>
