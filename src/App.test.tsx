import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App invitation flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('reveals the full invitation on envelope open and contains zero gift/registry references', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: /¡mi primer añito!/i })).toBeInTheDocument();
    expect(container.textContent?.toLowerCase()).not.toContain('regalo');
    expect(container.textContent?.toLowerCase()).not.toContain('lluvia de sobres');

    await user.click(screen.getByRole('button', { name: /abrir invitación/i }));

    // Wait for reveal transition (320ms)
    expect(
      await screen.findByRole('heading', { name: /¡confirma tu asistencia aquí abajo!/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/4:00 p\. m\./i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /salón social · unidad oporto campestre/i }),
    ).toBeInTheDocument();

    const fullTextLower = container.textContent?.toLowerCase() ?? '';
    expect(fullTextLower).not.toContain('regalo');
    expect(fullTextLower).not.toContain('lluvia de sobres');
    expect(fullTextLower).not.toContain('obsequio');
  });
});
