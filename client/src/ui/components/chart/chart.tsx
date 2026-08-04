/* Optimistic UI · Chart · v1.0.0 · updated 2026-07-11
   Own this file; edit it however you like. Pure SVG, no dependencies.
   Colours come from tokens.css (the categorical --element-1..10 palette).

   Exports: <Chart> (bar / line / area), <Donut>, <Sparkline>. */
"use client";
import * as React from "react";
import "./chart.css";

const PALETTE = Array.from({ length: 10 }, (_, i) => `var(--element-${i + 1})`);
const fmtDefault = (v: number) => (Math.abs(v) >= 1000 ? v.toLocaleString() : String(v));

function niceMax(m: number) {
  if (m <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(m)));
  const n = m / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
}

/** measure the wrapper width so the SVG renders at crisp device pixels */
function useWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function linePath(pts: { x: number; y: number }[], curved: boolean) {
  if (pts.length < 2) return pts.length ? `M${pts[0].x},${pts[0].y}` : "";
  if (!curved) return "M" + pts.map((p) => `${p.x},${p.y}`).join("L");
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return d;
}

export interface Series { name: string; data: number[]; color?: string }
export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "bar" | "line" | "area";
  categories: string[];
  series: Series[];
  height?: number;
  stacked?: boolean;
  curved?: boolean;
  grid?: boolean;
  legend?: boolean;
  yFormat?: (v: number) => string;
  colors?: string[];
}

export function Chart({ type, categories, series, height = 260, stacked = false, curved = false, grid = true, legend, yFormat = fmtDefault, colors = PALETTE, className = "", ...rest }: ChartProps) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const w = useWidth(wrap);
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const [hover, setHover] = React.useState<{ i: number; x: number; y: number } | null>(null);

  const vis = series.filter((s) => !hidden.has(s.name));
  const showLegend = legend ?? series.length > 1;
  const colorOf = (s: Series, i: number) => s.color || colors[series.indexOf(s) % colors.length] || colors[i % colors.length];

  const padL = 44, padR = 12, padT = 12, padB = 28;
  const plotW = Math.max(0, w - padL - padR);
  const plotH = Math.max(0, height - padT - padB);
  const n = categories.length;
  const bandW = n ? plotW / n : 0;

  // domain
  const flat = vis.flatMap((s) => s.data);
  const stackedSums = stacked ? categories.map((_, i) => vis.reduce((a, s) => a + (s.data[i] || 0), 0)) : [];
  const rawMax = Math.max(1, ...(stacked ? stackedSums : flat));
  const rawMin = Math.min(0, ...flat);
  const maxY = niceMax(rawMax);
  const minY = rawMin < 0 ? -niceMax(-rawMin) : 0;
  const yScale = (v: number) => padT + plotH * (1 - (v - minY) / (maxY - minY || 1));
  const cx = (i: number) => padL + bandW * (i + 0.5);
  const ticks = [0, 1, 2, 3, 4].map((k) => minY + ((maxY - minY) * k) / 4);
  const y0 = yScale(0);

  const move = (e: React.MouseEvent) => {
    if (!svgRef.current || !n) return;
    const r = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const i = Math.max(0, Math.min(n - 1, Math.round((mx - padL) / bandW - 0.5)));
    setHover({ i, x: cx(i), y: e.clientY - r.top });
  };
  const toggle = (name: string) => setHidden((h) => { const s = new Set(h); s.has(name) ? s.delete(name) : s.add(name); return s; });

  return (
    <div ref={wrap} className={`o-chart${className ? ` ${className}` : ""}`} style={{ position: "relative" }} {...rest}>
      {w > 0 && (
        <svg ref={svgRef} width={w} height={height} role="img" onMouseMove={move} onMouseLeave={() => setHover(null)}>
          {grid && ticks.map((t, k) => (
            <line key={k} className="o-chart__gridline" x1={padL} x2={w - padR} y1={yScale(t)} y2={yScale(t)} />
          ))}
          {ticks.map((t, k) => (
            <text key={k} className="o-chart__axis" x={padL - 8} y={yScale(t)} textAnchor="end" dominantBaseline="middle">{yFormat(Math.round(t))}</text>
          ))}
          {categories.map((c, i) => (
            <text key={c + i} className="o-chart__axis" x={cx(i)} y={height - padB + 16} textAnchor="middle">{c}</text>
          ))}
          {hover && (type === "line" || type === "area") && (
            <line className="o-chart__guide" x1={hover.x} x2={hover.x} y1={padT} y2={padT + plotH} />
          )}

          {type === "bar" && stacked && categories.map((_, i) => {
            let acc = 0;
            return vis.map((s, si) => {
              const v = s.data[i] || 0; const bottom = acc; acc += v;
              const yT = yScale(acc), yB = yScale(bottom); const bw = bandW * 0.5;
              return <rect key={s.name + i} x={cx(i) - bw / 2} y={yT} width={bw} height={Math.max(0, yB - yT)} rx={2} fill={colorOf(s, si)} opacity={hover && hover.i !== i ? 0.55 : 1} />;
            });
          })}
          {type === "bar" && !stacked && categories.map((_, i) => {
            const groupW = bandW * 0.68; const bw = groupW / (vis.length || 1); const start = cx(i) - groupW / 2;
            return vis.map((s, si) => {
              const v = s.data[i] || 0; const yv = yScale(v);
              return <rect key={s.name + i} x={start + si * bw + bw * 0.1} y={Math.min(yv, y0)} width={bw * 0.8} height={Math.abs(y0 - yv)} rx={3} fill={colorOf(s, si)} opacity={hover && hover.i !== i ? 0.55 : 1} />;
            });
          })}

          {(type === "line" || type === "area") && vis.map((s, si) => {
            const pts = s.data.map((v, i) => ({ x: cx(i), y: yScale(v) }));
            const col = colorOf(s, si); const id = `og${si}`;
            return (
              <g key={s.name}>
                {type === "area" && (
                  <>
                    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity="0.35" /><stop offset="100%" stopColor={col} stopOpacity="0" /></linearGradient></defs>
                    <path d={`${linePath(pts, curved)} L${pts[pts.length - 1].x},${y0} L${pts[0].x},${y0} Z`} fill={`url(#${id})`} />
                  </>
                )}
                <path className="o-chart__line" d={linePath(pts, curved)} stroke={col} />
                {(s.data.length <= 12 || hover) && pts.map((p, i) => (
                  <circle key={i} className="o-chart__dot" cx={p.x} cy={p.y} r={hover?.i === i ? 4 : 2.5} fill={col} opacity={hover && hover.i !== i ? 0 : 1} />
                ))}
              </g>
            );
          })}
        </svg>
      )}

      {hover && n > 0 && (
        <div className="o-chart__tip" style={{ left: hover.x, top: hover.y }}>
          <div className="o-chart__tipHead">{categories[hover.i]}</div>
          {vis.map((s, si) => (
            <div key={s.name} className="o-chart__tipRow"><span className="o-chart__tipDot" style={{ background: colorOf(s, si) }} /><span>{s.name}</span><b>{yFormat(s.data[hover.i] ?? 0)}</b></div>
          ))}
        </div>
      )}

      {showLegend && (
        <div className="o-chart__legend">
          {series.map((s, si) => (
            <button key={s.name} type="button" className={`o-chart__legItem${hidden.has(s.name) ? " is-off" : ""}`} onClick={() => toggle(s.name)}>
              <span className="o-chart__legDot" style={{ background: colorOf(s, si) }} />{s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface DonutSegment { label: string; value: number; color?: string }
export interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  total?: React.ReactNode;
  legend?: boolean;
  valueFormat?: (v: number) => string;
}
export function Donut({ segments, size = 176, thickness = 22, total, legend = true, valueFormat = fmtDefault }: DonutProps) {
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  const [hi, setHi] = React.useState<number | null>(null);
  return (
    <div className="o-donut">
      <div className="o-donut__ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-chip)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const frac = s.value / sum; const seg = frac * c; const off = -acc * c; acc += frac;
            return <circle key={s.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color || PALETTE[i % 10]} strokeWidth={hi === i ? thickness + 4 : thickness} strokeDasharray={`${seg} ${c - seg}`} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} style={{ transition: "stroke-width .15s ease", cursor: "default" }} />;
          })}
        </svg>
        {total != null && <div className="o-donut__center">{total === true ? valueFormat(sum) : total}</div>}
      </div>
      {legend && (
        <div className="o-donut__legend">
          {segments.map((s, i) => (
            <div key={s.label} className="o-donut__legItem" onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
              <span className="o-chart__legDot" style={{ background: s.color || PALETTE[i % 10] }} />
              <span className="o-donut__legLabel">{s.label}</span>
              <b>{valueFormat(s.value)}</b>
              <span className="o-donut__legPct">{Math.round((s.value / sum) * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface SparklineProps extends React.SVGProps<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  area?: boolean;
}
export function Sparkline({ data, width = 96, height = 30, color, area = false, ...rest }: SparklineProps) {
  const max = Math.max(...data), min = Math.min(...data), rng = max - min || 1;
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * width, y: height - ((v - min) / rng) * (height - 4) - 2 }));
  const up = data[data.length - 1] >= data[0];
  const stroke = color || (up ? "var(--success-text)" : "var(--danger-text)");
  const d = linePath(pts, false);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" {...rest}>
      {area && <><defs><linearGradient id="osp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity="0.3" /><stop offset="100%" stopColor={stroke} stopOpacity="0" /></linearGradient></defs>
        <path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#osp)" /></>}
      <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

Chart.displayName = "Chart";
Donut.displayName = "Donut";
Sparkline.displayName = "Sparkline";
