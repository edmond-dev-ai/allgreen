import React, { useState } from 'react';
import { TF_SECONDS, clampSec } from '../utils';

const S = {
  td: {
    padding: '7px 8px',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
  },
  input: {
    width: '54px', padding: '5px 6px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '7px',
    color: 'var(--text)', fontSize: '12px',
    textAlign: 'center', outline: 'none',
    fontFamily: 'var(--font-mono)',
    transition: 'border-color 0.15s',
  },
  rowNum: { fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' },
  balance: { fontSize: '12px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' },
  pnlPos: { fontSize: '12px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-mono)' },
  pnlNeg: { fontSize: '12px', fontWeight: 600, color: 'var(--red)', fontFamily: 'var(--font-mono)' },
  pnlZero: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' },
  meta: { fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--font-mono)' },
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
  mobileCard: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '10px',
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
  mobileInput: {
    width: '100%', padding: '7px 8px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '7px',
    color: 'var(--text)', fontSize: '13px',
    textAlign: 'center', outline: 'none',
    fontFamily: 'var(--font-mono)',
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
};

export default function ParamRow({ row, index, tf, onChange, onSave, saveStatus, isMobile }) {
  const maxSec = TF_SECONDS[tf] - 1;
  const update = (field, value) => onChange(row.id, field, value);
  const handleSecBlur = (field, value) => update(field, clampSec(value, tf));
  const inputFocus = (e) => e.target.style.borderColor = 'var(--green-dark)';
  const inputBlur = (e) => e.target.style.borderColor = 'var(--border2)';

  const pnlStyle = row.pnl > 0 ? S.pnlPos : row.pnl < 0 ? S.pnlNeg : S.pnlZero;
  const winRate = row.trades > 0 ? Math.round((row.wins / row.trades) * 100) + '%' : '—';
  const isSaved = saveStatus === 'saved';
  const isSaving = saveStatus === 'saving';

  const SaveButton = () => (
    <button
      style={isSaved ? S.savedBtn : S.saveBtn}
      onClick={() => !isSaved && !isSaving && onSave(row)}
      onMouseEnter={e => { if (!isSaved) e.target.style.background = 'rgba(0,255,135,0.08)'; }}
      onMouseLeave={e => { if (!isSaved) e.target.style.background = 'transparent'; }}
    >
      {isSaving ? '...' : isSaved ? '✓ Saved' : 'Save'}
    </button>
  );

  if (isMobile) {
    return (
      <div style={S.mobileCard}>
        <div style={S.mobileHeader}>
          <div style={S.mobileRowNum}>Row {index + 1}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Toggle checked={row.enabled} onChange={val => update('enabled', val)} />
            <SaveButton />
          </div>
        </div>
        <div style={S.mobileGrid}>
          <div>
            <div style={S.mobileLabel}>Entry (¢)</div>
            <input style={S.mobileInput} type="number" min="1" max="99" placeholder="¢"
              value={row.entryPrice} onChange={e => update('entryPrice', e.target.value)} />
          </div>
          <div>
            <div style={S.mobileLabel}>Exit (¢)</div>
            <input style={S.mobileInput} type="number" min="1" max="99" placeholder="¢"
              value={row.exitPrice} onChange={e => update('exitPrice', e.target.value)} />
          </div>
          <div>
            <div style={S.mobileLabel}>Start (s) max {maxSec}</div>
            <input style={S.mobileInput} type="number" min="1" max={maxSec} placeholder="sec"
              value={row.startSec} onChange={e => update('startSec', e.target.value)}
              onBlur={e => handleSecBlur('startSec', e.target.value)} />
          </div>
          <div>
            <div style={S.mobileLabel}>Stop (s) max {maxSec}</div>
            <input style={S.mobileInput} type="number" min="1" max={maxSec} placeholder="sec"
              value={row.stopSec} onChange={e => update('stopSec', e.target.value)}
              onBlur={e => handleSecBlur('stopSec', e.target.value)} />
          </div>
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

  return (
    <tr>
      <td style={{ ...S.td, ...S.rowNum }}>{index + 1}</td>
      <td style={S.td}>
        <input style={S.input} type="number" min="1" max="99" placeholder="¢"
          value={row.entryPrice} onChange={e => update('entryPrice', e.target.value)}
          onFocus={inputFocus} onBlur={inputBlur} />
      </td>
      <td style={S.td}>
        <input style={S.input} type="number" min="1" max="99" placeholder="¢"
          value={row.exitPrice} onChange={e => update('exitPrice', e.target.value)}
          onFocus={inputFocus} onBlur={inputBlur} />
      </td>
      <td style={S.td}>
        <input style={S.input} type="number" min="1" max={maxSec} placeholder="sec"
          value={row.startSec} onChange={e => update('startSec', e.target.value)}
          onBlur={e => { handleSecBlur('startSec', e.target.value); inputBlur(e); }}
          onFocus={inputFocus} />
      </td>
      <td style={S.td}>
        <input style={S.input} type="number" min="1" max={maxSec} placeholder="sec"
          value={row.stopSec} onChange={e => update('stopSec', e.target.value)}
          onBlur={e => { handleSecBlur('stopSec', e.target.value); inputBlur(e); }}
          onFocus={inputFocus} />
      </td>
      <td style={S.td}>
        <Toggle checked={row.enabled} onChange={val => update('enabled', val)} />
      </td>
      <td style={{ ...S.td, ...S.balance }}>${row.balance.toFixed(2)}</td>
      <td style={{ ...S.td, ...pnlStyle }}>
        {row.pnl === 0 ? '—' : (row.pnl > 0 ? '+' : '') + '$' + row.pnl.toFixed(2)}
      </td>
      <td style={{ ...S.td, ...S.meta }}>{row.trades}</td>
      <td style={{ ...S.td, ...S.meta }}>{winRate}</td>
      <td style={S.td}><SaveButton /></td>
    </tr>
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