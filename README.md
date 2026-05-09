# AllGreen — Setup Guide

## Project Structure

```
allgreen/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── LandingPage.js     ← Marketing / home page
│   │   ├── LoginPage.js       ← Login (email + Google)
│   │   ├── SignupPage.js      ← Sign up (email + Google)
│   │   ├── DashboardPage.js   ← Pairs list
│   │   └── PairPage.js        ← BTC parameter grid
│   ├── components/
│   │   └── ParamRow.js        ← One row in the table
│   ├── App.js                 ← Page routing + auth listener
│   ├── authStyles.js          ← Shared login/signup styles
│   ├── firebase.js            ← Firebase config (YOU FILL THIS IN)
│   ├── index.js               ← Entry point
│   ├── index.css              ← Global styles + design tokens
│   └── utils.js               ← Timeframes, row helpers, seconds clamp
├── package.json
└── README.md
```

---

## STEP 1 — Set up Firebase (5 minutes)

1. Go to https://console.firebase.google.com
2. Click "Create a project" → name it "allgreen" → Continue
3. Disable Google Analytics (not needed) → Create project
4. Once inside the project, click the Web icon (</>)
5. Register app name: "allgreen-web" → click Register
6. Copy the firebaseConfig object shown on screen
7. Open src/firebase.js and paste your values into the config

Then enable authentication:
8. In Firebase console, left sidebar → Build → Authentication
9. Click "Get started"
10. Click "Email/Password" → Enable → Save
11. Click "Google" → Enable → add your support email → Save

---

## STEP 2 — Install and run locally

In VS Code terminal, inside the allgreen folder:

```
npm install
npm start
```

Opens at http://localhost:3000

---

## STEP 3 — Deploy to Railway (free, 24/7)

1. Create free account at https://railway.app (use your Google account)

2. Push to GitHub first:
   - Go to https://github.com and create a new repo called "allgreen"
   - In VS Code terminal:
     ```
     git init
     git add .
     git commit -m "initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/allgreen.git
     git push -u origin main
     ```

3. On Railway:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your allgreen repo
   - Railway detects it as React and builds automatically
   - You get a public URL like: https://allgreen.up.railway.app

4. Add your Firebase config as environment variables on Railway:
   - In Railway project → Variables tab
   - Add each value from firebaseConfig as:
     REACT_APP_FIREBASE_API_KEY=your_value
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_value
     REACT_APP_FIREBASE_PROJECT_ID=your_value
     etc.
   - Then update src/firebase.js to use process.env:
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     (Do this for each field)

5. Also add your Railway URL to Firebase authorized domains:
   - Firebase console → Authentication → Settings → Authorized domains
   - Add your Railway URL (without https://)

---

## Time input guide

| Timeframe | Total seconds | Valid entry range |
|-----------|--------------|-------------------|
| 5m        | 300s         | 1 – 299           |
| 15m       | 900s         | 1 – 899           |
| 1hr       | 3600s        | 1 – 3599          |

Example for 5m: Start=61, Stop=210 means "only trade between second 61 and second 210 of the 5-minute window"

---

## Risk rules (per parameter row)

- Starting balance: $100
- Risk per trade: 5% of current balance
- Maximum risk per single trade: $50 (cap kicks in at $1,000 balance)
- Trades until balance = $0

---

## What's built (Phase 1)

✅ Landing page with AllGreen branding
✅ Sign up / Login (email + Google via Firebase)
✅ Login persists across page refreshes
✅ Dashboard with BTC active, others locked
✅ BTC parameter page with:
   - Live (simulated) price ticker
   - Stats: active configs, trades, P&L, best config
   - Timeframe tabs: 5m / 15m / 1hr
   - Parameter table (up to 10 rows per timeframe)
   - Seconds inputs with auto-cap per timeframe
   - On/Off toggle per row
   - Add/remove rows

## What comes next (Phase 2)

⬜ Connect real Polymarket WebSocket stream
⬜ Trade logic engine (fires paper trades when conditions hit)
⬜ Persistent parameter storage (save configs to Firebase)
⬜ Real-time result tracking per row
