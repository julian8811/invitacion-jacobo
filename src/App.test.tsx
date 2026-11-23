import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App Safari invitation flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    cleanup();
  });

  it('renders Safari cover without proposal switcher, opens cleanly, and upholds exclusions', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.queryByLabelText(/selector de propuestas de diseño/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /2 libro/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /3 expedición/i })).not.toBeInTheDocument();

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
    expect(
      screen.getByRole('heading', { name: /los primeros 11 meses de jacobo/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/jacobo pineda jaramillo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();

    const fullText = container.textContent ?? '';
    expect(fullText).not.toMatch(/\p{Extended_Pictographic}/u);
    const fullTextLower = fullText.toLowerCase();
    expect(fullTextLower).not.toContain('regalo');
    expect(fullTextLower).not.toContain('lluvia de sobres');
    expect(fullTextLower).not.toContain('obsequio');
  });
});
