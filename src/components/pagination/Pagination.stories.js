import { Pagination } from './Pagination.js';

export default {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page navigator for blotters, audit logs, KYC review queues. ' +
          'Three variants: `compact` (« ‹ 1 … 5 6 7 … 24 › »), `numbered` ' +
          '(heavier numbered tiles), `minimal` (‹ Page 5 of 24 ›). ' +
          'Tabular-nums on the range readout so totals do not jitter on refresh.',
      },
    },
  },
  argTypes: {
    currentPage:    { control: 'number', table: { category: 'State' } },
    totalPages:     { control: 'number', table: { category: 'State' } },
    totalItems:     { control: 'number', table: { category: 'State' } },
    pageSize:       { control: 'number', table: { category: 'State' } },
    siblingCount:   { control: 'number', table: { category: 'Layout' } },
    boundaryCount:  { control: 'number', table: { category: 'Layout' } },
    showFirstLast:  { control: 'boolean', table: { category: 'Layout' } },
    showPrevNext:   { control: 'boolean', table: { category: 'Layout' } },
    showRange:      { control: 'boolean', table: { category: 'Layout' } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      table: { category: 'Display' },
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['compact', 'numbered', 'minimal'],
      table: { category: 'Display' },
    },
    ariaLabel:      { control: 'text', table: { category: 'Accessibility' } },
  },
  args: {
    currentPage: 5,
    totalPages: 24,
    totalItems: 247,
    pageSize: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    showRange: true,
    size: 'md',
    variant: 'compact',
    ariaLabel: 'Pagination',
  },
  render: (args) => Pagination(args),
};

export const Default = {};

export const Variants = {
  parameters: {
    docs: {
      description: {
        story:
          'Three variants for three contexts. Compact for blotters · ' +
          'numbered for audit logs · minimal for KYC review queues where the ' +
          'analyst wants minimal chrome between rows.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '24px';
    ['compact', 'numbered', 'minimal'].forEach((v) =>
      root.appendChild(
        Pagination({
          variant: v,
          currentPage: 5,
          totalPages: 24,
          totalItems: 247,
          pageSize: 10,
          showRange: true,
        })
      )
    );
    return root;
  },
};

export const Sizes = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '24px';
    ['sm', 'md', 'lg'].forEach((s) =>
      root.appendChild(
        Pagination({ size: s, currentPage: 3, totalPages: 12, showRange: false })
      )
    );
    return root;
  },
};

export const FirstPage = {
  args: { currentPage: 1, totalPages: 24 },
  parameters: {
    docs: {
      description: {
        story:
          'On page 1 the « and ‹ buttons render as `disabled` with ' +
          '`aria-disabled="true"` — visually muted, screen reader still ' +
          'announces them so the navigation surface is intact.',
      },
    },
  },
};

export const LastPage = {
  args: { currentPage: 24, totalPages: 24 },
};

export const FewPages = {
  args: { currentPage: 2, totalPages: 4, showRange: false },
  parameters: {
    docs: {
      description: {
        story:
          'When `totalPages ≤ boundaryCount*2 + siblingCount*2 + 3`, all ' +
          'pages render with no ellipses — keeps the strip honest at small ' +
          'page counts.',
      },
    },
  },
};

export const ManySiblings = {
  args: { currentPage: 13, totalPages: 24, siblingCount: 3, boundaryCount: 1 },
  parameters: {
    docs: {
      description: {
        story:
          '`siblingCount: 3` shows three pages either side of current — ' +
          'desktop blotter where horizontal real estate is cheap.',
      },
    },
  },
};

export const NoFirstLast = {
  args: { showFirstLast: false, currentPage: 5, totalPages: 24 },
};

export const Minimal = {
  args: { variant: 'minimal', currentPage: 3, totalPages: 18, showRange: false },
};

export const BlotterUseCase = {
  name: 'Use case · order blotter',
  parameters: {
    docs: {
      description: {
        story:
          'A 50-row blotter footer. Range readout sits left, page strip ' +
          'sits right. As the user paginates the click handler logs to ' +
          'console (open DevTools to verify the wiring).',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.padding = '12px 16px';
    root.style.background = 'var(--bg-surface)';
    root.style.border = '1px solid var(--border)';
    root.style.borderRadius = '6px';
    let cur = 1;
    const total = 50;
    const renderInto = (host) => {
      host.innerHTML = '';
      host.appendChild(
        Pagination({
          currentPage: cur,
          totalPages: total,
          totalItems: 1247,
          pageSize: 25,
          showRange: true,
          size: 'sm',
          siblingCount: 1,
          onChange: (p) => {
            cur = p;
            console.log('[Blotter] go to page', p);
            renderInto(host);
          },
        })
      );
    };
    renderInto(root);
    return root;
  },
};

export const AuditLogUseCase = {
  name: 'Use case · audit log',
  parameters: {
    docs: {
      description: {
        story:
          'Audit logs are append-only, often million-row scale. Use the ' +
          'numbered variant with larger sibling count and the range readout ' +
          'forced on so the compliance officer always knows where they are ' +
          'in the timeline.',
      },
    },
  },
  render: () =>
    Pagination({
      variant: 'numbered',
      currentPage: 47,
      totalPages: 832,
      totalItems: 20791,
      pageSize: 25,
      showRange: true,
      siblingCount: 2,
      boundaryCount: 1,
      size: 'md',
    }),
};
