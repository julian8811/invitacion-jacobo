import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { PROPOSALS } from './proposals/themes';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App local 3-proposal studio and boy-jungle invitations', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    cleanup();
  });

  it.each(PROPOSALS)(
    'renders %s full invitation flow with Jacobo Pineda Jaramillo, 3:00 p. m., zero removed sections, zero emojis, zero gifts',
    async (proposal) => {
      const user = userEvent.setup();
      window.history.replaceState({}, '', `/?propuesta=${proposal.number}`);
      const { container } = render(<App />);

      expect(screen.getByRole('heading', { name: /¡mi primer añito!/i })).toBeInTheDocument();
      expect(screen.getByText(/jacobo pineda jaramillo/i)).toBeInTheDocument();
      expect(screen.getByText(/3:00 p\. m\./i)).toBeInTheDocument();
      expect(screen.queryByText(/4:00 p\. m\./i)).not.toBeInTheDocument();
      expect(container.textContent ?? '').not.toMatch(/\p{Extended_Pictographic}/u);
      expect(container.textContent?.toLowerCase()).not.toContain('regalo');
      expect(container.textContent?.toLowerCase()).not.toContain('lluvia de sobres');

      await user.click(screen.getByRole('button', { name: new RegExp(proposal.copy.introCta, 'i') }));

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
    },
  );

  it('switches cleanly between the 3 proposals and between Page and WhatsApp Card views locally', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /2\. selva viva/i }));
    expect(screen.getByRole('button', { name: /entrar a la selva/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /3\. campamento/i }));
    expect(screen.getByRole('button', { name: /encender la invitación/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tarjeta whatsapp/i }));
    const cardButton = screen.getByRole('link', { name: /entrar a la aventura/i });
    expect(cardButton).toHaveAttribute('href', 'https://invitacion-jacobo.vercel.app');
    expect(screen.queryByText(/código qr/i)).not.toBeInTheDocument();
  });
});
