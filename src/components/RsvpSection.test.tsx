import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { RSVP_STORAGE_KEY } from '../domain/rsvp';
import { PROPOSAL_BY_ID } from '../proposals/themes';
import { RsvpSection } from './RsvpSection';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('RsvpSection', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.localStorage.clear();
    window.open = vi.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
    cleanup();
  });

  it('renders the boy-jungle explorer mascot and exact video CTA heading with zero emojis', () => {
    const { container } = render(<RsvpSection config={EVENT_CONFIG} />);

    expect(screen.getByRole('heading', { name: EVENT_CONFIG.rsvpHeading })).toBeInTheDocument();
    const mascotImg = screen.getByAltText(/elefantito explorador/i);
    expect(mascotImg).toHaveAttribute('src', '/images/p1-explorer-badge.png');
    expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('adapts the mascot illustration per boy-jungle proposal theme', () => {
    const { rerender } = render(
      <RsvpSection config={EVENT_CONFIG} theme={PROPOSAL_BY_ID['selva-viva']} />,
    );
    expect(screen.getByAltText(/leoncito sonriente/i)).toHaveAttribute(
      'src',
      '/images/p2-selva-viva-lion.png',
    );

    rerender(<RsvpSection config={EVENT_CONFIG} theme={PROPOSAL_BY_ID.campamento} />);
    expect(screen.getByAltText(/monito sonriente/i)).toHaveAttribute(
      'src',
      '/images/p3-campamento-tent.png',
    );
  });

  it('shows a validation error when submitting an empty guest name', async () => {
    const user = userEvent.setup();
    render(<RsvpSection config={EVENT_CONFIG} />);

    await user.click(screen.getByRole('button', { name: /confirmar por whatsapp/i }));

    expect(screen.getByText(/por favor escribe tu nombre/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(RSVP_STORAGE_KEY)).toBeNull();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('saves attending RSVP, opens WhatsApp directly, renders confirmed pass, and restores across mounts', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<RsvpSection config={EVENT_CONFIG} />);

    await user.type(screen.getByLabelText(/nombre o familia/i), 'Familia Martínez');
    await user.click(screen.getByRole('button', { name: /sumar adulto/i }));
    await user.click(screen.getByRole('button', { name: /sumar niño/i }));
    await user.type(screen.getByLabelText(/mensaje para jacobo/i), '¡Feliz primer añito Jacobo!');

    await user.click(screen.getByRole('button', { name: /confirmar por whatsapp/i }));

    expect(window.open).toHaveBeenCalledTimes(1);
    const [openedUrl, target, features] = vi.mocked(window.open).mock.calls[0];
    expect(String(openedUrl).startsWith('https://wa.me/573005944356?text=')).toBe(true);
    expect(target).toBe('_blank');
    expect(features).toBe('noopener,noreferrer');

    expect(screen.getByText(/¡confirmación guardada!/i)).toBeInTheDocument();
    expect(screen.getByText(/familia martínez/i)).toBeInTheDocument();

    const waLink = screen.getByRole('link', { name: /enviar confirmación por whatsapp/i });
    const href = waLink.getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/573005944356?text=')).toBe(true);
    const decoded = decodeURIComponent(href.split('?text=')[1]);
    expect(decoded).toContain('Jacobo Pineda Jaramillo');
    expect(decoded).toContain('Familia Martínez');
    expect(decoded).toContain('3 personas (2 adultos y 1 niño)');
    expect(decoded).toContain('¡Feliz primer añito Jacobo!');
    expect(decoded).not.toMatch(/\p{Extended_Pictographic}/u);

    unmount();
    render(<RsvpSection config={EVENT_CONFIG} />);

    expect(screen.getByText(/¡confirmación guardada!/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /editar confirmación/i }));
    expect(screen.getByLabelText(/nombre o familia/i)).toHaveValue('Familia Martínez');
  });
});
