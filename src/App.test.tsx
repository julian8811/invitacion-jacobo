import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App Explorer production invitation flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    cleanup();
  });

  it('renders Pequeño Explorador cover without studio switcher, opens cleanly, and upholds all exclusions', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    // Local preview studio controls must not appear in production
    expect(screen.queryByText(/vista local/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /2\. selva viva/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /3\. campamento/i })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /¡mi primer añito!/i })).toBeInTheDocument();
    expect(screen.getByText(/jacobo pineda jaramillo/i)).toBeInTheDocument();
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
    expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
    expect(container.textContent?.toLowerCase()).not.toContain('regalo');
    expect(container.textContent?.toLowerCase()).not.toContain('lluvia de sobres');

    await user.click(screen.getByRole('button', { name: /abrir expedición/i }));

    expect(
      await screen.findByRole('heading', { name: /¡confirma tu asistencia aquí abajo!/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/jacobo pineda jaramillo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
    expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
    expect(screen.queryByText(/toca a los amigos de jacobo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/comparte esta tarjeta por whatsapp/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pide un deseo por jacobo/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /soplar la velita/i })).not.toBeInTheDocument();

    const fullText = container.textContent ?? '';
    expect(fullText).not.toMatch(/\p{Extended_Pictographic}/u);
    const fullTextLower = fullText.toLowerCase();
    expect(fullTextLower).not.toContain('regalo');
    expect(fullTextLower).not.toContain('lluvia de sobres');
    expect(fullTextLower).not.toContain('obsequio');
  });
});
