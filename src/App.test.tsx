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

  it('displays 3:00 p. m., removes safari friends and on-page share card, keeps cake game, and has zero emojis/gifts', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: /¡mi primer añito!/i })).toBeInTheDocument();
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
    expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
    expect(container.textContent?.toLowerCase()).not.toContain('regalo');
    expect(container.textContent?.toLowerCase()).not.toContain('lluvia de sobres');

    await user.click(screen.getByRole('button', { name: /abrir invitación/i }));

    expect(
      await screen.findByRole('heading', { name: /¡confirma tu asistencia aquí abajo!/i }),
    ).toBeInTheDocument();

    // Confirm 3:00 p. m. and absence of removed sections
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/toca a los amigos de jacobo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/comparte esta tarjeta por whatsapp/i)).not.toBeInTheDocument();

    // Keep interactive Birthday Cake candle mini-game
    await user.click(screen.getByRole('button', { name: /^soplar la velita$/i }));
    expect(screen.getByText(/¡deseo pedido!/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /volver a encender/i }));
    expect(screen.getByRole('button', { name: /^soplar la velita$/i })).toBeInTheDocument();

    // Strictly verify ZERO emojis and ZERO gift/registry words across full page
    const fullText = container.textContent ?? '';
    expect(fullText).not.toMatch(/\p{Extended_Pictographic}/u);
    const fullTextLower = fullText.toLowerCase();
    expect(fullTextLower).not.toContain('regalo');
    expect(fullTextLower).not.toContain('lluvia de sobres');
    expect(fullTextLower).not.toContain('obsequio');
  });
});
