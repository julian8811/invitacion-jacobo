import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { RSVP_STORAGE_KEY } from '../domain/rsvp';
import { EXPLORER_THEME } from '../proposals/themes';
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
    const { container } = render(<RsvpSection config={EVENT_CONFIG} theme={EXPLORER_THEME} />);

    expect(screen.getByRole('heading', { name: EVENT_CONFIG.rsvpHeading })).toBeInTheDocument();
    const mascotImg = screen.getByAltText(/elefantito explorador/i);
    expect(mascotImg).toHaveAttribute('src', '/images/p1-explorer-badge.png');
    expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('purges any stale saved RSVP from localStorage on mount and always renders the empty deployed form', () => {
    window.localStorage.setItem(
      RSVP_STORAGE_KEY,
      JSON.stringify({
        guestName: 'Respuesta Anterior',
        attending: true,
        adults: 2,
        children: 1,
        message: 'Mensaje viejo',
        submittedAt: '2026-11-22T00:00:00.000Z',
      }),
    );

    render(<RsvpSection config={EVENT_CONFIG} />);

    expect(window.localStorage.getItem(RSVP_STORAGE_KEY)).toBeNull();
    expect(screen.queryByText(/¡confirmación guardada!/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/nombre o familia/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /confirmar por whatsapp/i })).toBeInTheDocument();
  });

  it('shows a validation error when submitting an empty guest name', async () => {
    const user = userEvent.setup();
    render(<RsvpSection config={EVENT_CONFIG} />);

    await user.click(screen.getByRole('button', { name: /confirmar por whatsapp/i }));

    expect(screen.getByText(/por favor escribe tu nombre/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(RSVP_STORAGE_KEY)).toBeNull();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('opens WhatsApp with rich message on submit, does not persist to localStorage, resets and keeps full form deployed', async () => {
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

    // Never persists in localStorage
    expect(window.localStorage.getItem(RSVP_STORAGE_KEY)).toBeNull();

    // Full form remains visible and reset cleanly for next guest/response
    expect(screen.getByLabelText(/nombre o familia/i)).toHaveValue('');
    expect(screen.getByLabelText(/mensaje para jacobo/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /confirmar por whatsapp/i })).toBeInTheDocument();

    // Non-blocking fallback banner allows opening WhatsApp again or copying without hiding the form
    const waLink = screen.getByRole('link', { name: /abrir whatsapp de nuevo/i });
    const href = waLink.getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/573005944356?text=')).toBe(true);
    const decoded = decodeURIComponent(href.split('?text=')[1]);
    expect(decoded).toContain('Jacobo Pineda Jaramillo');
    expect(decoded).toContain('Familia Martínez');
    expect(decoded).toContain('3 personas (2 adultos y 1 niño)');
    expect(decoded).toContain('¡Feliz primer añito Jacobo!');
    expect(decoded).not.toMatch(/\p{Extended_Pictographic}/u);

    // Remount starts completely clean without remembering previous submission
    unmount();
    render(<RsvpSection config={EVENT_CONFIG} />);
    expect(screen.getByLabelText(/nombre o familia/i)).toHaveValue('');
    expect(screen.queryByRole('link', { name: /abrir whatsapp de nuevo/i })).not.toBeInTheDocument();
  });
});
