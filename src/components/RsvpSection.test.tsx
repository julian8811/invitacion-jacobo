import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { RSVP_STORAGE_KEY } from '../domain/rsvp';
import { RsvpSection } from './RsvpSection';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('RsvpSection', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the waving baby lion and exact video CTA heading', () => {
    render(<RsvpSection config={EVENT_CONFIG} />);

    expect(screen.getByRole('heading', { name: EVENT_CONFIG.rsvpHeading })).toBeInTheDocument();
    const lionImg = screen.getByAltText(/leoncito/i);
    expect(lionImg).toHaveAttribute('src', '/images/baby-lion-rsvp.png');
  });

  it('shows a validation error when submitting an empty guest name', async () => {
    const user = userEvent.setup();
    render(<RsvpSection config={EVENT_CONFIG} />);

    await user.click(screen.getByRole('button', { name: /guardar y preparar whatsapp/i }));

    expect(screen.getByText(/por favor escribe tu nombre/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(RSVP_STORAGE_KEY)).toBeNull();
  });

  it('saves attending RSVP, renders confirmed pass with WhatsApp deep link, and restores across mounts', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<RsvpSection config={EVENT_CONFIG} />);

    await user.type(screen.getByLabelText(/nombre o familia/i), 'Familia Martínez');
    await user.click(screen.getByRole('button', { name: /sumar adulto/i }));
    await user.click(screen.getByRole('button', { name: /sumar niño/i }));
    await user.type(screen.getByLabelText(/mensaje para jacobo/i), '¡Feliz primer añito Jacobo!');

    await user.click(screen.getByRole('button', { name: /guardar y preparar whatsapp/i }));

    expect(screen.getByText(/¡confirmación guardada!/i)).toBeInTheDocument();
    expect(screen.getByText(/familia martínez/i)).toBeInTheDocument();

    const waLink = screen.getByRole('link', { name: /enviar confirmación por whatsapp/i });
    const href = waLink.getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/573005944356?text=')).toBe(true);
    const decoded = decodeURIComponent(href.split('?text=')[1]);
    expect(decoded).toContain('Familia Martínez');
    expect(decoded).toContain('2 adultos');
    expect(decoded).toContain('1 niño');
    expect(decoded).toContain('¡Feliz primer añito Jacobo!');

    // Remount and confirm persisted pass loads and can switch back to edit mode
    unmount();
    render(<RsvpSection config={EVENT_CONFIG} />);

    expect(screen.getByText(/¡confirmación guardada!/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /editar confirmación/i }));
    expect(screen.getByLabelText(/nombre o familia/i)).toHaveValue('Familia Martínez');
  });
});
