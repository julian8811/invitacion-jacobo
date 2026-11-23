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

  it('displays Jacobo Pineda Jaramillo, 3:00 p. m., removes cake/friends/card sections, and has zero emojis/gifts', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: /¡mi primer añito!/i })).toBeInTheDocument();
    expect(screen.getByText(/jacobo pineda jaramillo/i)).toBeInTheDocument();
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
    expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
    expect(container.textContent?.toLowerCase()).not.toContain('regalo');
    expect(container.textContent?.toLowerCase()).not.toContain('lluvia de sobres');

    await user.click(screen.getByRole('button', { name: /abrir invitación/i }));

    expect(
      await screen.findByRole('heading', { name: /¡confirma tu asistencia aquí abajo!/i }),
    ).toBeInTheDocument();

    // Confirm full name, 3:00 p. m., and absence of all removed sections
    expect(screen.getAllByText(/jacobo pineda jaramillo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/toca a los amigos de jacobo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/comparte esta tarjeta por whatsapp/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pide un deseo por jacobo/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /soplar la velita/i })).not.toBeInTheDocument();

    // Strictly verify ZERO emojis and ZERO gift/registry words across full page
    const fullText = container.textContent ?? '';
    expect(fullText).not.toMatch(/\p{Extended_Pictographic}/u);
    const fullTextLower = fullText.toLowerCase();
    expect(fullTextLower).not.toContain('regalo');
    expect(fullTextLower).not.toContain('lluvia de sobres');
    expect(fullTextLower).not.toContain('obsequio');
  });
});
