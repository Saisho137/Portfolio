import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getDictionary } from '@/i18n/dictionaries';

import CopyEmail from './CopyEmail';

const sendGTMEvent = vi.hoisted(() => vi.fn());
vi.mock('@next/third-parties/google', () => ({ sendGTMEvent }));

const EMAIL = 'name@example.com';
const labels = getDictionary('en').email;

const renderLink = () => render(<CopyEmail email={EMAIL} labels={labels} data-t='a' />);
const link = () => screen.getByRole('link', { name: EMAIL });
const stubClipboard = (implementation: (text: string) => Promise<void>) => {
  const writeText = vi.fn(implementation);
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });

  return writeText;
};

describe('CopyEmail', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('is a real mailto: link that says it copies, passing extra attributes through', () => {
    renderLink();

    expect(link()).toHaveAttribute('href', `mailto:${EMAIL}`);
    expect(link()).toHaveAttribute('title', labels.copy);
    expect(link()).toHaveAttribute('data-t', 'a');
  });

  it('copies the address instead of opening the mail app, and announces it', async () => {
    const writeText = stubClipboard(() => Promise.resolve());
    renderLink();

    const followed = fireEvent.click(link());
    await act(() => Promise.resolve());

    expect(followed).toBe(false);
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(screen.getByRole('status')).toHaveTextContent(labels.copied);
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: 'email_copy' });
  });

  it('clears the message after a moment', async () => {
    stubClipboard(() => Promise.resolve());
    renderLink();

    fireEvent.click(link());
    await act(() => Promise.resolve());
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('falls back to mailto: when copying fails', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    stubClipboard(() => Promise.reject(new Error('denied')));
    renderLink();

    fireEvent.click(link());
    await act(() => Promise.resolve());

    expect(assign).toHaveBeenCalledWith(`mailto:${EMAIL}`);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('keeps the browser default without the Clipboard API or on modified clicks', () => {
    const writeText = stubClipboard(() => Promise.resolve());
    renderLink();

    expect(fireEvent.click(link(), { metaKey: true })).toBe(true);
    expect(writeText).not.toHaveBeenCalled();

    vi.stubGlobal('navigator', { ...navigator, clipboard: undefined });
    expect(fireEvent.click(link())).toBe(true);
  });
});
