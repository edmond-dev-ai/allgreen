import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const S = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '0' },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.75rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg2)',
  },
  logo: { fontSize: '18px', fontWeight: 800, color: 'var(--green)', letterSpacing: '-0.02em' },
  userRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  userEmail: { fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-mono)' },
  logoutBtn: {
    background: 'none', border: '1px solid var(--border2)',
    borderRadius: '7px', color: 'var(--text3)',
    fontSize: '12px', padding: '5px 12px', cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  body: { padding: '2rem 1.75rem' },
  sectionLabel: {
    fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--text3)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: '1rem',
  },
  pairsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px', marginBottom: '2.5rem',
  },
  pairActive: {
    background: 'var(--bg2)', border: '1px solid var(--green-dark)',
    borderRadius: '14px', padding: '1.25rem',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  pairLocked: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.25rem',
    opacity: 0.35, cursor: 'not-allowed',
  },
  pairName: { fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' },
  pairTag: {
    fontSize: '11px', fontFamily: 'var(--font-mono)',
    color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '5px',
  },
  pairTagLocked: {
    fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
  },
  dot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--green)', animation: 'pulse-dot 2s infinite',
    display: 'inline-block',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '10px',
  },
  statCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1rem',
  },
  statLabel: { fontSize: '11px', color: 'var(--text3)', marginBottom: '6px', fontFamily: 'var(--font-mono)' },
  statVal: { fontSize: '22px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' },
};

const PAIRS = [
  { id: 'BTC', label: 'BTC / USD', active: true },
  { id: 'ETH', label: 'ETH / USD', active: false },
  { id: 'SOL', label: 'SOL / USD', active: false },
  { id: 'XRP', label: 'XRP / USD', active: false },
];

export default function DashboardPage({ user, onSelectPair, onLogout }) {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div style={S.page}>
      <div style={S.topbar}>
        <div style={S.logo}>AllGreen</div>
        <div style={S.userRow}>
          <div style={S.userEmail}>{user?.email || 'trader'}</div>
          <button style={S.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      <div style={S.body}>
        <div style={S.sectionLabel}>Trading pairs</div>
        <div style={S.pairsGrid}>
          {PAIRS.map(pair => (
            <div key={pair.id}
              style={pair.active ? S.pairActive : S.pairLocked}
              onClick={() => pair.active && onSelectPair(pair.id)}
              onMouseEnter={e => pair.active && (e.currentTarget.style.borderColor = 'var(--green)')}
              onMouseLeave={e => pair.active && (e.currentTarget.style.borderColor = 'var(--green-dark)')}
            >
              <div style={S.pairName}>{pair.label}</div>
              {pair.active
                ? <div style={S.pairTag}><span style={S.dot} /> Live</div>
                : <div style={S.pairTagLocked}>Coming soon</div>
              }
            </div>
          ))}
        </div>

        <div style={S.sectionLabel}>Overall performance</div>
        <div style={S.statsGrid}>
          {[
            { label: 'Active configs', val: '0' },
            { label: 'Total trades', val: '0' },
            { label: 'Total P&L', val: '—' },
            { label: 'Best win rate', val: '—' },
          ].map((s, i) => (
            <div key={i} style={S.statCard}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={S.statVal}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
