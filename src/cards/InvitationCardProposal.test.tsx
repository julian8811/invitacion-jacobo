import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { InvitationCardProposal } from './InvitationCardProposal';

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(async () => 'data:image/png;base64,qr-mock'),
  },
}));

describe('InvitationCardProposal Safari WhatsApp card', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders verified event details, clickable CTA, QR code, and upholds exclusions', async () => {
    const { container } = render(<InvitationCardProposal config={EVENT_CONFIG} />);

    expect(screen.getByText(EVENT_CONFIG.eventTitle)).toBeInTheDocument();
    expect(screen.getByText(EVENT_CONFIG.honoree)).toBeInTheDocument();
    expect(screen.getByText(/Domingo, 13 de diciembre de 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.getByText(/Salón Social/i)).toBeInTheDocument();
    expect(screen.getByText(/Unidad Oporto Campestre/i)).toBeInTheDocument();

    const ctaButtonLink = screen.getByRole('link', {
      name: /abrir invitación interactiva/i,
    });
    expect(ctaButtonLink).toHaveAttribute('href', EVENT_CONFIG.liveUrl);

    await waitFor(() => {
      expect(
        screen.getByRole('img', { name: /código qr/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getAllByText(/escanea/i).length).toBeGreaterThan(0);

    const text = container.textContent ?? '';
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(text.toLowerCase()).not.toContain('regalo');
    expect(text.toLowerCase()).not.toContain('lluvia de sobres');
    expect(text.toLowerCase()).not.toContain('obsequio');
  });

  it('renders landscape og preview without gift language', () => {
    const { container } = render(
      <InvitationCardProposal config={EVENT_CONFIG} variant="og" />,
    );
    expect(screen.getByText(EVENT_CONFIG.eventTitle)).toBeInTheDocument();
    expect(screen.getByText(EVENT_CONFIG.honoree)).toBeInTheDocument();
    expect(container.textContent?.toLowerCase()).not.toContain('regalo');
  });

  it('renders clickable pre-invitation that links to the live page', () => {
    render(<InvitationCardProposal config={EVENT_CONFIG} variant="pre" />);
    const link = screen.getByRole('link', { name: /abrir invitación de jacobo/i });
    expect(link).toHaveAttribute('href', EVENT_CONFIG.liveUrl);
    expect(screen.getByText(/toca para abrir la invitación/i)).toBeInTheDocument();
    expect(screen.getByText(/preinvitación/i)).toBeInTheDocument();
  });
});
