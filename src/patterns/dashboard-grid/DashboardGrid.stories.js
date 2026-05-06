/**
 * Patterns / Dashboard Grid
 *
 * The HR-facing showpiece. Composes every financial primitive in the
 * library into a single Bloomberg-class surface:
 *
 *   - 4 KPI tiles    (Card + PnLCell)
 *   - Regime + VIX    (RegimeChip + VixChip header strip)
 *   - 8-row blotter   (OrderRow)
 *   - 6-row positions (PositionRow)
 *   - Pre-trade band  (ThresholdBand)
 *
 * The point of this story is *composability* — every component is the
 * exact one shipped in its own story, not a duplicate. Change Button.css
 * and the dashboard's submit button changes too. Change PnLCell and
 * every KPI tile + every position row updates with it.
 *
 * Use this story as the "first glance" reviewers land on when judging
 * the system.
 */

import './dashboard-grid.css';

import { Card } from '../../components/card/Card.js';
import { PnLCell } from '../../financial/pnl-cell/PnLCell.js';
import { RegimeChip } from '../../financial/regime-chip/RegimeChip.js';
import { VixChip } from '../../financial/vix-chip/VixChip.js';
import { OrderRow } from '../../financial/order-row/OrderRow.js';
import { PositionRow } from '../../financial/position-row/PositionRow.js';
import { ThresholdBand } from '../../compliance/threshold-band/ThresholdBand.js';

export default {
  title: 'Patterns/Dashboard Grid',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**The first-glance showpiece.** Composes every financial + ' +
          'compliance primitive in the library into a single institutional ' +
          'surface. Ten distinct components, all referenced from their ' +
          'shipped source — change `--accent` and the entire dashboard ' +
          're-skins.\n\n' +
          'What is in here:\n\n' +
          '- 4 × `Card` containing `PnLCell` for KPI tiles\n' +
          '- `RegimeChip` + `VixChip` header strip\n' +
          '- 8 × `OrderRow` blotter (which itself uses `FixStateChip`)\n' +
          '- 6 × `PositionRow` table (which itself uses `PnLCell`)\n' +
          '- `ThresholdBand` pre-trade compliance footer',
      },
    },
  },
};

export const Surface = {
  name: 'Trading desk · full surface',
  render: () => {
    const root = document.createElement('div');
    root.className = 'eds-dash';

    // ── Header strip ─────────────────────────────────────────
    const head = document.createElement('div');
    head.className = 'eds-dash__head';
    head.innerHTML = `
      <div class="eds-dash__head-meta">
        <div class="eds-dash__head-eyebrow">Desk · institutional equities</div>
        <div class="eds-dash__head-title">Account · ED-PRIME-04 · paper</div>
      </div>
    `;
    const headRight = document.createElement('div');
    headRight.className = 'eds-dash__head-right';
    headRight.appendChild(RegimeChip({ regime: 'bear', confidence: 0.82, size: 'md' }));
    headRight.appendChild(VixChip({ value: 28.85, prior: 24.10, size: 'md' }));
    head.appendChild(headRight);
    root.appendChild(head);

    // ── KPI tiles ────────────────────────────────────────────
    const kpis = document.createElement('div');
    kpis.className = 'eds-dash__kpis';
    [
      {
        eyebrow: 'Day P&L',
        bodyEl: PnLCell({ value: 141840, delta: 141840, deltaPct: 0.0142, size: 'lg', block: true, currency: 'USD', showCurrency: true }),
        meta: 'Apr 24 · paper',
      },
      {
        eyebrow: 'Open positions',
        bodyEl: kpiNum('12', '7 long · 5 short'),
        meta: '$432.6K MV',
      },
      {
        eyebrow: 'Margin used',
        bodyEl: kpiNum('38.5%', 'of $10M Reg T'),
        meta: 'Reg T 12 CFR §220',
      },
      {
        eyebrow: 'Active alerts',
        bodyEl: kpiNum('3', '1 SAR draft · 2 review'),
        meta: '17a-4 retained',
      },
    ].forEach(({ eyebrow, bodyEl, meta }) => {
      const tile = document.createElement('article');
      tile.className = 'eds-dash__kpi';
      tile.innerHTML = `
        <div class="eds-dash__kpi-eyebrow">${eyebrow}</div>
        <div class="eds-dash__kpi-body" data-body></div>
        <div class="eds-dash__kpi-meta">${meta}</div>
      `;
      tile.querySelector('[data-body]').appendChild(bodyEl);
      kpis.appendChild(tile);
    });
    root.appendChild(kpis);

    // ── Blotter ──────────────────────────────────────────────
    const blotterShell = document.createElement('section');
    blotterShell.className = 'eds-dash__panel';
    blotterShell.innerHTML = `
      <div class="eds-dash__panel-head">
        <div class="eds-dash__panel-title">Execution blotter</div>
        <div class="eds-dash__panel-meta">8 orders · 5 filled · 1 partial · 1 working · 1 cancelled · 1 rejected</div>
      </div>
    `;

    const blotterHead = document.createElement('div');
    blotterHead.className = 'eds-dash__col-head';
    blotterHead.style.gridTemplateColumns = '80px 60px 80px 74px 52px 72px 74px 74px 50px 116px 1fr';
    ['Time','ID','Symbol','Side','Type','Qty','Limit','Stop','TIF','Status','Fill'].forEach((label, i) => {
      const cell = document.createElement('span');
      cell.textContent = label;
      if (i >= 5 && i <= 7) cell.style.textAlign = 'right';
      blotterHead.appendChild(cell);
    });
    blotterShell.appendChild(blotterHead);

    [
      { time: '14:32:08.142', id: 'a4f2c1', symbol: 'SPY',  side: 'buy',  type: 'LMT', qty: 200,  limit: 487.30, tif: 'DAY', status: 'filled',  filledQty: 200, avgFillPx: 487.28 },
      { time: '14:31:45.022', id: '83b9d2', symbol: 'NVDA', side: 'sell', type: 'MKT', qty: 50,   tif: 'IOC', status: 'filled',  filledQty: 50,  avgFillPx: 485.47 },
      { time: '14:30:12.881', id: '6e1f47', symbol: 'AAPL', side: 'buy',  type: 'LMT', qty: 1000, limit: 184.10, tif: 'DAY', status: 'partial', filledQty: 340, avgFillPx: 184.08 },
      { time: '14:28:33.504', id: '2c8a91', symbol: 'TLT',  side: 'sell', type: 'STP', qty: 300,  stop:  91.00,  tif: 'GTC', status: 'new' },
      { time: '14:27:09.218', id: 'd9b4e3', symbol: 'QQQ',  side: 'buy',  type: 'LMT', qty: 150,  limit: 412.20, tif: 'DAY', status: 'pending-new' },
      { time: '14:24:51.097', id: '7f0a2b', symbol: 'GLD',  side: 'sell', type: 'LMT', qty: 100,  limit: 218.85, tif: 'DAY', status: 'canceled' },
      { time: '14:21:18.336', id: '5b2e8c', symbol: 'NVDA', side: 'sell', type: 'MKT', qty: 5000, tif: 'IOC', status: 'rejected', rejectReason: 'Risk · single-name concentration breach (105% of cap)' },
      { time: '14:18:42.612', id: '1a6c50', symbol: 'JPM',  side: 'buy',  type: 'LMT', qty: 75,   limit: 184.50, tif: 'DAY', status: 'filled',  filledQty: 75,  avgFillPx: 184.48 },
    ].forEach((row) => blotterShell.appendChild(OrderRow({ ...row, interactive: true })));

    root.appendChild(blotterShell);

    // ── Positions ────────────────────────────────────────────
    const posShell = document.createElement('section');
    posShell.className = 'eds-dash__panel';
    posShell.innerHTML = `
      <div class="eds-dash__panel-head">
        <div class="eds-dash__panel-title">Positions</div>
        <div class="eds-dash__panel-meta">6 positions · 5 long · 1 short</div>
      </div>
    `;

    const posHead = document.createElement('div');
    posHead.className = 'eds-dash__col-head';
    posHead.style.gridTemplateColumns = '72px 62px 72px 74px 74px 100px 1fr 1fr 1fr';
    ['Symbol','Side','Qty','Avg','Last','MV','Unrealized','Realized','Total P&L'].forEach((label, i) => {
      const cell = document.createElement('span');
      cell.textContent = label;
      if (i >= 2 && i <= 5) cell.style.textAlign = 'right';
      if (i >= 6) cell.style.textAlign = 'right';
      posHead.appendChild(cell);
    });
    posShell.appendChild(posHead);

    [
      { symbol: 'SPY',  side: 'long',  qty: 200,  avg: 482.50, last: 487.32, realized: 0 },
      { symbol: 'QQQ',  side: 'long',  qty: 150,  avg: 408.20, last: 412.65, realized: 0 },
      { symbol: 'NVDA', side: 'long',  qty: 50,   avg: 495.00, last: 485.46, realized: 0 },
      { symbol: 'AAPL', side: 'long',  qty: 1000, avg: 182.10, last: 184.20, realized: 1250.00 },
      { symbol: 'TSLA', side: 'short', qty: 100,  avg: 248.00, last: 240.50, realized: 0 },
      { symbol: 'TLT',  side: 'long',  qty: 300,  avg:  92.40, last:  91.32, realized:  -180.00 },
    ].forEach((row) => posShell.appendChild(PositionRow({ ...row, interactive: true })));

    root.appendChild(posShell);

    // ── Compliance footer ────────────────────────────────────
    const footer = document.createElement('section');
    footer.className = 'eds-dash__panel';
    footer.innerHTML = `
      <div class="eds-dash__panel-head">
        <div class="eds-dash__panel-title">Pre-trade compliance · current ticket</div>
        <div class="eds-dash__panel-meta">SPY · BUY · 200 · LMT 487.30 · DAY</div>
      </div>
    `;
    footer.appendChild(
      ThresholdBand({
        notional: 97_460,
        disclosureAt: 1_000_000,
        blockAt: 5_000_000,
        jurisdiction: 'FINRA 4210(g) · single-name concentration',
        currency: 'USD',
      }),
    );
    root.appendChild(footer);

    // Disclaimer
    const dis = document.createElement('div');
    dis.className = 'eds-dash__disclaimer';
    dis.innerHTML =
      'Synthetic data. Paper-trade demonstration only. ' +
      'Composes <code>Card</code> · <code>PnLCell</code> · <code>RegimeChip</code> · ' +
      '<code>VixChip</code> · <code>OrderRow</code> · <code>FixStateChip</code> · ' +
      '<code>PositionRow</code> · <code>ThresholdBand</code>.';
    root.appendChild(dis);

    return root;
  },
};

// ─── helpers ─────────────────────────────────────────────────────────

function kpiNum(big, small) {
  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gap = '4px';
  wrap.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:600;
                color:var(--text-primary);font-variant-numeric:tabular-nums;line-height:1.1;">
      ${big}
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.04em;
                color:var(--text-tertiary);">
      ${small}
    </div>
  `;
  return wrap;
}
