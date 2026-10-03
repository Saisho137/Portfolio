import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { loaders, resetSkinCache, SKIN_LABELS } from './skins';
import SkinSwitcher from './SkinSwitcher';

const sendGTMEvent = vi.hoisted(() => vi.fn());
vi.mock('@next/third-parties/google', () => ({ sendGTMEvent }));

const FakeColorSkin = () => <h1>color skin</h1>;
const FakeBrutalistSkin = () => <h1>brutalist skin</h1>;

const renderSwitcher = () =>
  render(
    <SkinSwitcher>
      <h1>default skin</h1>
    </SkinSwitcher>
  );

const radio = (id: keyof typeof SKIN_LABELS) =>
  screen.getByRole('radio', { name: SKIN_LABELS[id] });

describe('SkinSwitcher', () => {
  let colorLoader: MockInstance<(typeof loaders)['raw-color']>;

  beforeEach(() => {
    resetSkinCache();
    colorLoader = vi.spyOn(loaders, 'raw-color').mockResolvedValue({ default: FakeColorSkin });
    vi.spyOn(loaders, 'brutalist').mockResolvedValue({ default: FakeBrutalistSkin });
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(document, 'startViewTransition');
  });

  it('renders the server skin (children) by default, without loading the others', () => {
    renderSwitcher();

    expect(screen.getByRole('heading', { name: 'default skin' })).toBeInTheDocument();
    expect(radio('raw-bw')).toBeChecked();
    expect(screen.getByRole('group', { name: 'Page style' })).toBeInTheDocument();
    expect(colorLoader).not.toHaveBeenCalled();
  });

  it.each([
    ['pointerenter', (el: HTMLElement) => fireEvent.pointerEnter(el.closest('label')!)],
    ['focus', (el: HTMLElement) => fireEvent.focus(el)],
    ['touchstart', (el: HTMLElement) => fireEvent.touchStart(el.closest('label')!)]
  ])('prefetches the skin on %s', (_, trigger) => {
    renderSwitcher();

    trigger(radio('raw-color'));

    expect(colorLoader).toHaveBeenCalledTimes(1);
  });

  it('downloads each skin only once', async () => {
    renderSwitcher();

    fireEvent.pointerEnter(radio('raw-color').closest('label')!);
    fireEvent.focus(radio('raw-color'));
    fireEvent.click(radio('raw-color'));

    await screen.findByRole('heading', { name: 'color skin' });
    expect(colorLoader).toHaveBeenCalledTimes(1);
  });

  it('swaps to the selected skin, announces it and tracks the change', async () => {
    renderSwitcher();

    fireEvent.click(radio('brutalist'));

    expect(await screen.findByRole('heading', { name: 'brutalist skin' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'default skin' })).not.toBeInTheDocument();
    expect(radio('brutalist')).toBeChecked();
    expect(screen.getByText(`Style: ${SKIN_LABELS.brutalist}`)).toBeInTheDocument();
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: 'skin_change', skin: 'brutalist' });
  });

  it('shows the server skin again when going back to raw-bw', async () => {
    renderSwitcher();

    fireEvent.click(radio('raw-color'));
    await screen.findByRole('heading', { name: 'color skin' });
    fireEvent.click(radio('raw-bw'));

    expect(await screen.findByRole('heading', { name: 'default skin' })).toBeInTheDocument();
  });

  it('keeps the current skin when the chunk fails to load', async () => {
    colorLoader.mockRejectedValue(new Error('offline'));
    renderSwitcher();

    fireEvent.click(radio('raw-color'));

    await waitFor(() => expect(colorLoader).toHaveBeenCalled());
    await act(() => Promise.resolve());
    expect(screen.getByRole('heading', { name: 'default skin' })).toBeInTheDocument();
    expect(radio('raw-bw')).toBeChecked();
  });

  it('uses a View Transition when available', async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.assign(document, { startViewTransition });
    renderSwitcher();

    fireEvent.click(radio('raw-color'));

    await screen.findByRole('heading', { name: 'color skin' });
    expect(startViewTransition).toHaveBeenCalledTimes(1);
  });

  it('skips the View Transition with prefers-reduced-motion', async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.assign(document, { startViewTransition });
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    renderSwitcher();

    fireEvent.click(radio('raw-color'));

    await screen.findByRole('heading', { name: 'color skin' });
    expect(startViewTransition).not.toHaveBeenCalled();
  });
});
