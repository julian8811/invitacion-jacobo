import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App storybook invitation flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('reveals interactive kids features, share card, zero emojis, and zero gift references', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: /¡mi primer añito!/i })).toBeInTheDocument();
    expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
    expect(container.textContent?.toLowerCase()).not.toContain('regalo');
    expect(container.textContent?.toLowerCase()).not.toContain('lluvia de sobres');

    await user.click(screen.getByRole('button', { name: /abrir invitación/i }));

    expect(
      await screen.findByRole('heading', { name: /¡confirma tu asistencia aquí abajo!/i }),
    ).toBeInTheDocument();

    // Test interactive Safari Friends meadow
    await user.click(screen.getByRole('button', { name: /saludar a leoncito/i }));
    expect(screen.getByText(/saludaste a 1 de 3 amigos/i)).toBeInTheDocument();
    expect(screen.getByText(/te espero con muchos globos/i)).toBeInTheDocument();

    // Test interactive Birthday Cake candle mini-game
    await user.click(screen.getByRole('button', { name: /^soplar la velita$/i }));
    expect(screen.getByText(/¡deseo pedido!/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /volver a encender/i }));
    expect(screen.getByRole('button', { name: /^soplar la velita$/i })).toBeInTheDocument();

    // Test shareable WhatsApp card section
    const shareLink = screen.getByRole('link', { name: /enviar tarjeta por whatsapp/i });
    expect(shareLink.getAttribute('href')?.startsWith('https://wa.me/?text=')).toBe(true);

    // Strictly verify ZERO emojis and ZERO gift/registry words across full page
    const fullText = container.textContent ?? '';
    expect(fullText).not.toMatch(/\p{Extended_Pictographic}/u);
    const fullTextLower = fullText.toLowerCase();
    expect(fullTextLower).not.toContain('regalo');
    expect(fullTextLower).not.toContain('lluvia de sobres');
    expect(fullTextLower).not.toContain('obsequio');
  });
});
