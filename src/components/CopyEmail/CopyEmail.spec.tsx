import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getDictionary } from '@/i18n/dictionaries';

import CopyEmail from './CopyEmail';

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock('@/utils/analytics', () => ({ trackEvent }));

const EMAIL = 'name@example.com';
const labels = getDictionary('en').email;

// setup() installs its own clipboard stub, so tests stub the Clipboard API after rendering
const renderLink = (options?: Parameters<typeof userEvent.setup>[0]) => ({
  user: userEvent.setup(options),
  ...render(<CopyEmail email={EMAIL} labels={labels} data-t='a' />)
});
const link = () => screen.getByRole('link', { name: EMAIL });

const stubClipboard = (implementation: (text: string) => Promise<void>) => {
  const writeText = vi.fn(implementation);
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });

  return writeText;
};

/** Whether the last click kept the browser default (i.e. would follow the mailto:) */
const lastClick = { followed: true };
const recordClick = (event: MouseEvent) => {
  lastClick.followed = !event.defaultPrevented;
  // jsdom can't navigate: stop it from trying after the assertion is recorded
  event.preventDefault();
};

describe('CopyEmail', () => {
  beforeEach(() => {
    document.addEventListener('click', recordClick);
  });

  afterEach(() => {
    document.removeEventListener('click', recordClick);
    vi.useRealTimers();
  });

  it('is a real mailto: link that says it copies, passing extra attributes through', () => {
    renderLink();

    expect(link()).toHaveAttribute('href', `mailto:${EMAIL}`);
    expect(link()).toHaveAttribute('title', labels.copy);
    expect(link()).toHaveAttribute('data-t', 'a');
  });

  it('copies the address instead of opening the mail app, and announces it', async () => {
    const { user } = renderLink();
    const writeText = stubClipboard(() => Promise.resolve());

    await user.click(link());

    expect(lastClick.followed).toBe(false);
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(screen.getByRole('status')).toHaveTextContent(labels.copied);
    expect(trackEvent).toHaveBeenCalledWith('email_copy', {});
  });

  it('clears the message after a moment', async () => {
    // Fake timers only here: user-event waits on real ones between steps elsewhere
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { user } = renderLink({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    stubClipboard(() => Promise.resolve());

    await user.click(link());
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('falls back to mailto: when copying fails', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    const { user } = renderLink();
    stubClipboard(() => Promise.reject(new Error('denied')));

    await user.click(link());

    expect(assign).toHaveBeenCalledWith(`mailto:${EMAIL}`);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('keeps the browser default on modified clicks (new tab, window…)', async () => {
    const { user } = renderLink();
    const writeText = stubClipboard(() => Promise.resolve());

    await user.keyboard('{Meta>}');
    await user.click(link());
    await user.keyboard('{/Meta}');

    expect(lastClick.followed).toBe(true);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('keeps the browser default without the Clipboard API', async () => {
    const { user } = renderLink();
    vi.stubGlobal('navigator', { ...navigator, clipboard: undefined });

    await user.click(link());

    expect(lastClick.followed).toBe(true);
  });
});
