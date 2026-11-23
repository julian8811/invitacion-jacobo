import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CAROUSEL_INTERVAL_MS } from '../domain/carousel';
import { JACOBO_MEMORIES } from '../data/memories';
import { MemoriesCarouselSection } from './MemoriesCarouselSection';

describe('MemoriesCarouselSection', () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('renders all 13 chronological chapters starting with Bienvenido, with zero emojis and zero gifts', () => {
    const { container } = render(<MemoriesCarouselSection />);

    expect(
      screen.getByRole('heading', { name: /los primeros 11 meses de jacobo/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('El día que empezó todo')).toBeInTheDocument();
    expect(
      screen.getByAltText(/Jacobo recién nacido dormido plácidamente/i),
    ).toHaveAttribute('src', '/images/memories/00-bienvenido.jpg');

    for (const memory of JACOBO_MEMORIES) {
      expect(
        screen.getByRole('button', { name: `Ver recuerdo: ${memory.shortLabel}` }),
      ).toBeInTheDocument();
    }

    const fullText = container.textContent ?? '';
    expect(fullText).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(fullText.toLowerCase()).not.toContain('regalo');
    expect(fullText.toLowerCase()).not.toContain('lluvia de sobres');
  });

  it('navigates next, wraps backward to 11 meses, and jumps directly via thumbnail buttons', () => {
    render(<MemoriesCarouselSection />);

    fireEvent.click(screen.getByRole('button', { name: /siguiente recuerdo/i }));
    expect(screen.getByText('Nuestro pequeño milagro')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /recuerdo anterior/i }));
    expect(screen.getByText('El día que empezó todo')).toBeInTheDocument();

    // Wrapping backward from slide 0 lands on 11 meses
    fireEvent.click(screen.getByRole('button', { name: /recuerdo anterior/i }));
    expect(screen.getByText('Once meses de ilusión')).toBeInTheDocument();

    // Jump straight to 3 meses thumbnail
    fireEvent.click(screen.getByRole('button', { name: 'Ver recuerdo: 3 meses' }));
    expect(screen.getByText('Tres meses, mil miradas')).toBeInTheDocument();
    expect(screen.getByAltText(/Jacobo a los 3 meses despierto/i)).toHaveAttribute(
      'src',
      '/images/memories/03-meses.jpg',
    );
  });

  it('auto-advances every 4500ms and halts when paused', () => {
    vi.useFakeTimers();
    render(<MemoriesCarouselSection />);

    expect(screen.getByText('El día que empezó todo')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(CAROUSEL_INTERVAL_MS);
    });
    expect(screen.getByText('Nuestro pequeño milagro')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pausar/i }));
    expect(screen.getByRole('button', { name: /reanudar/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(CAROUSEL_INTERVAL_MS * 2);
    });
    expect(screen.getByText('Nuestro pequeño milagro')).toBeInTheDocument();
  });

  it('opens and closes the framed portrait lightbox dialog cleanly', () => {
    render(<MemoriesCarouselSection />);

    fireEvent.click(screen.getByRole('button', { name: /ampliar foto/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cerrar foto ampliada/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
