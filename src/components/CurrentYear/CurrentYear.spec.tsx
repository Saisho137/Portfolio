import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CurrentYear from './CurrentYear';

describe('CurrentYear', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('prints the build year in the prerendered HTML', () => {
    vi.useFakeTimers({ now: new Date('2030-06-01T12:00:00Z') });

    expect(renderToString(<CurrentYear buildYear={2026} />)).toBe('2026');
  });

  it("shows the visitor's current year in the browser", () => {
    vi.useFakeTimers({ now: new Date('2030-06-01T12:00:00Z') });
    render(
      <p>
        © <CurrentYear buildYear={2026} />
      </p>
    );

    expect(screen.getByText('© 2030')).toBeInTheDocument();
  });
});
