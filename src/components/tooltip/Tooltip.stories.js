import { Tooltip } from './Tooltip.js';

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pure-CSS hover affordance. The trigger and bubble live in ' +
          'the same DOM node — no portal, no positioning library. Four ' +
          'placements (top / right / bottom / left). Hover or keyboard ' +
          'focus reveals. `aria-describedby` wires the bubble to the ' +
          'trigger so screen readers announce it.\n\n' +
          'Tooltip is supplementary — never the only carrier of meaning. ' +
          'For floating UI with collision detection or rich content, ' +
          'use Popover instead.',
      },
    },
  },
  argTypes: {
    text: { control: 'text', table: { category: 'Content' } },
    placement: {
      control: { type: 'inline-radio' },
      options: ['top', 'right', 'bottom', 'left'],
      table: { category: 'Position' },
    },
    triggerHtml: { control: 'text', table: { category: 'Slots' } },
  },
  args: {
    text: 'Tabular-nums means dot positions align across rows even when integer widths differ.',
    placement: 'top',
    triggerHtml: 'tabular-nums',
  },
  render: (args) => Tooltip(args),
};

export const Default = {};

export const AllPlacements = {
  parameters: {
    docs: {
      description: {
        story:
          'All four placements. The trigger sits in the middle; tooltips ' +
          'fan out in each direction. Tab through to see keyboard reveal.',
      },
    },
  },
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = 'repeat(4, 1fr)';
    root.style.gap = '40px';
    root.style.padding = '60px 16px';
    root.style.placeItems = 'center';

    ['top', 'right', 'bottom', 'left'].forEach((placement) => {
      root.appendChild(
        Tooltip({
          placement,
          text: `Reveals on ${placement}.`,
          triggerHtml: placement,
        }),
      );
    });
    return root;
  },
};

export const InText = {
  name: 'Use case · inline help',
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip applied to a term inside body copy — hover reveals the ' +
          'definition without breaking flow. Dotted underline signals a ' +
          'help target without competing with link styling.',
      },
    },
  },
  render: () => {
    const root = document.createElement('p');
    root.style.fontFamily = 'Inter, sans-serif';
    root.style.fontSize = '0.95rem';
    root.style.lineHeight = '1.7';
    root.style.maxWidth = '560px';
    root.style.color = 'var(--text-secondary)';
    root.innerHTML = `
      The five-state HMM regime classifier (`;
    root.appendChild(
      Tooltip({
        triggerHtml: 'HMM',
        text: 'Hidden Markov Model — a statistical model that infers a sequence of unobserved states (regimes) from observed data (returns, volatility).',
      }),
    );
    const tail = document.createTextNode(
      `) bins SPY/QQQ/VIX history into Crash · Bear · Neutral · Bull · Euphoria. Each regime carries its own forward-return distribution, which the `,
    );
    root.appendChild(tail);
    root.appendChild(
      Tooltip({
        triggerHtml: 'Risk Util gauge',
        placement: 'bottom',
        text: 'Risk utilisation — used capital divided by available margin, expressed as a percentage. Above 100% triggers a margin call.',
      }),
    );
    root.appendChild(
      document.createTextNode(' uses to derive a defensive default before you place a trade.'),
    );
    return root;
  },
};
