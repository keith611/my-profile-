import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './TradingBotPage.css';

const DEMO = makeDemoCandles();

function makeDemoCandles() {
  let last = 158.4;
  return Array.from({ length: 92 }, (_, i) => {
    const drift = i < 16 ? 0.05 : -0.105;
    const wave = Math.sin(i * 0.72) * 0.53 + Math.sin(i * 0.19) * 0.38;
    const open = last;
    const close = open + drift + wave;
    const high = Math.max(open, close) + 0.2 + ((i * 7) % 5) * 0.055;
    const low = Math.min(open, close) - 0.19 - ((i * 11) % 5) * 0.05;
    last = close;
    return { time: new Date(Date.UTC(2026, 8, 1, i * 4)).toISOString(), open, high, low, close, volume: 800 + ((i * 683) % 4200) };
  });
}

function ema(values, period) {
  const alpha = 2 / (period + 1);
  let current = values[0];
  return values.map((value, i) => {
    current = i === 0 ? value : value * alpha + current * (1 - alpha);
    return current;
  });
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).map((row) => row.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')));
  if (rows.length < 5) throw new Error('The file needs a header and at least four candle rows.');
  const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z]/g, ''));
  const find = (names) => headers.findIndex((header) => names.includes(header));
  const ix = {
    time: find(['time', 'date', 'datetime', 'timestamp']), open: find(['open', 'o']),
    high: find(['high', 'h']), low: find(['low', 'l']), close: find(['close', 'c']),
    volume: find(['volume', 'tickvolume', 'vol']),
  };
  if ([ix.open, ix.high, ix.low, ix.close].some((index) => index < 0)) {
    throw new Error('Could not find Open, High, Low, and Close columns.');
  }
  const candles = rows.slice(1).map((row) => ({
    time: ix.time < 0 ? '' : row[ix.time],
    open: Number(row[ix.open]), high: Number(row[ix.high]), low: Number(row[ix.low]), close: Number(row[ix.close]),
    volume: ix.volume < 0 ? null : Number(row[ix.volume]),
  })).filter((c) => [c.open, c.high, c.low, c.close].every(Number.isFinite));
  if (candles.length < 20) throw new Error('Please provide at least 20 valid candle rows.');
  return candles;
}

function analyze(candles) {
  const closes = candles.map((c) => c.close);
  const fast = ema(closes, 20);
  const slow = ema(closes, 50);
  const touch = ema(closes, 9);
  const swings = [];
  const left = 2;
  const right = 2;
  for (let i = left; i < candles.length - right; i += 1) {
    const group = candles.slice(i - left, i + right + 1);
    const current = candles[i];
    const isHigh = group.every((c, j) => j === left || current.high > c.high);
    const isLow = group.every((c, j) => j === left || current.low < c.low);
    const range = Math.max(current.high - current.low, Math.abs(current.close - current.open), 0.00001);
    const pad = range * 0.72;
    if (isHigh) swings.push({ index: i, side: 'high', low: current.high - pad, high: current.high + pad, value: current.high, volume: current.volume });
    if (isLow) swings.push({ index: i, side: 'low', low: current.low - pad, high: current.low + pad, value: current.low, volume: current.volume });
  }

  let signal = null;
  for (let i = candles.length - 1; i >= 50; i -= 1) {
    const direction = slow[i] > fast[i] ? 'sell' : 'buy';
    const candle = candles[i];
    const bodyLow = Math.min(candle.open, candle.close);
    const bodyHigh = Math.max(candle.open, candle.close);
    const whiteTouchesBody = touch[i] >= bodyLow && touch[i] <= bodyHigh;
    if (!whiteTouchesBody) continue;
    const containing = swings.find((z) => z.index < i && bodyLow >= z.low && bodyHigh <= z.high);
    if (!containing) continue;
    const targets = swings.filter((z) => z.index < i && (direction === 'sell' ? z.high < bodyLow : z.low > bodyHigh))
      .sort((a, b) => direction === 'sell' ? b.high - a.high : a.low - b.low);
    if (targets.length < 2) continue;
    const entry = candle.close;
    const tp = direction === 'sell' ? targets[1].low : targets[1].high;
    const risk = Math.abs(entry - tp) / 3;
    const sl = direction === 'sell' ? entry + risk : entry - risk;
    signal = { index: i, direction, entry, tp, sl, zone: containing, target: targets[1], ratio: '1:3' };
    break;
  }
  return { fast, slow, touch, swings, signal };
}

function Chart({ candles, analysis }) {
  const width = 1000;
  const height = 470;
  const pad = { left: 20, right: 82, top: 22, bottom: 34 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const visibleCount = Math.min(candles.length, 90);
  const start = Math.max(0, candles.length - visibleCount);
  const shown = candles.slice(start);
  const all = [...shown.flatMap((c) => [c.high, c.low]), ...analysis.swings.filter((z) => z.index >= start).flatMap((z) => [z.low, z.high])];
  if (analysis.signal) all.push(analysis.signal.entry, analysis.signal.tp, analysis.signal.sl);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const padValue = (max - min) * 0.09 || 1;
  const low = min - padValue;
  const high = max + padValue;
  const x = (i) => pad.left + ((i - start + 0.5) / visibleCount) * chartWidth;
  const y = (v) => pad.top + ((high - v) / (high - low)) * chartHeight;
  const candleWidth = Math.max(3, chartWidth / visibleCount * 0.52);
  const linePath = (values) => values.slice(start).map((v, idx) => `${idx ? 'L' : 'M'} ${x(start + idx)} ${y(v)}`).join(' ');
  const s = analysis.signal;
  const labelLine = (value, label, color) => <g key={label}><line x1={pad.left} x2={width - pad.right + 20} y1={y(value)} y2={y(value)} stroke={color} strokeDasharray="7 5" strokeWidth="1.4"/><rect x={width - pad.right + 22} y={y(value) - 11} width="60" height="22" rx="6" fill={color}/><text x={width - pad.right + 52} y={y(value) + 4} textAnchor="middle" className="price-tag">{label}</text></g>;

  return <svg className="trading-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Candlestick chart with trend lines, liquidity zones, and trade levels">
    <defs><pattern id="chart-grid" width="100" height="75" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 75" fill="none" stroke="#24303d" strokeWidth="1"/></pattern></defs>
    <rect width={width} height={height} fill="#0e151e" rx="14"/><rect x={pad.left} y={pad.top} width={chartWidth} height={chartHeight} fill="url(#chart-grid)"/>
    {analysis.swings.filter((z) => z.index >= start).map((z) => <g key={`${z.index}-${z.side}`}><rect x={x(z.index)} y={y(z.high)} width={width - pad.right - x(z.index)} height={Math.max(3, y(z.low) - y(z.high))} fill="#b550d622" stroke="#c25de0" strokeOpacity=".72" strokeWidth="1"/><text x={x(z.index) + 5} y={y(z.high) - 4} className="swing-label">{z.volume != null && Number.isFinite(z.volume) ? `${(z.volume / 1000).toFixed(1)}K` : `swing ${z.side}`}</text></g>)}
    {shown.map((c, localIndex) => { const i = start + localIndex; const up = c.close >= c.open; return <g key={`${c.time}-${i}`}><line x1={x(i)} x2={x(i)} y1={y(c.high)} y2={y(c.low)} stroke={up ? '#37c6a1' : '#ef5d75'} strokeWidth="1.5"/><rect x={x(i) - candleWidth / 2} y={y(Math.max(c.open, c.close))} width={candleWidth} height={Math.max(1.5, Math.abs(y(c.open) - y(c.close)))} fill={up ? '#37c6a1' : '#ef5d75'} rx="1"/></g>; })}
    <path d={linePath(analysis.slow)} fill="none" stroke="#36bd77" strokeWidth="2.1"/><path d={linePath(analysis.fast)} fill="none" stroke="#4e8df5" strokeWidth="2.1"/><path d={linePath(analysis.touch)} fill="none" stroke="#f1f0e9" strokeWidth="1.8"/>
    {s && s.index >= start && <g><line x1={x(s.index)} x2={x(s.index)} y1={pad.top} y2={pad.top + chartHeight} stroke="#fff" strokeOpacity=".5" strokeDasharray="3 4"/><circle cx={x(s.index)} cy={y(s.entry)} r="6" fill={s.direction === 'sell' ? '#ff6b78' : '#37c6a1'} stroke="white" strokeWidth="2"/></g>}
    {s && <>{labelLine(s.entry, `ENTRY ${s.entry.toFixed(2)}`, '#5374ed')}{labelLine(s.tp, `TP2 ${s.tp.toFixed(2)}`, '#1b9c7c')}{labelLine(s.sl, `SL ${s.sl.toFixed(2)}`, '#d34d62')}</>}
    <text x={pad.left} y={height - 9} className="axis-label">Earlier candles</text><text x={width - pad.right} y={height - 9} textAnchor="end" className="axis-label">Latest</text>
  </svg>;
}

export function TradingBotPage() {
  const [candles, setCandles] = useState(DEMO);
  const [source, setSource] = useState('demo');
  const [symbol, setSymbol] = useState('US30');
  const [timeframe, setTimeframe] = useState('30m');
  const [error, setError] = useState('');
  const fileInput = useRef(null);
  const analysis = useMemo(() => analyze(candles), [candles]);
  const signal = analysis.signal;
  const trendDown = analysis.slow.at(-1) > analysis.fast.at(-1);

  async function loadFile(file) {
    if (!file) return;
    try {
      const parsed = parseCsv(await file.text());
      setCandles(parsed); setSource(file.name); setError('');
    } catch (e) { setError(e.message); }
  }

  return <main className="trader-app">
    <header className="trader-topbar"><Link to="/" className="trader-brand"><span className="trader-brand__mark">V</span><span>Vexa <small>STRATEGY LAB</small></span></Link><div className="topbar-status"><span className="status-dot"/> Analysis only <span className="topbar-divider"/> No broker connected</div></header>
    <div className="trader-shell">
      <section className="trader-heading"><div><p className="trader-kicker">Chart analysis</p><h1>Trading strategy</h1><p className="trader-subtitle">Visualize your EMA and liquidity-zone rules on candle data.</p></div><button className="upload-button" onClick={() => fileInput.current?.click()}><span>＋</span> Upload candle CSV</button><input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={(e) => loadFile(e.target.files?.[0])}/></section>
      {error && <div className="upload-error" role="alert">{error}</div>}
      <section className="market-toolbar"><div className="market-select"><label htmlFor="symbol">Instrument</label><input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} aria-label="Instrument symbol"/></div><div className="market-select"><label htmlFor="timeframe">Timeframe</label><select id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}><option>5m</option><option>15m</option><option>30m</option><option>1h</option><option>4h</option><option>1d</option></select></div><div className="source-info"><span className="live-dot"/> {source === 'demo' ? 'Demo candle data' : `Loaded: ${source}`} <span>· {candles.length} candles</span></div><button className="reset-button" onClick={() => { setCandles(DEMO); setSource('demo'); setError(''); }}>Reset demo</button></section>
      <section className="chart-card"><div className="chart-card__head"><div><h2>{symbol || 'Instrument'} <span>{timeframe}</span></h2><p>Trend and setup detection</p></div><div className={`trend-pill ${trendDown ? 'is-down' : 'is-up'}`}><i/> {trendDown ? 'Downtrend' : 'Uptrend'}</div></div><Chart candles={candles} analysis={analysis}/><div className="chart-legend"><span><i className="legend-white"/> EMA 9 · touch line</span><span><i className="legend-blue"/> EMA 20 · blue</span><span><i className="legend-green"/> EMA 50 · green</span><span><i className="legend-zone"/> Swing liquidity zones · approximate</span></div></section>
      <section className="setup-grid"><article className="setup-card setup-card--signal"><div className="setup-card__title"><div><p className="trader-kicker">Strategy signal</p><h2>{signal ? `${signal.direction === 'sell' ? 'Sell' : 'Buy'} setup` : 'No qualifying entry yet'}</h2></div><span className={`signal-badge ${signal ? 'found' : ''}`}>{signal ? 'SETUP FOUND' : 'WAITING'}</span></div>{signal ? <><p className="signal-explanation">Most recent qualifying candle: EMA 9 passes through its body and the full body sits within a prior swing zone.</p><div className="trade-levels"><div><span>Entry</span><strong>{signal.entry.toFixed(2)}</strong></div><div><span>Take profit · TP2</span><strong className="target-value">{signal.tp.toFixed(2)}</strong></div><div><span>Stop loss</span><strong className="stop-value">{signal.sl.toFixed(2)}</strong></div><div><span>Risk / reward</span><strong>1 : 3</strong></div></div><div className="target-note">TP2 is the second eligible liquidity zone in the trade direction.</div></> : <p className="signal-explanation">No candle currently matches all rules and has two eligible liquidity zones in the trend direction. Upload more data or try another timeframe.</p>}</article>
        <article className="setup-card rules-card"><p className="trader-kicker">Rules applied</p><h2>Your strategy</h2><ol><li><b>Trend</b><span>Green EMA 50 above blue EMA 20 → downtrend; reverse → uptrend.</span></li><li><b>Entry</b><span>EMA 9 touches candle body; body fully inside a confirmed swing zone.</span></li><li><b>Target</b><span>First qualifying candle; use the second zone in the trade direction (TP2).</span></li><li><b>Stop</b><span>Distance to TP2 divided by three for a 1:3 risk-to-reward.</span></li></ol></article></section>
      <footer className="trader-footer"><span>Zones use confirmed 2-candle swing highs/lows and are approximations of the indicator in your screenshots.</span><span>Analysis only · Check signals against your chart before acting.</span></footer>
    </div>
  </main>;
}

