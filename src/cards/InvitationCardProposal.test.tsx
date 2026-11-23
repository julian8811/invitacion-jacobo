import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { PROPOSALS } from '../proposals/themes';
import { InvitationCardProposal } from './InvitationCardProposal';

describe('InvitationCardProposal standalone cards', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(PROPOSALS)(
    'renders %s card with verified event details, clickable page button, and NO QR code, emojis, or gifts',
    (proposal) => {
      const { container } = render(
        <InvitationCardProposal config={EVENT_CONFIG} theme={proposal} />,
      );

      expect(screen.getByText(EVENT_CONFIG.eventTitle)).toBeInTheDocument();
      expect(screen.getByText(EVENT_CONFIG.honoree)).toBeInTheDocument();
      expect(screen.getByText(/Domingo, 13 de diciembre de 2026/i)).toBeInTheDocument();
      expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
      expect(screen.getByText(/Salón Social · Unidad Oporto Campestre/i)).toBeInTheDocument();

      const ctaButtonLink = screen.getByRole('link', {
        name: new RegExp(proposal.copy.cardButtonLabel, 'i'),
      });
      expect(ctaButtonLink).toHaveAttribute('href', EVENT_CONFIG.liveUrl);

      // Must replace QR code with a button — never render canvas or QR instructions
      expect(container.querySelector('canvas')).toBeNull();
      const text = container.textContent ?? '';
      expect(text).not.toMatch(/\bqr\b/i);
      expect(text.toLowerCase()).not.toContain('escanea');
      expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(text.toLowerCase()).not.toContain('regalo');
      expect(text.toLowerCase()).not.toContain('lluvia de sobres');
      expect(text.toLowerCase()).not.toContain('obsequio');
    },
  );
});
