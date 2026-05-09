import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ParamRow from '../components/ParamRow';
import { makeRow, makeDefaultRows, TIMEFRAMES, TF_SECONDS } from '../utils';

const SERVER_WS = process.env.REACT_APP_SERVER_WS || 'ws://localhost:3001';

const S = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg2)',
  },
  logo: { fontSize: '18px', fontWeight: 800, color: 'var(--green)', letterSpacing: '-0.02em' },
  backBtn: {
    background: 'none', border: '1px solid var(--border2)',
    borderRadius: '7px', color: 'var(--text2)',
    fontSize: '12px', padding: '5px 12px', cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  body: { padding: '1rem 1.25rem' },
  priceBar: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '0.85rem 1rem',
    marginBottom: '1rem', flexWrap: 'wrap',
  },
  priceLabel: { fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: '2px' },
  priceGreen: { fontSize: '20px', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)' },
  priceRed: { fontSize: '20px', fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-mono)' },
  question: { fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginLeft: 'auto', maxWidth: '200px', textAlign: 'right' },
  liveDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: 'var(--green)', display: 'inline-block',
    animation: 'pulse-dot 2s infinite', marginRight: '5px',
  },
  offlineDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#888', display: 'inline-block', marginRight: '5px',
  },
  liveText: { fontSize: '11px', color: 'var(--green)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center' },
  offlineText: { fontSize: '11px', color: '#888', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px', marginBottom: '1rem',
  },
  statCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '0.75rem 0.875rem',
  },
  statLabel: { fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: '4px' },
  statVal: { fontSize: '18px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' },
  statGreen: { fontSize: '18px', fontWeight: 700, color: 'var(--green)', letterSpacing: '-0.02em' },
  tfRow: { display: 'flex', gap: '6px', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  tfTab: {
    padding: '6px 16px', fontSize: '13px', fontWeight: 500,
    border: '1px solid var(--border2)', borderRadius: '8px',
    background: 'var(--bg2)', color: 'var(--text2)', cursor: 'pointer',
    fontFamily: 'var(--font-display)', transition: 'all 0.15s',
  },
  tfTabActive: {
    padding: '6px 16px', fontSize: '13px', fontWeight: 700,
    border: '1px solid var(--green)', borderRadius: '8px',
    background: 'rgba(0,255,135,0.1)', color: 'var(--green)', cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  tfHint: { fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '8px',
  },
  cardsMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '8px',
  },
  addBtn: {
    width: '100%', padding: '8px',
    background: 'none', border: '1px dashed var(--border2)',
    borderRadius: '10px', color: 'var(--text3)',
    fontSize: '12px', cursor: 'pointer',
    fontFamily: 'var(--font-display)', transition: 'all 0.15s',
  },
  loadingText: {
    textAlign: 'center', padding: '2rem',
    color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '13px',
  },
  skeletonPrice: {
    width: '60px', height: '24px',
    background: 'var(--bg3)',
    borderRadius: '6px',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  },
};

const MAX_ROWS = 10;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function PairPage({ pair, user, onBack }) {
  const [activeTf, setActiveTf] = useState('5m');
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({});
  const wsRef = useRef(null);

  // Keep last known prices in a ref so reconnects don't wipe them
  const priceCache = useRef({
    '5m':  { yesPrice: null, noPrice: null, question: null },
    '15m': { yesPrice: null, noPrice: null, question: null },
    '1hr': { yesPrice: null, noPrice: null, question: null },
  });

  const [liveData, setLiveData] = useState({
    '5m':  { yesPrice: null, noPrice: null, question: null },
    '15m': { yesPrice: null, noPrice: null, question: null },
    '1hr': { yesPrice: null, noPrice: null, question: null },
  });
  const [connected, setConnected] = useState(false);

  const [rows, setRows] = useState({
    '5m': makeDefaultRows(5),
    '15m': makeDefaultRows(5),
    '1hr': makeDefaultRows(5),
  });

  useEffect(() => {
    let ws;
    let reconnectTimer;

    function connect() {
      ws = new WebSocket(SERVER_WS);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        console.log('Connected to AllGreen server');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'prices') {
            // Update cache first
            priceCache.current[msg.tf] = {
              yesPrice: msg.yesPrice,
              noPrice: msg.noPrice,
              question: msg.question,
            };
            // Then update state
            setLiveData(prev => ({
              ...prev,
              [msg.tf]: {
                yesPrice: msg.yesPrice,
                noPrice: msg.noPrice,
                question: msg.question,
              },
            }));
          }
        } catch (e) {}
      };

      ws.onclose = () => {
        setConnected(false);
        // Restore from cache so prices don't disappear during reconnect
        setLiveData({
          '5m':  { ...priceCache.current['5m']  },
          '15m': { ...priceCache.current['15m'] },
          '1hr': { ...priceCache.current['1hr'] },
        });
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => { ws.close(); };
    }

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const ref = doc(db, 'parameters', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setRows(prev => ({
            '5m':  data['5m']  || prev['5m'],
            '15m': data['15m'] || prev['15m'],
            '1hr': data['1hr'] || prev['1hr'],
          }));
        }
      } catch (e) {
        console.error('Failed to load parameters', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const updateRow = (tf, id, field, value) => {
    setRows(prev => ({
      ...prev,
      [tf]: prev[tf].map(r => r.id === id ? { ...r, [field]: value } : r),
    }));
    setSaveStatus(prev => ({
      ...prev,
      [tf]: { ...(prev[tf] || {}), [id]: 'idle' },
    }));
  };

  const handleSaveRow = async (tf, row) => {
    if (!user) return;
    setSaveStatus(prev => ({ ...prev, [tf]: { ...(prev[tf] || {}), [row.id]: 'saving' } }));
    try {
      const ref = doc(db, 'parameters', user.uid);
      const currentRows = rows[tf].map(r => r.id === row.id ? row : r);
      const snap = await getDoc(ref);
      const existing = snap.exists() ? snap.data() : {};
      await setDoc(ref, { ...existing, [tf]: currentRows });
      setSaveStatus(prev => ({ ...prev, [tf]: { ...(prev[tf] || {}), [row.id]: 'saved' } }));
    } catch (e) {
      setSaveStatus(prev => ({ ...prev, [tf]: { ...(prev[tf] || {}), [row.id]: 'idle' } }));
    }
  };

  const addRow = (tf) => {
    setRows(prev => {
      const existing = prev[tf];
      if (existing.length >= MAX_ROWS) return prev;
      const newId = Math.max(...existing.map(r => r.id)) + 1;
      return { ...prev, [tf]: [...existing, makeRow(newId)] };
    });
  };

  const allRows = Object.values(rows).flat();
  const activeConfigs = allRows.filter(r => r.enabled).length;
  const totalTrades = allRows.reduce((s, r) => s + r.trades, 0);
  const totalPnl = allRows.reduce((s, r) => s + r.pnl, 0);
  const bestPnl = Math.max(...allRows.map(r => r.pnl));
  const currentRows = rows[activeTf];
  const currentLive = liveData[activeTf];

  const formatPrice = (p) => p !== null ? `${(p * 100).toFixed(1)}¢` : null;
  const yesFormatted = formatPrice(currentLive.yesPrice);
  const noFormatted = formatPrice(currentLive.noPrice);

  if (loading) {
    return (
      <div style={S.page}>
        <div style={S.topbar}>
          <div style={S.logo}>AllGreen</div>
          <button style={S.backBtn} onClick={onBack}>← Dashboard</button>
        </div>
        <div style={S.loadingText}>Loading your parameters...</div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Skeleton pulse keyframe injected once */}
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={S.topbar}>
        <div style={S.logo}>AllGreen</div>
        <button style={S.backBtn} onClick={onBack}>← Dashboard</button>
      </div>

      <div style={S.body}>
        {/* Live price bar */}
        <div style={S.priceBar}>
          <div>
            <div style={S.priceLabel}>YES</div>
            {yesFormatted
              ? <div style={S.priceGreen}>{yesFormatted}</div>
              : <div style={S.skeletonPrice} />}
          </div>
          <div>
            <div style={S.priceLabel}>NO</div>
            {noFormatted
              ? <div style={S.priceRed}>{noFormatted}</div>
              : <div style={S.skeletonPrice} />}
          </div>
          <div>
            <div style={S.priceLabel}>Timeframe</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              BTC {activeTf}
            </div>
          </div>
          {currentLive.question && (
            <div style={S.question}>{currentLive.question}</div>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <div style={connected ? S.liveText : S.offlineText}>
              <span style={connected ? S.liveDot : S.offlineDot} />
              {connected ? 'Live' : 'Connecting...'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          <div style={S.statCard}><div style={S.statLabel}>Active</div><div style={S.statVal}>{activeConfigs}</div></div>
          <div style={S.statCard}><div style={S.statLabel}>Trades</div><div style={S.statVal}>{totalTrades}</div></div>
          <div style={S.statCard}>
            <div style={S.statLabel}>Total P&amp;L</div>
            <div style={totalPnl >= 0 ? S.statGreen : { ...S.statVal, color: 'var(--red)' }}>
              {totalPnl === 0 ? '—' : (totalPnl > 0 ? '+' : '') + '$' + totalPnl.toFixed(2)}
            </div>
          </div>
          <div style={S.statCard}>
            <div style={S.statLabel}>Best P&amp;L</div>
            <div style={bestPnl > 0 ? S.statGreen : S.statVal}>
              {bestPnl <= 0 ? '—' : '+$' + bestPnl.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Timeframe tabs */}
        <div style={S.tfRow}>
          {TIMEFRAMES.map(tf => (
            <button key={tf}
              style={activeTf === tf ? S.tfTabActive : S.tfTab}
              onClick={() => setActiveTf(tf)}
            >{tf}</button>
          ))}
          <div style={S.tfHint}>
            Max {TF_SECONDS[activeTf] - 1}s &nbsp;|&nbsp; {currentRows.length}/{MAX_ROWS}
          </div>
        </div>

        {/* Cards — 2-column grid on desktop, single column on mobile */}
        <div style={isMobile ? S.cardsMobile : S.cardsGrid}>
          {currentRows.map((row, i) => (
            <ParamRow key={row.id} row={row} index={i} tf={activeTf} isMobile={true}
              onChange={(id, field, value) => updateRow(activeTf, id, field, value)}
              onSave={(r) => handleSaveRow(activeTf, r)}
              saveStatus={saveStatus[activeTf]?.[row.id] || 'idle'}
            />
          ))}
        </div>

        {currentRows.length < MAX_ROWS && (
          <button style={S.addBtn}
            onMouseEnter={e => e.target.style.borderColor = 'var(--text3)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--border2)'}
            onClick={() => addRow(activeTf)}
          >
            + Add parameter row
          </button>
        )}
      </div>
    </div>
  );
}