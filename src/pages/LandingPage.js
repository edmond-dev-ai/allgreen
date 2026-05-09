import React, { useEffect, useState } from 'react';

const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    overflowX: 'hidden',
  },

  // NAV
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(8,11,10,0.92)',
    backdropFilter: 'blur(12px)',
  },
  navLogo: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '20px', color: 'var(--green)', letterSpacing: '-0.02em',
  },
  navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  navLogin: {
    padding: '7px 18px', border: '1px solid var(--border2)',
    borderRadius: '8px', background: 'transparent',
    color: 'var(--text2)', fontSize: '13px', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 500,
    transition: 'all 0.15s',
  },
  navSignup: {
    padding: '7px 18px', border: '1px solid var(--green)',
    borderRadius: '8px', background: 'var(--green)',
    color: 'var(--bg)', fontSize: '13px', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    transition: 'all 0.15s',
  },

  // HERO
  hero: {
    maxWidth: '900px', margin: '0 auto',
    padding: '6rem 2rem 4rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '5px 14px',
    border: '1px solid var(--green-dark)',
    borderRadius: '100px',
    background: 'rgba(0,255,135,0.06)',
    color: 'var(--green-dim)',
    fontSize: '12px', fontFamily: 'var(--font-mono)',
    marginBottom: '2rem',
  },
  badgeDot: {
    width: '6px', height: '6px',
    background: 'var(--green)',
    borderRadius: '50%',
    animation: 'pulse-dot 2s infinite',
  },
  heroH1: {
    fontSize: 'clamp(38px, 7vw, 72px)',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    color: 'var(--text)',
    marginBottom: '1.5rem',
  },
  heroAccent: {
    color: 'var(--green)',
    display: 'block',
  },
  heroSub: {
    fontSize: '17px', color: 'var(--text2)',
    lineHeight: 1.65, maxWidth: '560px',
    margin: '0 auto 2.5rem',
    fontWeight: 400,
  },
  heroCtas: {
    display: 'flex', gap: '12px',
    justifyContent: 'center', flexWrap: 'wrap',
  },
  ctaPrimary: {
    padding: '13px 32px',
    background: 'var(--green)',
    color: 'var(--bg)',
    border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.01em',
    transition: 'all 0.15s',
    boxShadow: '0 0 32px var(--green-glow)',
  },
  ctaSecondary: {
    padding: '13px 32px',
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border2)',
    borderRadius: '10px',
    fontSize: '15px', fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all 0.15s',
  },

  // STATS BAR
  statsBar: {
    display: 'flex', justifyContent: 'center',
    gap: '0', flexWrap: 'wrap',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg2)',
    margin: '3rem 0',
  },
  statItem: {
    padding: '1.5rem 2.5rem',
    borderRight: '1px solid var(--border)',
    textAlign: 'center',
    flex: '1 1 160px',
  },
  statNum: {
    fontSize: '28px', fontWeight: 800,
    color: 'var(--green)', fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
  },
  statDesc: {
    fontSize: '12px', color: 'var(--text3)',
    marginTop: '4px', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  },

  // FEATURES
  features: {
    maxWidth: '1000px', margin: '0 auto',
    padding: '3rem 2rem 5rem',
  },
  featuresLabel: {
    fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--green-dim)', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: '1rem',
  },
  featuresH2: {
    fontSize: 'clamp(26px, 4vw, 42px)',
    fontWeight: 800, letterSpacing: '-0.03em',
    color: 'var(--text)', marginBottom: '3rem',
    lineHeight: 1.1,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  featureCard: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem',
    transition: 'border-color 0.2s',
  },
  featureIcon: {
    fontSize: '22px', marginBottom: '1rem',
    width: '44px', height: '44px',
    background: 'rgba(0,255,135,0.08)',
    border: '1px solid var(--green-dark)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '15px', fontWeight: 700,
    color: 'var(--text)', marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '13px', color: 'var(--text2)',
    lineHeight: 1.65,
  },

  // HOW IT WORKS
  howSection: {
    background: 'var(--bg2)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '4rem 2rem',
  },
  howInner: { maxWidth: '900px', margin: '0 auto' },
  howLabel: {
    fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--green-dim)', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: '1rem',
  },
  howH2: {
    fontSize: 'clamp(24px, 4vw, 38px)',
    fontWeight: 800, letterSpacing: '-0.03em',
    color: 'var(--text)', marginBottom: '2.5rem',
    lineHeight: 1.15,
  },
  steps: { display: 'flex', flexDirection: 'column', gap: '0' },
  step: {
    display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
    padding: '1.5rem 0',
    borderBottom: '1px solid var(--border)',
  },
  stepNum: {
    fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--green)', background: 'rgba(0,255,135,0.1)',
    border: '1px solid var(--green-dark)',
    borderRadius: '6px', padding: '3px 8px',
    whiteSpace: 'nowrap', marginTop: '2px',
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: '15px', fontWeight: 700,
    color: 'var(--text)', marginBottom: '4px',
  },
  stepDesc: {
    fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6,
  },

  // CTA SECTION
  ctaSection: {
    maxWidth: '600px', margin: '0 auto',
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  ctaH2: {
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 800, letterSpacing: '-0.03em',
    color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1,
  },
  ctaSub: {
    fontSize: '15px', color: 'var(--text2)',
    marginBottom: '2rem', lineHeight: 1.6,
  },

  // FOOTER
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '1.5rem 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '0.5rem',
  },
  footerLogo: {
    fontWeight: 800, color: 'var(--green)', fontSize: '15px',
  },
  footerText: {
    fontSize: '12px', color: 'var(--text3)',
    fontFamily: 'var(--font-mono)',
  },
};

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real Polymarket Data',
    desc: 'Stream live Yes/No prices from BTC, ETH, and SOL prediction markets across 5m, 15m, and 1hr timeframes.',
  },
  {
    icon: '🎯',
    title: 'Precision Entry Control',
    desc: 'Set exact entry prices in cents, time windows in seconds, and exit targets. Up to 10 independent configs per timeframe.',
  },
  {
    icon: '💰',
    title: 'Smart Risk Management',
    desc: 'Each config runs its own $100 balance with 5% risk per trade and a hard $50 cap — your downside is always controlled.',
  },
  {
    icon: '📊',
    title: 'Live Results Dashboard',
    desc: 'Track win rate, P&L, and trade count per config in real time. See exactly which parameters perform.',
  },
  {
    icon: '🔬',
    title: 'Parameter Sweep Engine',
    desc: 'Run up to 10 strategies simultaneously per timeframe. Find your edge before risking real money.',
  },
  {
    icon: '🚀',
    title: 'Go Live When Ready',
    desc: 'Paper trade until a config shows consistent edge. Then flip it live with one click — same parameters, real capital.',
  },
];

const STEPS = [
  { label: '01', title: 'Sign up free', desc: 'Create your account with email or Google. No credit card. No cost.' },
  { label: '02', title: 'Choose your pair', desc: 'Start with BTC/USD across 5m, 15m, and 1hr Polymarket prediction markets.' },
  { label: '03', title: 'Set your parameters', desc: 'Define entry price (¢), exit target (¢), and trading time window (seconds). Toggle each config on or off.' },
  { label: '04', title: 'Watch it trade', desc: 'AllGreen monitors live markets 24/7. When your conditions hit, a paper trade fires automatically.' },
  { label: '05', title: 'Find your edge', desc: 'Review results per config. Kill losers, scale winners. When you see consistent profit — go live.' },
];

export default function LandingPage({ onLogin, onSignup }) {
  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navLogo}>AllGreen</div>
        <div style={S.navRight}>
          <button style={S.navLogin}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--text2)'}
            onClick={onLogin}>Log in</button>
          <button style={S.navSignup} onClick={onSignup}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <div className="fade-up-1" style={S.badge}>
          <span style={S.badgeDot} />
          Live on Polymarket prediction markets
        </div>
        <h1 className="fade-up-2" style={S.heroH1}>
          Trade the odds.
          <span style={S.heroAccent}>Find the edge.</span>
        </h1>
        <p className="fade-up-3" style={S.heroSub}>
          AllGreen is a paper trading bot for Polymarket crypto markets.
          Test strategies on real live data — risk free — until you find what works.
        </p>
        <div className="fade-up-4" style={S.heroCtas}>
          <button style={S.ctaPrimary}
            onMouseEnter={e => { e.target.style.background = 'var(--green-dim)'; e.target.style.boxShadow = '0 0 48px var(--green-glow-strong)'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--green)'; e.target.style.boxShadow = '0 0 32px var(--green-glow)'; }}
            onClick={onSignup}>
            Start for free →
          </button>
          <button style={S.ctaSecondary}
            onMouseEnter={e => e.target.style.borderColor = 'var(--text3)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--border2)'}
            onClick={onLogin}>
            Log in
          </button>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={S.statsBar}>
        {[
          { num: '3', desc: 'Timeframes' },
          { num: '10×', desc: 'Configs per TF' },
          { num: '$0', desc: 'To start' },
          { num: '24/7', desc: 'Always running' },
        ].map((s, i) => (
          <div key={i} style={S.statItem}>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={S.features}>
        <div style={S.featuresLabel}>What you get</div>
        <h2 style={S.featuresH2}>Everything you need<br />to test before you risk.</h2>
        <div style={S.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} style={S.featureCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green-dark)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={S.featureIcon}>{f.icon}</div>
              <div style={S.featureTitle}>{f.title}</div>
              <div style={S.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={S.howSection}>
        <div style={S.howInner}>
          <div style={S.howLabel}>How it works</div>
          <h2 style={S.howH2}>From zero to edge<br />in five steps.</h2>
          <div style={S.steps}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ ...S.step, ...(i === STEPS.length - 1 ? { borderBottom: 'none' } : {}) }}>
                <div style={S.stepNum}>{step.label}</div>
                <div>
                  <div style={S.stepTitle}>{step.title}</div>
                  <div style={S.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={S.ctaSection}>
        <h2 style={S.ctaH2}>Ready to find your edge?</h2>
        <p style={S.ctaSub}>
          No credit card. No risk. Just real Polymarket data and a framework to find what actually works.
        </p>
        <button style={S.ctaPrimary}
          onMouseEnter={e => { e.target.style.background = 'var(--green-dim)'; }}
          onMouseLeave={e => { e.target.style.background = 'var(--green)'; }}
          onClick={onSignup}>
          Create free account →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.footerLogo}>AllGreen</div>
        <div style={S.footerText}>© 2025 AllGreen. Paper trading only. Not financial advice.</div>
      </footer>
    </div>
  );
}
