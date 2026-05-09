import React, { useState } from 'react';
import { TF_SECONDS, clampSec } from '../utils';

const S = {
  mobileCard: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1rem',
  },
  mobileHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  mobileRowNum: {
    fontSize: '11px', color: 'var(--text3)',
    fontFamily: 'var(--font-mono)',
  },
  mobileGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '0.75rem',
  },
  mobileLabel: {
    fontSize: '10px', color: 'var(--text3)',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  mobileStats: {
    display: 'flex', gap: '12px',
    fontSize: '12px', color: 'var(--text2)',
    fontFamily: 'var(--font-mono)',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
  },
  mobileFooter: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border)',
  },
  saveBtn: {
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid var(--green-dark)',
    borderRadius: '6px',
    color: 'var(--green)',
    fontSize: '11px', fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  savedBtn: {
    padding: '4px 10px',
    background: 'rgba(0,255,135,0.1)',
    border: '1px solid var(--green)',
    borderRadius: '6px',
    color: 'var(--green)',
    fontSize: '11px', fontWeight: 600,
    cursor: 'default',
    fontFamily: 'var(--font-display)',
    whiteSpace: 'nowrap',
  },
  pnlPos: { fontSize: '12px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-mono)' },
  pnlNeg: { fontSize: '12px', fontWeight: 600, color: 'var(--red)', fontFamily: 'var(--font-mono)' },
  pnlZero: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' },
};

// Stepper: value display with + and - buttons
function Stepper({ value, min, max, step = 1, onChange, label }) {
  const numVal = parseFloat(value) || 0;

  const decrement = () => {
    const next = Math.max(min, numVal - step);
    onChange(next);
  };

  const increment = () => {
    const next = Math.min(max, numVal + step);
    onChange(next);
  };

  return (
    <div>
      <div style={S.mobileLabel}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: '1px solid var(--border2)',
        borderRadius: '8px', overflow: 'hidden',
        background: 'var(--bg3)',
      }}>
        <button onClick={decrement} style={{
          width: '32px', height: '36px',
          background: 'var(--bg3)',
          border: 'none', borderRight: '1px solid var(--border2)',
          color: 'var(--text2)', fontSize: '16px',
          cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
        >−</button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            color: 'var(--text)', fontSize: '13px',
            textAlign: 'center', outline: 'none',
            fontFamily: 'var(--font-mono)',
            padding: '0',
            MozAppearance: 'textfield',
          }}
        />
        <button onClick={increment} style={{
          width: '32px', height: '36px',
          background: 'var(--green)',
          border: 'none', borderLeft: '1px solid var(--border2)',
          color: 'var(--bg)', fontSize: '16px',
          cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontWeight: 700,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--green-dark)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--green)'}
        >+</button>
      </div>
    </div>
  );
}

export default function ParamRow({ row, index, tf, onChange, onSave, saveStatus }) {
  const maxSec = TF_SECONDS[tf] - 1;
  const update = (field, value) => onChange(row.id, field, value);

  const pnlStyle = row.pnl > 0 ? S.pnlPos : row.pnl < 0 ? S.pnlNeg : S.pnlZero;
  const winRate = row.trades > 0 ? Math.round((row.wins / row.trades) * 100) + '%' : '—';
  const isSaved = saveStatus === 'saved';
  const isSaving = saveStatus === 'saving';

  return (
    <div style={S.mobileCard}>
      <div style={S.mobileHeader}>
        <div style={S.mobileRowNum}>Row {index + 1}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Toggle checked={row.enabled} onChange={val => update('enabled', val)} />
          <button
            style={isSaved ? S.savedBtn : S.saveBtn}
            onClick={() => !isSaved && !isSaving && onSave(row)}
            onMouseEnter={e => { if (!isSaved) e.target.style.background = 'rgba(0,255,135,0.08)'; }}
            onMouseLeave={e => { if (!isSaved) e.target.style.background = 'transparent'; }}
          >
            {isSaving ? '...' : isSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div style={S.mobileGrid}>
        <Stepper
          label="Entry (¢)" value={row.entryPrice}
          min={1} max={99} step={1}
          onChange={val => update('entryPrice', val)}
        />
        <Stepper
          label="Exit (¢)" value={row.exitPrice}
          min={1} max={99} step={1}
          onChange={val => update('exitPrice', val)}
        />
        <Stepper
          label={`Start (s) max ${maxSec}`} value={row.startSec}
          min={1} max={maxSec} step={1}
          onChange={val => update('startSec', clampSec(val, tf))}
        />
        <Stepper
          label={`Stop (s) max ${maxSec}`} value={row.stopSec}
          min={1} max={maxSec} step={1}
          onChange={val => update('stopSec', clampSec(val, tf))}
        />
      </div>

      <div style={S.mobileStats}>
        <span>Balance: <strong style={{ color: 'var(--text)' }}>${row.balance.toFixed(2)}</strong></span>
        <span style={pnlStyle}>P&L: {row.pnl === 0 ? '—' : (row.pnl > 0 ? '+' : '') + '$' + row.pnl.toFixed(2)}</span>
        <span>Trades: {row.trades}</span>
        <span>Win%: {winRate}</span>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
      <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: checked ? 'var(--green)' : 'var(--bg4)',
        borderRadius: '20px', transition: '0.2s',
        border: checked ? '1px solid var(--green)' : '1px solid var(--border2)',
      }}>
        <span style={{
          position: 'absolute', height: '13px', width: '13px',
          left: checked ? '18px' : '3px', top: '3px',
          background: checked ? 'var(--bg)' : 'var(--text3)',
          borderRadius: '50%', transition: '0.2s',
        }} />
      </span>
    </label>
  );
}