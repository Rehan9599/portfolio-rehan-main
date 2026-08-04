/* Optimistic UI · Table (DataGrid) · v2.13.0 · updated 2026-07-11
   Own this file; edit it however you like. Colours come from tokens.css,
   so it follows whatever theme (dark / daylight / your own) is on <html>.

   A progressive grid: pass just { columns, data } for a plain table, or
   opt into search, per-column filters, sortable headers, row selection,
   inline + dropdown cell editing with validation, expandable master/detail
   rows, pagination, density / appearance variants, and pinned (frozen)
   columns and rows — one feature at a time, on the parts you choose. */
"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { Drawer } from "../drawer/drawer";
import { Tag } from "../tag/tag";
import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import { Pagination } from "../pagination/pagination";
import "./table.css";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  /** Header group this column belongs to; adjacent columns sharing it get a spanning header. */
  group?: string;
  /** Drives the floating-filter control. Auto-inferred from the data if omitted. */
  type?: "text" | "number";
  /** Freeze the column against a horizontal edge while the rest scrolls. */
  pinned?: "left" | "right";
  /** Value used for sort / filter / search. Falls back to row[key]. */
  value?: (row: T) => string | number;
  /** Custom cell renderer. Falls back to the raw cell value. */
  render?: (row: T) => React.ReactNode;
  /** Make this column's cells editable. Needs the grid-level `editable`. */
  editable?: boolean;
  editor?: "text" | "select";
  options?: { label: string; value: string }[];
  /** Return an error message to flag the cell, or null when valid. */
  validate?: (value: string, row: T) => string | null;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string;
  caption?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  searchable?: boolean;
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  stickyHeader?: boolean;
  editable?: boolean;
  onCellEdit?: (rowId: string, key: string, value: string) => void;
  renderDetail?: (row: T) => React.ReactNode;
  pageSize?: number;
  /** Rows-per-page choices; shows a selector in the footer. */
  pageSizeOptions?: number[];
  /** Enables the Advanced Filter query builder in the toolbar. */
  advancedFilter?: boolean;
  /** Enables the Settings drawer: reorder / show columns, drag to row-group, and value aggregations. */
  settings?: boolean;
  /** Show active column-filter selections as removable Tag chips above the table. */
  filterTags?: boolean;
  emptyMessage?: React.ReactNode;
  density?: "compact" | "default" | "comfortable";
  appearance?: "line" | "grid" | "zebra";
  borderless?: boolean;
  /** Outer corner style. Default "round". */
  corners?: "round" | "square";
  /** Shows active filters as removable Tag chips in the toolbar, collapsing the overflow to a "+N more" popover. */
  globalFilter?: boolean;
  /** Rows frozen to the top / bottom edges, outside sort, filter and paging.
      Use for a summary or totals row. */
  pinnedRows?: { top?: T[]; bottom?: T[] };
  /** A leading 1-based index column. */
  rowNumbers?: boolean;
  /** Drag a header's right edge to resize the column. */
  resizable?: boolean;
  /** Tint the whole column the cursor is over. */
  columnHover?: boolean;
  /** A per-column text filter row under the header. */
  floatingFilters?: boolean;
  /** A footer strip with the row and selection counts. */
  statusBar?: boolean;
  /** Lay the grid out right-to-left. */
  rtl?: boolean;
  /** A leading drag handle to reorder rows. */
  rowDraggable?: boolean;
  onRowReorder?: (orderedIds: string[]) => void;
}

type Sort = { key: string; dir: "asc" | "desc" } | null;
type PinMap = Record<string, { side: "left" | "right"; px: number }>;
type AdvRule = { id: string; col: string; op: string; val: string };
const cellText = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

const ADV_OPS: { v: string; label: string }[] = [
  { v: "eq", label: "equals" },
  { v: "ne", label: "does not equal" },
  { v: "contains", label: "contains" },
  { v: "ncontains", label: "does not contain" },
  { v: "starts", label: "starts with" },
  { v: "ends", label: "ends with" },
  { v: "gt", label: "greater than" },
  { v: "lt", label: "less than" },
  { v: "empty", label: "is empty" },
  { v: "nempty", label: "is not empty" },
];
function advEval(cell: string, op: string, val: string): boolean {
  const c = cell.toLowerCase(), v = val.toLowerCase();
  const nc = Number(cell), nv = Number(val), nums = !isNaN(nc) && !isNaN(nv);
  switch (op) {
    case "eq": return nums ? nc === nv : c === v;
    case "ne": return nums ? nc !== nv : c !== v;
    case "contains": return c.includes(v);
    case "ncontains": return !c.includes(v);
    case "starts": return c.startsWith(v);
    case "ends": return c.endsWith(v);
    case "gt": return nums ? nc > nv : c > v;
    case "lt": return nums ? nc < nv : c < v;
    case "empty": return cell.trim() === "";
    case "nempty": return cell.trim() !== "";
    default: return true;
  }
}
const EXPAND = "__expand", SELECT = "__select", ROWNUM = "__rownum", DRAG = "__drag";
const RESIZE_MIN = 64;
const TAG_CAP = 4; // filter tags shown inline before collapsing the rest into a "+N more" popover

/* ── icons ─────────────────────────────────────────────── */
const IChevron = ({ open }: { open?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(90deg)" : undefined, transition: "transform .15s" }} aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ISort = ({ dir }: { dir: "asc" | "desc" | null }) => (
  <span className={`o-tbl__sort${dir ? " is-on" : ""}`} aria-hidden="true"><svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M5 1l3 3.5H2L5 1z" fill={dir === "asc" ? "currentColor" : "var(--text-faint)"} /><path d="M5 11L2 7.5h6L5 11z" fill={dir === "desc" ? "currentColor" : "var(--text-faint)"} /></svg></span>
);
const IFunnel = ({ on }: { on?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 3h12l-4.5 5.5V13L6.5 11V8.5L2 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill={on ? "currentColor" : "none"} /></svg>
);
const IX = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="var(--danger-solid)" /><path d="M5.5 5.5l5 5m0-5l-5 5" stroke="var(--on-accent, #fff)" strokeWidth="1.4" strokeLinecap="round" /></svg>);
const ISearch = () => (<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>);
const IWarn = () => (<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2l6 11H2L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 6.5v3M8 11.2v.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>);
const IKebab = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="3" r="1.4" /><circle cx="8" cy="8" r="1.4" /><circle cx="8" cy="13" r="1.4" /></svg>);
const IPencil = () => (<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11.5 2.5l2 2L6 12l-2.5.5L4 10l7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>);
const ICheck = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const IUndo = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 7h6.5a3.5 3.5 0 0 1 0 7H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const IArrow = ({ dir }: { dir: "up" | "down" }) => (<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={dir === "up" ? "M8 12V4M4.5 7.5L8 4l3.5 3.5" : "M8 4v8M4.5 8.5L8 12l3.5-3.5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const IFilter = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 4h11M4.5 8h7M6.5 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>);
const IFormula = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M12.5 3H4l4.2 5L4 13h8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const IPlus = () => (<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>);
const IGear = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.3" /><path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.7 3.3l-1.4 1.4M4.7 11.3l-1.4 1.4M12.7 12.7l-1.4-1.4M4.7 4.7L3.3 3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>);
const IGrip = () => (<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="6" cy="4" r="1.1" /><circle cx="10" cy="4" r="1.1" /><circle cx="6" cy="8" r="1.1" /><circle cx="10" cy="8" r="1.1" /><circle cx="6" cy="12" r="1.1" /><circle cx="10" cy="12" r="1.1" /></svg>);
const AGG_FNS: { v: "sum" | "avg" | "min" | "max" | "count"; label: string }[] = [
  { v: "sum", label: "Sum" }, { v: "avg", label: "Average" }, { v: "min", label: "Min" }, { v: "max", label: "Max" }, { v: "count", label: "Count" },
];
function aggregate(fn: string, nums: number[]): number {
  if (!nums.length) return 0;
  switch (fn) {
    case "sum": return nums.reduce((a, b) => a + b, 0);
    case "avg": return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min": return Math.min(...nums);
    case "max": return Math.max(...nums);
    case "count": return nums.length;
    default: return 0;
  }
}

export function Table<T extends Record<string, React.ReactNode>>(props: TableProps<T>) {
  const {
    columns, data, getRowId = (_r, i) => String(i), caption, title, actions,
    searchable = false, selectable = false, selected, onSelectedChange,
    stickyHeader = true, editable = false, onCellEdit, renderDetail,
    pageSize, pageSizeOptions, advancedFilter = false, settings = false, filterTags = false, emptyMessage = "No rows to show",
    density = "default", appearance = "line", borderless = false, corners = "round", globalFilter = false, pinnedRows,
    rowNumbers = false, resizable = false, columnHover = false,
    floatingFilters = false, statusBar = false, rtl = false,
    rowDraggable = false, onRowReorder,
  } = props;

  const [sort, setSort] = React.useState<Sort>(null);
  const [innerSel, setInnerSel] = React.useState<string[]>([]);
  const sel = selected ?? innerSel;
  const [query, setQuery] = React.useState("");
  const [colFilter, setColFilter] = React.useState<Record<string, string[]>>({});
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [moreTagsOpen, setMoreTagsOpen] = React.useState(false);
  const [moreTagsAnchor, setMoreTagsAnchor] = React.useState<HTMLElement | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, Record<string, string>>>({});
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [colW, setColW] = React.useState<Record<string, number>>({});
  const [hoverCol, setHoverCol] = React.useState<string | null>(null);
  const [rangeFilter, setRangeFilter] = React.useState<Record<string, { min: number; max: number }>>({});
  const [openFloat, setOpenFloat] = React.useState<string | null>(null);
  const [floatAnchor, setFloatAnchor] = React.useState<HTMLElement | null>(null);
  const [listSearch, setListSearch] = React.useState<Record<string, string>>({});
  const [editRow, setEditRow] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Record<string, string>>({});
  const [attentionOnly, setAttentionOnly] = React.useState(false);
  const [headerMenu, setHeaderMenu] = React.useState<string | null>(null);
  const [headerAnchor, setHeaderAnchor] = React.useState<HTMLElement | null>(null);
  const [pinOverride, setPinOverride] = React.useState<Record<string, "left" | "right" | "none">>({});
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([]);
  const [groupBy, setGroupBy] = React.useState<string | null>(null);
  const [groupClosed, setGroupClosed] = React.useState<string[]>([]);
  const [pageSizeState, setPageSizeState] = React.useState<number | undefined>(pageSize);
  const [advRules, setAdvRules] = React.useState<AdvRule[]>([]);
  const [advMatch, setAdvMatch] = React.useState<"all" | "any">("all");
  const [advOpen, setAdvOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsSearch, setSettingsSearch] = React.useState("");
  const [dragKey, setDragKey] = React.useState<string | null>(null);
  const [colOrder, setColOrder] = React.useState<string[] | null>(null);
  const [aggs, setAggs] = React.useState<Record<string, "sum" | "avg" | "min" | "max" | "count">>({});
  const [rowOrder, setRowOrder] = React.useState<string[] | null>(null);
  const [rowDragId, setRowDragId] = React.useState<string | null>(null);
  const [rowOverId, setRowOverId] = React.useState<string | null>(null);
  const ruleSeq = React.useRef(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const effPageSize = pageSizeState ?? pageSize;

  const orderedCols = colOrder ? [...columns].sort((a, b) => { const ia = colOrder.indexOf(a.key), ib = colOrder.indexOf(b.key); return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib); }) : columns;
  const visCols = orderedCols.filter((c) => !hiddenCols.includes(c.key));
  const effPin = (c: Column<T>): "left" | "right" | undefined => {
    const o = pinOverride[c.key];
    if (o === "none") return undefined;
    return (o ?? c.pinned) as "left" | "right" | undefined;
  };
  const autosize = (key: string) => {
    const cells = rootRef.current?.querySelectorAll<HTMLElement>(`[data-col="${key}"]`);
    if (!cells || !cells.length) return;
    let w = 0;
    cells.forEach((el) => { w = Math.max(w, el.scrollWidth); });
    setColW((cw) => ({ ...cw, [key]: Math.min(520, Math.max(RESIZE_MIN, w + 30)) }));
  };
  const resetAll = () => {
    setSort(null); setColFilter({}); setRangeFilter({}); setColW({}); setPinOverride({});
    setHiddenCols([]); setGroupBy(null); setGroupClosed([]); setListSearch({}); setQuery(""); setPage(0);
    setColOrder(null); setAggs({}); setAdvRules([]);
  };
  const moveCol = (dragK: string, targetK: string) => {
    if (dragK === targetK) return;
    const order = (colOrder ?? columns.map((c) => c.key)).slice();
    const from = order.indexOf(dragK), to = order.indexOf(targetK);
    if (from < 0 || to < 0) return;
    order.splice(to, 0, order.splice(from, 1)[0]);
    setColOrder(order);
  };

  /* ── pinning: measure widths → sticky offsets ─────────── */
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const theadRef = React.useRef<HTMLTableSectionElement>(null);
  const thRefs = React.useRef<Record<string, HTMLTableCellElement | null>>({});
  const groupHeadRef = React.useRef<HTMLTableRowElement>(null);
  const [pins, setPins] = React.useState<PinMap>({});
  const [headH, setHeadH] = React.useState(0);
  const [groupH, setGroupH] = React.useState(0);

  const hasGroups = visCols.some((c) => c.group);
  const groupSegs = React.useMemo(() => {
    const segs: { group: string | null; count: number }[] = [];
    if (hasGroups) for (const c of visCols) {
      const g = c.group ?? null;
      const last = segs[segs.length - 1];
      if (last && last.group === g) last.count++;
      else segs.push({ group: g, count: 1 });
    }
    return segs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGroups, hiddenCols.join(), columns.length]);

  const leftPin = visCols.filter((c) => effPin(c) === "left");
  const rightPin = visCols.filter((c) => effPin(c) === "right");
  const hasLeftPin = leftPin.length > 0;
  const leftKeys = hasLeftPin
    ? [...(renderDetail ? [EXPAND] : []), ...(selectable ? [SELECT] : []), ...(rowNumbers ? [ROWNUM] : []), ...leftPin.map((c) => c.key)]
    : [];
  const rightKeys = rightPin.map((c) => c.key);
  const lastLeftKey = leftKeys[leftKeys.length - 1];
  const firstRightKey = rightKeys[0];
  const anyPinned = leftKeys.length > 0 || rightKeys.length > 0;

  // single joined key so this effect's dep list is always length 1 (never triggers React's "deps changed size")
  const pinKey = [leftKeys.join(","), rightKeys.join(","), density, appearance, visCols.length, selectable, rowNumbers, floatingFilters, groupBy ?? "", hasGroups, advOpen, editRow ?? "", editable, !!renderDetail, JSON.stringify(colW), JSON.stringify(pinOverride)].join("~");
  React.useLayoutEffect(() => {
    const compute = () => {
      const next: PinMap = {};
      let acc = 0;
      for (const k of leftKeys) { next[k] = { side: "left", px: acc }; acc += thRefs.current[k]?.getBoundingClientRect().width ?? 0; }
      acc = editable ? 84 : 0; // reserve the sticky actions column so right-pinned columns sit left of it
      for (let i = rightKeys.length - 1; i >= 0; i--) { const k = rightKeys[i]; next[k] = { side: "right", px: acc }; acc += thRefs.current[k]?.getBoundingClientRect().width ?? 0; }
      setPins(next);
      setHeadH(theadRef.current?.getBoundingClientRect().height ?? 0);
      setGroupH(groupHeadRef.current?.getBoundingClientRect().height ?? 0);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinKey]);

  const pinOf = (key: string) => {
    const o = pins[key];
    if (!o) return { cls: "", style: undefined as React.CSSProperties | undefined };
    const cls = "o-tbl__pin" + (key === lastLeftKey ? " o-tbl__pin-le" : "") + (key === firstRightKey ? " o-tbl__pin-rs" : "");
    return { cls, style: (o.side === "left" ? { left: o.px } : { right: o.px }) as React.CSSProperties };
  };


  const rows = React.useMemo(() => {
    const base = data.map((row, i) => ({ row, id: getRowId(row, i) }));
    if (!rowOrder) return base;
    return [...base].sort((a, b) => { const ia = rowOrder.indexOf(a.id), ib = rowOrder.indexOf(b.id); return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib); });
  }, [data, getRowId, rowOrder]);
  const moveRow = (dragId: string, targetId: string) => {
    if (dragId === targetId) return;
    const order = (rowOrder ?? rows.map((r) => r.id)).slice();
    const from = order.indexOf(dragId), to = order.indexOf(targetId);
    if (from < 0 || to < 0) return;
    order.splice(to, 0, order.splice(from, 1)[0]);
    setRowOrder(order); onRowReorder?.(order);
  };
  const valOf = (id: string, row: T, c: Column<T>) =>
    overrides[id]?.[c.key] ?? (c.value ? c.value(row) : cellText(row[c.key]));

  const errors = React.useMemo(() => {
    const m = new Map<string, string>();
    if (!editable) return m;
    for (const { row, id } of rows)
      for (const c of visCols)
        if (c.validate) { const msg = c.validate(String(valOf(id, row, c)), row); if (msg) m.set(`${id}:${c.key}`, msg); }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, visCols, overrides, editable]);
  const errorRowIds = React.useMemo(() => new Set([...errors.keys()].map((k) => k.slice(0, k.lastIndexOf(":")))), [errors]);

  const view = React.useMemo(() => {
    let out = rows;
    if (attentionOnly) out = out.filter(({ id }) => errorRowIds.has(id));
    for (const [k, allow] of Object.entries(colFilter)) {
      if (!allow.length) continue;
      const c = columns.find((x) => x.key === k);
      if (c) out = out.filter(({ row, id }) => allow.includes(String(valOf(id, row, c))));
    }
    for (const [k, rg] of Object.entries(rangeFilter)) {
      const c = columns.find((x) => x.key === k);
      if (c) out = out.filter(({ row, id }) => { const n = Number(valOf(id, row, c)); return isNaN(n) ? true : n >= rg.min && n <= rg.max; });
    }
    const rules = advRules.filter((r) => r.op === "empty" || r.op === "nempty" || r.val !== "");
    if (rules.length) {
      out = out.filter(({ row, id }) => {
        const results = rules.map((r) => { const c = columns.find((x) => x.key === r.col); return c ? advEval(String(valOf(id, row, c)), r.op, r.val) : true; });
        return advMatch === "all" ? results.every(Boolean) : results.some(Boolean);
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(({ row, id }) => visCols.some((c) => String(valOf(id, row, c)).toLowerCase().includes(q)));
    }
    if (sort) {
      const c = columns.find((x) => x.key === sort.key);
      if (c) out = [...out].sort((a, b) => {
        const av = valOf(a.id, a.row, c), bv = valOf(b.id, b.row, c);
        const na = Number(av), nb = Number(bv);
        const cmp = !isNaN(na) && !isNaN(nb) ? na - nb : av < bv ? -1 : av > bv ? 1 : 0;
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, columns, colFilter, rangeFilter, advRules, advMatch, query, sort, overrides, attentionOnly, errorRowIds]);

  const rowHasError = (id: string) => visCols.some((c) => errors.has(`${id}:${c.key}`));

  // if the row being edited is filtered / paged out of view, drop the edit so the bar can't get stuck
  React.useEffect(() => {
    if (editRow && !view.some((r) => r.id === editRow)) { setEditRow(null); setDraft({}); }
  }, [view, editRow]);
  // clear the attention filter once nothing needs attention

  const grouping = !!groupBy;
  const pages = effPageSize && !grouping ? Math.max(1, Math.ceil(view.length / effPageSize)) : 1;
  const pageClamped = Math.min(page, pages - 1);
  const paged = grouping ? view : effPageSize ? view.slice(pageClamped * effPageSize, pageClamped * effPageSize + effPageSize) : view;

  /* group rows by the chosen column's value */
  const groups = React.useMemo(() => {
    if (!groupBy) return [] as { key: string; rows: typeof view }[];
    const gc = columns.find((c) => c.key === groupBy);
    if (!gc) return [];
    const map = new Map<string, typeof view>();
    for (const r of view) { const k = String(valOf(r.id, r.row, gc)); (map.get(k) ?? map.set(k, []).get(k)!).push(r); }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([key, rows]) => ({ key, rows }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, view, columns, overrides]);

  const setSel = (ids: string[]) => { if (selected === undefined) setInnerSel(ids); onSelectedChange?.(ids); };
  const viewIds = view.map((r) => r.id);
  const allOn = viewIds.length > 0 && viewIds.every((id) => sel.includes(id));
  const someOn = sel.length > 0 && !allOn;
  const distinct = (c: Column<T>) => Array.from(new Set(rows.map(({ row, id }) => String(valOf(id, row, c))))).filter(Boolean).sort();
  const colType = (c: Column<T>): "text" | "number" => {
    if (c.type) return c.type;
    const vals = rows.map(({ row, id }) => String(valOf(id, row, c))).filter(Boolean);
    return vals.length > 0 && vals.every((v) => !isNaN(Number(v))) ? "number" : "text";
  };
  const numDomain = (c: Column<T>) => {
    const ns = rows.map(({ row, id }) => Number(valOf(id, row, c))).filter((n) => !isNaN(n));
    return { min: Math.min(...ns), max: Math.max(...ns) };
  };
  const aggKeys = Object.keys(aggs);
  const computeAggs = (entries: { row: T; id: string }[]) => {
    const out: Record<string, number> = {};
    for (const key of aggKeys) {
      const c = columns.find((x) => x.key === key); if (!c) continue;
      out[key] = aggregate(aggs[key], entries.map((e) => Number(valOf(e.id, e.row, c))).filter((n) => !isNaN(n)));
    }
    return out;
  };
  const fmtAgg = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toLocaleString("en-IN", { maximumFractionDigits: 1 }));

  const onSort = (k: string) => setSort((s) => (s?.key !== k ? { key: k, dir: "asc" } : s.dir === "asc" ? { key: k, dir: "desc" } : null));
  const toggleFilterVal = (k: string, v: string) => setColFilter((f) => { const cur = f[k] ?? []; return { ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }; });
  const commitEdit = (id: string, key: string, value: string) => { setOverrides((o) => ({ ...o, [id]: { ...o[id], [key]: value } })); onCellEdit?.(id, key, value); };

  /* ── row editing: edit every editable cell in a row at once ── */
  const editCols = visCols.filter((c) => c.editable);
  const enterEditRow = (id: string, row: T) => {
    const d: Record<string, string> = {};
    for (const c of editCols) d[c.key] = String(valOf(id, row, c));
    setDraft(d); setEditRow(id);
  };
  const draftErrors = () => {
    if (!editRow) return {} as Record<string, string>;
    const row = rows.find((r) => r.id === editRow)?.row;
    const e: Record<string, string> = {};
    if (row) for (const c of editCols) { const m = c.validate?.(draft[c.key] ?? "", row); if (m) e[c.key] = m; }
    return e;
  };
  const saveRow = () => {
    if (!editRow || Object.keys(draftErrors()).length) return;
    for (const c of editCols) if (draft[c.key] !== undefined) commitEdit(editRow, c.key, draft[c.key]);
    setEditRow(null); setDraft({});
  };
  const discardRow = () => { setEditRow(null); setDraft({}); };
  const onEditKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); saveRow(); } else if (e.key === "Escape") { e.preventDefault(); discardRow(); } };
  const leadCols = (rowDraggable ? 1 : 0) + (renderDetail ? 1 : 0) + (selectable ? 1 : 0) + (rowNumbers ? 1 : 0);
  const trailCols = editable ? 1 : 0;
  const spanAll = visCols.length + leadCols + trailCols;
  // removable filter chips shown in the toolbar, for both the filterTags and the
  // globalFilter modes; rendered with the Tag component below.
  const activeFilterTags = (filterTags || globalFilter) ? [
    ...Object.entries(colFilter).flatMap(([k, vals]) => vals.map((v) => ({ kind: "col" as const, k, v }))),
    ...Object.keys(rangeFilter).map((k) => ({ kind: "range" as const, k, v: "" })),
  ] : [];
  const showToolbar = title != null || actions != null || searchable || advancedFilter || settings || globalFilter || activeFilterTags.length > 0 || errors.size > 0 || attentionOnly;
  const activeRules = advRules.filter((r) => r.op === "empty" || r.op === "nempty" || r.val !== "");
  const advActive = activeRules.length;
  const advColLabel = (key: string) => { const c = columns.find((x) => x.key === key); return c && typeof c.header === "string" ? c.header : key; };
  const advOpLabel = (op: string) => ADV_OPS.find((o) => o.v === op)?.label ?? op;
  const addAdvRule = () => setAdvRules((r) => [...r, { id: `r${ruleSeq.current++}`, col: columns[0]?.key ?? "", op: "contains", val: "" }]);
  const sized = anyPinned || resizable || Object.keys(colW).length > 0;
  const rootCls = ["o-tbl", `o-tbl--${density}`, `o-tbl--${appearance}`, borderless ? "o-tbl--bare" : "", corners === "square" ? "o-tbl--square" : "", anyPinned ? "o-tbl--pinned" : "", sized ? "o-tbl--sized" : "", columnHover ? "o-tbl--colhover" : ""].filter(Boolean).join(" ");

  /* column resize via a drag handle on the header edge */
  const startResize = (key: string, e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX;
    const startW = thRefs.current[key]?.getBoundingClientRect().width ?? RESIZE_MIN;
    const dirMul = rtl ? -1 : 1;
    const move = (ev: PointerEvent) => setColW((w) => ({ ...w, [key]: Math.max(RESIZE_MIN, startW + dirMul * (ev.clientX - startX)) }));
    const up = () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };
  const colHoverProps = (key: string) => (columnHover ? { onMouseEnter: () => setHoverCol(key), onMouseLeave: () => setHoverCol((h) => (h === key ? null : h)) } : {});
  const colHoverCls = (key: string) => (columnHover && hoverCol === key ? " is-colhover" : "");
  const widthOf = (c: Column<T>) => colW[c.key] ?? c.width;

  /* one aligned pinned row (summary / totals), no edit / expand */
  const PinnedRow = ({ row, where, i }: { row: T; where: "top" | "bottom"; i: number }) => (
    <tr className={`o-tbl__pinrow o-tbl__pinrow--${where}`}>
      {rowDraggable && <td className="o-tbl__drag" />}
      {renderDetail && <td className={`o-tbl__ctrl ${pinOf(EXPAND).cls}`} style={{ ...pinOf(EXPAND).style, ...(where === "top" ? { top: headH } : undefined) }} />}
      {selectable && <td className={`o-tbl__ctrl ${pinOf(SELECT).cls}`} style={{ ...pinOf(SELECT).style, ...(where === "top" ? { top: headH } : undefined) }} />}
      {rowNumbers && <td className={`o-tbl__num ${pinOf(ROWNUM).cls}`} style={{ ...pinOf(ROWNUM).style, ...(where === "top" ? { top: headH } : undefined) }} />}
      {visCols.map((c) => { const p = pinOf(c.key); return <td key={c.key} data-col={c.key} className={p.cls} style={{ textAlign: c.align || "left", ...p.style, ...(where === "top" ? { top: headH } : undefined) }}>{c.render ? c.render(row) : row[c.key]}</td>; })}
      {trailCols > 0 && <td className="o-tbl__actcol" />}
    </tr>
  );

  const dErr = editRow ? draftErrors() : {};
  const editRowData = editRow ? rows.find((r) => r.id === editRow)?.row : undefined;
  const rowDirty = !!editRow && !!editRowData && editCols.some((c) => draft[c.key] !== undefined && draft[c.key] !== String(valOf(editRow, editRowData, c)));
  const renderDataRow = ({ row, id }: { row: T; id: string }, ri: number) => {
    const isExp = expanded.includes(id);
    const rowErr = rowHasError(id);
    const on = sel.includes(id);
    const editing = editRow === id;
    const rowNo = (effPageSize && !grouping ? pageClamped * effPageSize : 0) + ri + 1;
    return (
      <React.Fragment key={id}>
        <tr className={`${on ? "is-selected " : ""}${rowErr ? "is-error " : ""}${editing ? "is-editing " : ""}${rowDragId === id ? "is-rowdrag " : ""}${rowOverId === id ? "is-dropover" : ""}`}
          onDragOver={rowDraggable && rowDragId ? (e) => { e.preventDefault(); if (rowOverId !== id) setRowOverId(id); } : undefined}
          onDrop={rowDraggable && rowDragId ? (e) => { e.preventDefault(); moveRow(rowDragId, id); setRowDragId(null); setRowOverId(null); } : undefined}>
          {rowDraggable && (
            <td className="o-tbl__drag">
              <span className="o-tbl__draghandle" draggable role="button" aria-label="Drag to reorder" title="Drag to reorder"
                onDragStart={() => setRowDragId(id)} onDragEnd={() => { setRowDragId(null); setRowOverId(null); }}><IGrip /></span>
            </td>
          )}
          {renderDetail && (
            <td className={`o-tbl__ctrl ${pinOf(EXPAND).cls}`} style={pinOf(EXPAND).style}>
              <button type="button" className="o-tbl__disc" aria-label={isExp ? "Collapse row" : "Expand row"} aria-expanded={isExp} onClick={() => setExpanded((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]))}><IChevron open={isExp} /></button>
            </td>
          )}
          {selectable && (
            <td className={`o-tbl__ctrl ${pinOf(SELECT).cls}`} style={pinOf(SELECT).style}><Checkbox checked={on} onChange={() => setSel(on ? sel.filter((x) => x !== id) : [...sel, id])} aria-label="Select row" /></td>
          )}
          {rowNumbers && <td className={`o-tbl__num ${pinOf(ROWNUM).cls}`} style={pinOf(ROWNUM).style}>{rowNo}</td>}
          {visCols.map((c) => {
            const canEdit = editable && c.editable;
            const err = errors.get(`${id}:${c.key}`);
            const cellErr = editing && dErr[c.key];
            const p = pinOf(c.key);
            return (
              <td key={c.key} data-col={c.key} style={{ textAlign: c.align || "left", ...p.style }}
                className={`${canEdit && !editing ? "o-tbl__editable " : ""}${(err && !editing) || cellErr ? "o-tbl__cell-err " : ""}${p.cls}${colHoverCls(c.key)}`}
                {...colHoverProps(c.key)}
                onClick={canEdit && !editing ? () => enterEditRow(id, row) : undefined}
                title={cellErr || (!editing ? err : undefined) || undefined}>
                {editing && canEdit ? (
                  c.editor === "select" ? (
                    <select className="o-tbl__rowsel" value={draft[c.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.value }))} onKeyDown={onEditKey} aria-label={typeof c.header === "string" ? c.header : c.key}>
                      {(c.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input autoFocus={editCols[0]?.key === c.key} className={`o-tbl__input${cellErr ? " is-err" : ""}`} value={draft[c.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.value }))} onKeyDown={onEditKey} aria-label={typeof c.header === "string" ? c.header : c.key} aria-invalid={!!cellErr} />
                  )
                ) : (
                  <span className="o-tbl__cell">
                    {err && <span className="o-tbl__cell-x"><IX /></span>}
                    {c.render ? c.render(row) : (overrides[id]?.[c.key] ?? row[c.key])}
                  </span>
                )}
              </td>
            );
          })}
          {editable && (
            <td className="o-tbl__actcol">
              {editing ? (
                <span className="o-tbl__rowact">
                  <button type="button" className="o-tbl__rowact-ok" onClick={saveRow} disabled={!rowDirty || Object.keys(dErr).length > 0} aria-label="Done" title={rowDirty ? "Done" : "Change a value to save"}><ICheck /></button>
                  <button type="button" className="o-tbl__rowact-x" onClick={discardRow} aria-label="Revert" title="Revert"><IUndo /></button>
                </span>
              ) : editCols.length > 0 ? (
                <button type="button" className="o-tbl__rowedit" onClick={() => enterEditRow(id, row)} aria-label="Edit row" title="Edit row"><IPencil /></button>
              ) : null}
            </td>
          )}
        </tr>
        {renderDetail && isExp && (
          <tr className="o-tbl__detail-row"><td colSpan={spanAll}><div className="o-tbl__detail">{renderDetail(row)}</div></td></tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className={rootCls} ref={rootRef} dir={rtl ? "rtl" : undefined}>
      {showToolbar && (
        <div className="o-tbl__bar">
          <div className="o-tbl__bar-l">
            {title != null && <span className="o-tbl__title">{title}</span>}
            {(errorRowIds.size > 0 || attentionOnly) && (
              <button type="button" className={`o-tbl__errchip${attentionOnly ? " is-on" : ""}`} aria-pressed={attentionOnly} title={attentionOnly ? "Show all rows" : "Show only rows that need attention"} onClick={() => { setAttentionOnly((a) => !a); setPage(0); }}>
                <IWarn /> {errorRowIds.size} need attention
              </button>
            )}
            {(() => {
              const tagLabel = (t: typeof activeFilterTags[number]) => `${advColLabel(t.k)}: ${t.kind === "col" ? t.v : `${rangeFilter[t.k].min}–${rangeFilter[t.k].max}`}`;
              const tagRemove = (t: typeof activeFilterTags[number]) => () => (t.kind === "col" ? toggleFilterVal(t.k, t.v) : setRangeFilter((f) => { const n = { ...f }; delete n[t.k]; return n; }));
              // in globalFilter mode the toolbar is busy (title, search, actions), so collapse
              // every filter into a single "+N filters" chip; otherwise show up to TAG_CAP inline.
              const cap = globalFilter ? 0 : TAG_CAP;
              const shown = activeFilterTags.slice(0, cap);
              const rest = activeFilterTags.slice(cap);
              const restLabel = shown.length === 0
                ? `${rest.length} ${rest.length === 1 ? "filter" : "filters"}`
                : `+${rest.length} more ${rest.length === 1 ? "filter" : "filters"}`;
              return (<>
                {shown.map((t) => (
                  <Tag key={`${t.kind}-${t.k}-${t.v}`} className="o-tbl__ftag" title={tagLabel(t)} onRemove={tagRemove(t)}>{tagLabel(t)}</Tag>
                ))}
                {rest.length > 0 && (
                  <span className="o-tbl__filter">
                    <button type="button" className={`o-tbl__moretags${shown.length === 0 ? " o-tbl__moretags--solo" : ""}${moreTagsOpen ? " is-on" : ""}`} aria-expanded={moreTagsOpen}
                      onClick={(e) => { const el = e.currentTarget; setMoreTagsOpen((o) => !o); setMoreTagsAnchor(el); }}>
                      {shown.length === 0 && <IFunnel on />}{restLabel}
                    </button>
                    {moreTagsOpen && (
                      <FloatPopover anchor={moreTagsAnchor} container={rootRef.current} onClose={() => setMoreTagsOpen(false)}>
                        <div className="o-tbl__menu-hd">
                          <span>{activeFilterTags.length} filters</span>
                          <button type="button" onClick={() => { setColFilter({}); setRangeFilter({}); setPage(0); setMoreTagsOpen(false); }}>Clear all</button>
                        </div>
                        <div className="o-tbl__morelist">
                          {rest.map((t) => (
                            <Tag key={`${t.kind}-${t.k}-${t.v}`} onRemove={tagRemove(t)}>{tagLabel(t)}</Tag>
                          ))}
                        </div>
                      </FloatPopover>
                    )}
                  </span>
                )}
              </>);
            })()}
          </div>
          <div className="o-tbl__bar-r">
            {searchable && (
              <label className="o-tbl__search">
                <ISearch />
                <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Search" aria-label="Search rows" />
              </label>
            )}
            {advancedFilter && (
              <button type="button" className={`o-tbl__iconbtn${advOpen || advActive ? " is-on" : ""}`} aria-label="Advanced filter" title="Advanced filter" aria-expanded={advOpen} onClick={() => setAdvOpen((o) => !o)}>
                <IFormula />{advActive ? <span className="o-tbl__advcount">{advActive}</span> : null}
              </button>
            )}
            {actions}
            {settings && (
              <button type="button" className={`o-tbl__iconbtn${settingsOpen ? " is-on" : ""}`} aria-label="Table settings" title="Settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}><IGear /></button>
            )}
          </div>
        </div>
      )}

      {advancedFilter && (
        <Drawer open={advOpen} onClose={() => setAdvOpen(false)} container={rootRef.current} side="right" title="Advanced filter">
          <div className="o-tbl__advdrawer">
            <div className="o-tbl__advtree">
              <div className="o-tbl__advroot">
                <span>Match</span>
                <span className="o-tbl__advseg">
                  <button type="button" className={advMatch === "all" ? "is-on" : ""} onClick={() => setAdvMatch("all")}>all</button>
                  <button type="button" className={advMatch === "any" ? "is-on" : ""} onClick={() => setAdvMatch("any")}>any</button>
                </span>
                <span>of the conditions</span>
              </div>
              <div className="o-tbl__advnodes">
                {advRules.length === 0 && <p className="o-tbl__advempty">No conditions yet. Add one to build a query like “Name does not equal …”.</p>}
                {advRules.map((r, i) => {
                  const noVal = r.op === "empty" || r.op === "nempty";
                  return (
                    <div key={r.id} className="o-tbl__advnode">
                      {i > 0 && <span className="o-tbl__advjoin">{advMatch === "all" ? "AND" : "OR"}</span>}
                      <div className="o-tbl__advcard">
                        <button type="button" className="o-tbl__advdel" onClick={() => setAdvRules((rs) => rs.filter((x) => x.id !== r.id))} aria-label="Remove condition">×</button>
                        <label className="o-tbl__advfield"><span>Column</span>
                          <select value={r.col} onChange={(e) => setAdvRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, col: e.target.value } : x)))} aria-label="Column">
                            {columns.map((c) => <option key={c.key} value={c.key}>{advColLabel(c.key)}</option>)}
                          </select>
                        </label>
                        <label className="o-tbl__advfield"><span>Condition</span>
                          <select value={r.op} onChange={(e) => setAdvRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, op: e.target.value } : x)))} aria-label="Operator">
                            {ADV_OPS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                          </select>
                        </label>
                        {!noVal && <label className="o-tbl__advfield"><span>Value</span>
                          <input value={r.val} onChange={(e) => setAdvRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, val: e.target.value } : x)))} placeholder="Enter a value" aria-label="Value" />
                        </label>}
                      </div>
                    </div>
                  );
                })}
                <button type="button" className="o-tbl__advadd" onClick={addAdvRule}><IPlus /> Add condition</button>
              </div>
            </div>
            <div className="o-tbl__advactions">
              <Button variant="quiet" size="sm" onClick={() => setAdvRules([])} disabled={!advRules.length}>Clear all</Button>
              <Button variant="warm" size="sm" onClick={() => setAdvOpen(false)}>Done</Button>
            </div>
          </div>
        </Drawer>
      )}

      {settings && (
        <Drawer open={settingsOpen} onClose={() => setSettingsOpen(false)} container={rootRef.current} side="right" title="Table settings">
          <div className="o-tbl__setbody">
            <div className="o-tbl__setsec">
              <div className="o-tbl__setlab">Columns</div>
              <label className="o-tbl__floatsearch"><ISearch /><input value={settingsSearch} onChange={(e) => setSettingsSearch(e.target.value)} placeholder="Search columns" aria-label="Search columns" /></label>
              <div className="o-tbl__setcols">
                {orderedCols.filter((c) => advColLabel(c.key).toLowerCase().includes(settingsSearch.toLowerCase())).map((c) => (
                  <div key={c.key} className={`o-tbl__setcol${dragKey === c.key ? " is-drag" : ""}`} draggable
                    onDragStart={() => setDragKey(c.key)}
                    onDragOver={(e) => { e.preventDefault(); if (dragKey && dragKey !== c.key && !settingsSearch) moveCol(dragKey, c.key); }}
                    onDragEnd={() => setDragKey(null)}>
                    <span className="o-tbl__setgrip"><IGrip /></span>
                    <Checkbox checked={!hiddenCols.includes(c.key)} onChange={() => setHiddenCols((h) => (h.includes(c.key) ? h.filter((x) => x !== c.key) : [...h, c.key]))} aria-label={advColLabel(c.key)} />
                    <span className="o-tbl__setname">{c.header}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="o-tbl__setsec">
              <div className="o-tbl__setlab">Row groups</div>
              <div className={`o-tbl__dropzone${dragKey ? " is-armed" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragKey) setGroupBy(dragKey); setDragKey(null); }}>
                {groupBy ? <Tag onRemove={() => setGroupBy(null)}>{advColLabel(groupBy)}</Tag> : <span className="o-tbl__dzhint">Drag a column here to group rows by it</span>}
              </div>
            </div>

            <div className="o-tbl__setsec">
              <div className="o-tbl__setlab">Values <span className="o-tbl__setnote">Sum, average, count …</span></div>
              <div className={`o-tbl__dropzone${dragKey ? " is-armed" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragKey) { const c = columns.find((x) => x.key === dragKey); if (c && colType(c) === "number") setAggs((a) => ({ ...a, [dragKey]: "sum" })); } setDragKey(null); }}>
                {aggKeys.length === 0 ? <span className="o-tbl__dzhint">Drag a number column here to total it</span> : (
                  <div className="o-tbl__aggchips">
                    {aggKeys.map((k) => (
                      <span key={k} className="o-tbl__aggchip">
                        <select value={aggs[k]} onChange={(e) => setAggs((a) => ({ ...a, [k]: e.target.value as typeof a[string] }))} aria-label="Aggregation">{AGG_FNS.map((f) => <option key={f.v} value={f.v}>{f.label}</option>)}</select>
                        <span>{advColLabel(k)}</span>
                        <button type="button" onClick={() => setAggs((a) => { const n = { ...a }; delete n[k]; return n; })} aria-label="Remove">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="o-tbl__advactions">
              <Button variant="quiet" size="sm" onClick={resetAll}>Reset all</Button>
              <Button variant="warm" size="sm" onClick={() => setSettingsOpen(false)}>Done</Button>
            </div>
          </div>
        </Drawer>
      )}

      <div className={`o-tbl__scroll${stickyHeader ? " is-sticky" : ""}`} ref={scrollRef}>
        <table className="o-tbl__table">
          {caption && <caption className="o-tbl__caption">{caption}</caption>}
          <thead ref={theadRef}>
            {hasGroups && (
              <tr className="o-tbl__grouphead" ref={groupHeadRef}>
                {leadCols > 0 && <th className="o-tbl__gh-blank" colSpan={leadCols} />}
                {groupSegs.map((seg, i) => <th key={i} colSpan={seg.count} className={seg.group ? "o-tbl__gh" : "o-tbl__gh-blank"}>{seg.group}</th>)}
                {trailCols > 0 && <th className="o-tbl__gh-blank o-tbl__actcol" />}
              </tr>
            )}
            <tr>
              {rowDraggable && <th className="o-tbl__drag" aria-hidden="true" style={hasGroups && stickyHeader ? { top: groupH } : undefined} />}
              {renderDetail && <th className={`o-tbl__ctrl ${pinOf(EXPAND).cls}`} style={{ ...pinOf(EXPAND).style, ...(hasGroups && stickyHeader ? { top: groupH } : {}) }} ref={(el) => { thRefs.current[EXPAND] = el; }} aria-hidden="true" />}
              {selectable && (
                <th className={`o-tbl__ctrl ${pinOf(SELECT).cls}`} style={{ ...pinOf(SELECT).style, ...(hasGroups && stickyHeader ? { top: groupH } : {}) }} ref={(el) => { thRefs.current[SELECT] = el; }}>
                  <Checkbox checked={allOn} ref={(el) => { if (el) el.indeterminate = someOn; }} onChange={() => setSel(allOn ? sel.filter((id) => !viewIds.includes(id)) : Array.from(new Set([...sel, ...viewIds])))} aria-label="Select all rows" />
                </th>
              )}
              {rowNumbers && <th className={`o-tbl__num ${pinOf(ROWNUM).cls}`} style={{ ...pinOf(ROWNUM).style, ...(hasGroups && stickyHeader ? { top: groupH } : {}) }} ref={(el) => { thRefs.current[ROWNUM] = el; }}>#</th>}
              {visCols.map((c) => {
                const dir = sort?.key === c.key ? sort.dir : null;
                const filterOn = (colFilter[c.key]?.length ?? 0) > 0;
                const p = pinOf(c.key);
                return (
                  <th key={c.key} data-col={c.key} className={`${p.cls}${colHoverCls(c.key)}`} ref={(el) => { thRefs.current[c.key] = el; }} style={{ textAlign: c.align || "left", width: widthOf(c), ...p.style, ...(hasGroups && stickyHeader ? { top: groupH } : {}) }} aria-sort={dir ? (dir === "asc" ? "ascending" : "descending") : undefined} {...colHoverProps(c.key)}>
                    <span className={`o-tbl__th${c.align === "right" ? " is-right" : c.align === "center" ? " is-center" : ""}`}>
                      {c.sortable
                        ? <button type="button" className="o-tbl__th-btn" onClick={() => onSort(c.key)}>{c.header}{dir && <IArrow dir={dir === "asc" ? "up" : "down"} />}</button>
                        : <span className="o-tbl__th-label">{c.header}{dir && <IArrow dir={dir === "asc" ? "up" : "down"} />}</span>}
                      <span className="o-tbl__th-tools">
                        {c.filterable && (
                          <span className="o-tbl__filter">
                            <button type="button" className={`o-tbl__ico${filterOn ? " is-on" : ""}`} aria-label={`Filter ${typeof c.header === "string" ? c.header : c.key}`} aria-expanded={openMenu === c.key} onClick={(e) => { const t = e.currentTarget; setOpenMenu((m) => (m === c.key ? null : c.key)); setMenuAnchor(t); }}>
                              <IFunnel on={filterOn} />
                              {filterOn && !filterTags && <span className="o-tbl__icobadge">{colFilter[c.key].length}</span>}
                            </button>
                            {openMenu === c.key && (
                              <FloatPopover anchor={menuAnchor} container={rootRef.current} onClose={() => setOpenMenu(null)}>
                                <div className="o-tbl__menu-hd">
                                  <span>Filter</span>
                                  <button type="button" onClick={() => setColFilter((f) => ({ ...f, [c.key]: [] }))} disabled={!filterOn}>Clear</button>
                                </div>
                                <div className="o-tbl__menu-list">
                                  {distinct(c).map((v) => (
                                    <Checkbox key={v} className="o-tbl__menu-opt" label={v} checked={colFilter[c.key]?.includes(v) ?? false} onChange={() => { toggleFilterVal(c.key, v); setPage(0); }} />
                                  ))}
                                </div>
                              </FloatPopover>
                            )}
                          </span>
                        )}
                        <button type="button" className={`o-tbl__ico o-tbl__kebab${headerMenu === c.key ? " is-on" : ""}`} aria-label="Column menu" aria-expanded={headerMenu === c.key} onClick={(e) => { const t = e.currentTarget; setHeaderMenu((m) => (m === c.key ? null : c.key)); setHeaderAnchor(t); }}><IKebab /></button>
                      </span>
                    </span>
                    {resizable && <span className="o-tbl__resize" onPointerDown={(e) => startResize(c.key, e)} aria-hidden="true" />}
                    {headerMenu === c.key && (
                      <HeaderMenu
                        anchor={headerAnchor} container={rootRef.current} onClose={() => setHeaderMenu(null)}
                        colHeader={c.header} allColumns={columns} hiddenCols={hiddenCols}
                        pinState={effPin(c) ?? "none"} grouped={groupBy === c.key}
                        onSortAsc={() => { setSort({ key: c.key, dir: "asc" }); setHeaderMenu(null); }}
                        onSortDesc={() => { setSort({ key: c.key, dir: "desc" }); setHeaderMenu(null); }}
                        onPin={(s) => setPinOverride((pp) => ({ ...pp, [c.key]: s }))}
                        onAutosize={() => { autosize(c.key); setHeaderMenu(null); }}
                        onAutosizeAll={() => { visCols.forEach((cc) => autosize(cc.key)); setHeaderMenu(null); }}
                        onGroup={() => { setGroupBy(c.key); setHeaderMenu(null); }}
                        onUngroup={() => { setGroupBy(null); setHeaderMenu(null); }}
                        onToggleCol={(k) => setHiddenCols((h) => (h.includes(k) ? h.filter((x) => x !== k) : [...h, k]))}
                        onReset={() => { resetAll(); setHeaderMenu(null); }}
                      />
                    )}
                  </th>
                );
              })}
              {trailCols > 0 && <th className="o-tbl__actcol" aria-hidden="true" style={hasGroups && stickyHeader ? { top: groupH } : undefined} />}
            </tr>
            {floatingFilters && (
              <tr className="o-tbl__floatrow">
                {rowDraggable && <th className="o-tbl__drag" />}
                {renderDetail && <th className={`o-tbl__ctrl ${pinOf(EXPAND).cls}`} style={pinOf(EXPAND).style} />}
                {selectable && <th className={`o-tbl__ctrl ${pinOf(SELECT).cls}`} style={pinOf(SELECT).style} />}
                {rowNumbers && <th className={`o-tbl__num ${pinOf(ROWNUM).cls}`} style={pinOf(ROWNUM).style} />}
                {visCols.map((c) => {
                  const p = pinOf(c.key);
                  const type = colType(c);
                  const picks = colFilter[c.key] ?? [];
                  const rg = rangeFilter[c.key];
                  const active = picks.length > 0 || !!rg;
                  const opts = distinct(c);
                  const q = (listSearch[c.key] ?? "").toLowerCase();
                  const shown = q ? opts.filter((o) => o.toLowerCase().includes(q)) : opts;
                  const dom = type === "number" ? numDomain(c) : null;
                  const cur = rg ?? (dom ? { min: dom.min, max: dom.max } : null);
                  const summary = picks.length ? `${picks.length} selected` : rg ? `${rg.min} – ${rg.max}` : "All";
                  return (
                    <th key={c.key} className={`o-tbl__floatcell ${p.cls}`} style={p.style}>
                      <button type="button" className={`o-tbl__floatbtn${active ? " is-on" : ""}`} aria-expanded={openFloat === c.key} onClick={(e) => { const t = e.currentTarget; setOpenFloat((o) => (o === c.key ? null : c.key)); setFloatAnchor(t); }}>
                        <span className="o-tbl__floatsum">{summary}</span>
                        <IFunnel on={active} />
                      </button>
                      {openFloat === c.key && (
                        <FloatPopover anchor={floatAnchor} container={rootRef.current} onClose={() => setOpenFloat(null)}>
                          {type === "number" && dom && cur && (
                            <div className="o-tbl__floatsec">
                              <div className="o-tbl__floatlab">Range</div>
                              <RangeSlider min={dom.min} max={dom.max} value={cur} onChange={(v) => { setRangeFilter((f) => ({ ...f, [c.key]: v })); setPage(0); }} />
                            </div>
                          )}
                          <div className="o-tbl__floatsec">
                            <div className="o-tbl__floatlab">{type === "number" ? "Or pick values" : "Values"}</div>
                            <label className="o-tbl__floatsearch"><ISearch /><input value={listSearch[c.key] ?? ""} onChange={(e) => setListSearch((sx) => ({ ...sx, [c.key]: e.target.value }))} placeholder="Search values" aria-label="Search values" /></label>
                            <div className="o-tbl__floatlist">
                              {shown.map((v) => (
                                <Checkbox key={v} className="o-tbl__menu-opt" label={v} checked={picks.includes(v)} onChange={() => { toggleFilterVal(c.key, v); setPage(0); }} />
                              ))}
                              {shown.length === 0 && <span className="o-tbl__floatempty">No matches</span>}
                            </div>
                          </div>
                          <div className="o-tbl__floatfoot">
                            <button type="button" onClick={() => { setColFilter((f) => ({ ...f, [c.key]: [] })); setRangeFilter((f) => { const n = { ...f }; delete n[c.key]; return n; }); setListSearch((sx) => ({ ...sx, [c.key]: "" })); setPage(0); }} disabled={!active}>Clear</button>
                            <button type="button" className="o-tbl__floatdone" onClick={() => setOpenFloat(null)}>Done</button>
                          </div>
                        </FloatPopover>
                      )}
                    </th>
                  );
                })}
                {trailCols > 0 && <th className="o-tbl__actcol" aria-hidden="true" />}
              </tr>
            )}
          </thead>
          <tbody>
            {pinnedRows?.top?.map((row, i) => <PinnedRow key={`pt${i}`} row={row} where="top" i={i} />)}
            {view.length === 0 && (
              <tr><td className="o-tbl__empty" colSpan={spanAll}>{emptyMessage}</td></tr>
            )}
            {grouping
              ? groups.map((g) => {
                  const gopen = !groupClosed.includes(g.key);
                  return (
                    <React.Fragment key={`g-${g.key}`}>
                      <tr className="o-tbl__grouprow">
                        <td colSpan={spanAll}>
                          <button type="button" className="o-tbl__groupbtn" aria-expanded={gopen} onClick={() => setGroupClosed((s) => (s.includes(g.key) ? s.filter((x) => x !== g.key) : [...s, g.key]))}>
                            <IChevron open={gopen} />
                            <span className="o-tbl__grouplabel">{g.key || "—"}</span>
                            <span className="o-tbl__groupcount">{g.rows.length}</span>
                            {aggKeys.length > 0 && (() => { const a = computeAggs(g.rows); return <span className="o-tbl__groupaggs">{aggKeys.map((k) => <span key={k} className="o-tbl__groupagg">{AGG_FNS.find((f) => f.v === aggs[k])?.label} {advColLabel(k)}: <b>{fmtAgg(a[k])}</b></span>)}</span>; })()}
                          </button>
                        </td>
                      </tr>
                      {gopen && g.rows.map((entry, ri) => renderDataRow(entry, ri))}
                    </React.Fragment>
                  );
                })
              : paged.map((entry, ri) => renderDataRow(entry, ri))}
          </tbody>
          {(pinnedRows?.bottom?.length || aggKeys.length > 0) ? (
            <tfoot>
              {pinnedRows?.bottom?.map((row, i) => <PinnedRow key={`pb${i}`} row={row} where="bottom" i={i} />)}
              {aggKeys.length > 0 && (() => { const a = computeAggs(view); return (
                <tr className="o-tbl__aggrow">
                  {leadCols > 0 && <td colSpan={leadCols} />}
                  {visCols.map((c, ci) => <td key={c.key} data-col={c.key} style={{ textAlign: c.align || "left" }}>{aggKeys.includes(c.key) ? <span className="o-tbl__aggval">{AGG_FNS.find((f) => f.v === aggs[c.key])?.label} {fmtAgg(a[c.key])}</span> : ci === 0 ? "Total" : ""}</td>)}
                  {trailCols > 0 && <td className="o-tbl__actcol" />}
                </tr>
              ); })()}
            </tfoot>
          ) : null}
        </table>
      </div>

      {effPageSize && !grouping && view.length > 0 && (
        <div className="o-tbl__foot">
          <div className="o-tbl__foot-l">
            <span className="o-tbl__count">Total {view.length} items</span>
            {pageSizeOptions && pageSizeOptions.length > 0 && (
              <label className="o-tbl__rpp">
                <select value={effPageSize} onChange={(e) => { setPageSizeState(Number(e.target.value)); setPage(0); }} aria-label="Rows per page">
                  {pageSizeOptions.map((n) => <option key={n} value={n}>{n} / page</option>)}
                </select>
              </label>
            )}
          </div>
          <Pagination className="o-tbl__pager" page={pageClamped + 1} total={pages} onPage={(p) => setPage(p - 1)} />
        </div>
      )}

      {statusBar && (
        <div className="o-tbl__status">
          <span>{view.length} row{view.length === 1 ? "" : "s"}{view.length !== rows.length ? ` of ${rows.length}` : ""}</span>
          {selectable && <span>{sel.length} selected</span>}
        </div>
      )}
    </div>
  );
}
Table.displayName = "Table";

/* compact page list with ellipses: 1 … 4 [5] 6 … 50 */
/* A fixed-positioned portal resolves against the nearest ancestor that has a
   transform / filter / perspective / contain — not the viewport. Menus portal
   into the grid root (to inherit its theme tokens), so if any ancestor (e.g. a
   page-transition wrapper) is transformed, viewport coords land in the wrong
   place. Find that containing block so we can subtract its offset. */
function fixedContainingRect(node: HTMLElement | null): { top: number; left: number } {
  let el: HTMLElement | null = node;
  while (el) {
    const cs = getComputedStyle(el);
    if (
      cs.transform !== "none" ||
      cs.perspective !== "none" ||
      (cs.filter && cs.filter !== "none") ||
      (cs.willChange && /transform|perspective|filter/.test(cs.willChange)) ||
      (cs.contain && /paint|layout|strict|content/.test(cs.contain))
    ) {
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left };
    }
    el = el.parentElement;
  }
  return { top: 0, left: 0 };
}

function FloatPopover({ anchor, container, onClose, children }: { anchor: HTMLElement | null; container: HTMLElement | null; onClose: () => void; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null);
  React.useLayoutEffect(() => {
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const width = 232;
    const cb = fixedContainingRect(container);
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    setPos({ left: left - cb.left, top: r.bottom + 6 - cb.top });
  }, [anchor, container]);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node) && !anchor?.contains(e.target as Node)) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", key); };
  }, [anchor, onClose]);
  if (!pos || typeof document === "undefined") return null;
  return createPortal(<div ref={ref} className="o-tbl__floatpop" style={{ position: "fixed", left: pos.left, top: pos.top }} role="dialog">{children}</div>, container ?? document.body);
}

function RangeSlider({ min, max, value, onChange }: { min: number; max: number; value: { min: number; max: number }; onChange: (v: { min: number; max: number }) => void }) {
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;
  const fmt = (n: number) => (Math.abs(n) >= 1000 ? n.toLocaleString() : String(n));
  return (
    <div className="o-tbl__range">
      <div className="o-tbl__range-track"><div className="o-tbl__range-fill" style={{ left: `${pct(value.min)}%`, right: `${100 - pct(value.max)}%` }} /></div>
      <input type="range" min={min} max={max} value={value.min} aria-label="Minimum" onChange={(e) => onChange({ min: Math.min(Number(e.target.value), value.max), max: value.max })} />
      <input type="range" min={min} max={max} value={value.max} aria-label="Maximum" onChange={(e) => onChange({ min: value.min, max: Math.max(Number(e.target.value), value.min) })} />
      <div className="o-tbl__range-vals"><span>{fmt(value.min)}</span><span>{fmt(value.max)}</span></div>
    </div>
  );
}

/* portaled column overflow menu: sort · pin · autosize · group · choose columns · reset */
function HeaderMenu(props: {
  anchor: HTMLElement | null; container: HTMLElement | null; onClose: () => void;
  colHeader: React.ReactNode; allColumns: { key: string; header: React.ReactNode }[]; hiddenCols: string[];
  pinState: "left" | "right" | "none"; grouped: boolean;
  onSortAsc: () => void; onSortDesc: () => void; onPin: (s: "left" | "right" | "none") => void;
  onAutosize: () => void; onAutosizeAll: () => void; onGroup: () => void; onUngroup: () => void;
  onToggleCol: (k: string) => void; onReset: () => void;
}) {
  const { anchor, container, onClose, colHeader, allColumns, hiddenCols, pinState, grouped } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number; flyRight: boolean } | null>(null);
  const [sub, setSub] = React.useState<"pin" | "cols" | null>(null);
  React.useLayoutEffect(() => {
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const width = 216;
    const cb = fixedContainingRect(container);
    const vpLeft = Math.max(8, Math.min(r.right - width, window.innerWidth - width - 8));
    setPos({ left: vpLeft - cb.left, top: r.bottom + 6 - cb.top, flyRight: vpLeft + width + 196 <= window.innerWidth });
  }, [anchor, container]);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node) && !anchor?.contains(e.target as Node)) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", key); };
  }, [anchor, onClose]);
  if (!pos || typeof document === "undefined") return null;
  const pin = (s: "left" | "right" | "none") => { props.onPin(s); onClose(); };
  const flyCls = `o-tbl__hflyout${pos.flyRight ? "" : " is-left"}`;
  return createPortal(
    <div ref={ref} className="o-tbl__hmenu" style={{ position: "fixed", left: pos.left, top: pos.top }} role="menu">
      <button type="button" className="o-tbl__hmi" onClick={() => { props.onSortAsc(); }}><IArrow dir="up" /> Sort Ascending</button>
      <button type="button" className="o-tbl__hmi" onClick={() => { props.onSortDesc(); }}><IArrow dir="down" /> Sort Descending</button>
      <div className="o-tbl__hsep" />
      <div className="o-tbl__hmi-sub" onMouseEnter={() => setSub("pin")} onMouseLeave={() => setSub((s) => (s === "pin" ? null : s))}>
        <button type="button" className="o-tbl__hmi o-tbl__hmi--exp" aria-haspopup="menu" aria-expanded={sub === "pin"} onClick={() => setSub((s) => (s === "pin" ? null : "pin"))}><span>Pin Column</span><span className="o-tbl__hcaret">›</span></button>
        {sub === "pin" && (
          <div className={flyCls} role="menu">
            <button type="button" className={`o-tbl__hmi${pinState === "none" ? " is-on" : ""}`} onClick={() => pin("none")}>{pinState === "none" && <ICheck />} No Pin</button>
            <button type="button" className={`o-tbl__hmi${pinState === "left" ? " is-on" : ""}`} onClick={() => pin("left")}>{pinState === "left" && <ICheck />} Pin Left</button>
            <button type="button" className={`o-tbl__hmi${pinState === "right" ? " is-on" : ""}`} onClick={() => pin("right")}>{pinState === "right" && <ICheck />} Pin Right</button>
          </div>
        )}
      </div>
      <button type="button" className="o-tbl__hmi" onClick={props.onAutosize}>Autosize Column</button>
      <button type="button" className="o-tbl__hmi" onClick={props.onAutosizeAll}>Autosize All Columns</button>
      <div className="o-tbl__hsep" />
      {grouped
        ? <button type="button" className="o-tbl__hmi" onClick={props.onUngroup}>Ungroup</button>
        : <button type="button" className="o-tbl__hmi" onClick={props.onGroup}>Group by {colHeader}</button>}
      <div className="o-tbl__hmi-sub" onMouseEnter={() => setSub("cols")} onMouseLeave={() => setSub((s) => (s === "cols" ? null : s))}>
        <button type="button" className="o-tbl__hmi o-tbl__hmi--exp" aria-haspopup="menu" aria-expanded={sub === "cols"} onClick={() => setSub((s) => (s === "cols" ? null : "cols"))}><span>Choose Columns</span><span className="o-tbl__hcaret">›</span></button>
        {sub === "cols" && (
          <div className={`${flyCls} o-tbl__hcols`} role="menu">
            {allColumns.map((col) => (
              <label key={col.key} className="o-tbl__menu-opt">
                <input type="checkbox" checked={!hiddenCols.includes(col.key)} onChange={() => props.onToggleCol(col.key)} />
                <span>{col.header}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="o-tbl__hsep" />
      <button type="button" className="o-tbl__hmi" onClick={props.onReset}>Reset</button>
    </div>,
    container ?? document.body
  );
}
