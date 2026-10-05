import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { getProfile } from '@/content';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { SkinProps } from '@/skins/types';

import { mockMatchMedia } from '../../../vitest.setup';

import { loaders, resetSkinCache, type SkinId } from './skins';
import SkinSwitcher from './SkinSwitcher';

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock('@/utils/analytics', () => ({ trackEvent }));

const FakeColorSkin = () => <h1>color skin</h1>;
const FakeBrutalistSkin = ({ profile, lang }: SkinProps) => (
  <h1>
    brutalist skin {lang} {profile.summary}
  </h1>
);

const labels = getDictionary('en').settings;

const renderSwitcher = (lang: Locale = 'en') => ({
  user: userEvent.setup(),
  ...render(
    <SkinSwitcher lang={lang} labels={getDictionary(lang).settings}>
      <h1>default skin</h1>
    </SkinSwitcher>
  )
});

const radio = (id: SkinId, lang: Locale = 'en') =>
  screen.getByRole('radio', { name: getDictionary(lang).settings.skins[id] });

describe('SkinSwitcher', () => {
  let colorLoader: MockInstance<(typeof loaders)['raw-color']>;

  beforeEach(() => {
    resetSkinCache();
    colorLoader = vi.spyOn(loaders, 'raw-color').mockResolvedValue({ default: FakeColorSkin });
    vi.spyOn(loaders, 'brutalist').mockResolvedValue({ default: FakeBrutalistSkin });
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'startViewTransition');
  });

  it('renders the server skin (children) by default, without loading the others', () => {
    renderSwitcher();

    expect(screen.getByRole('heading', { name: 'default skin' })).toBeInTheDocument();
    expect(radio('raw-bw')).toBeChecked();
    expect(screen.getByRole('group', { name: 'Page style' })).toBeInTheDocument();
    expect(colorLoader).not.toHaveBeenCalled();
  });

  it('falls back to the default skin when a lazy one throws while rendering', async () => {
    const Broken = () => {
      throw new Error('render failed');
    };
    colorLoader.mockResolvedValue({ default: Broken });
    // React reports the caught error on the console: expected here
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { user } = renderSwitcher();

    await user.click(radio('raw-color'));

    await waitFor(() => expect(radio('raw-bw')).toBeChecked());
    expect(screen.getByRole('heading', { name: 'default skin' })).toBeInTheDocument();
    expect(screen.getByText(`Style: ${labels.skins['raw-bw']}`)).toBeInTheDocument();
  });

  it('prefetches the skin on hover', async () => {
    const { user } = renderSwitcher();

    await user.hover(radio('raw-color'));

    expect(colorLoader).toHaveBeenCalledTimes(1);
  });

  it('prefetches the skin on keyboard focus', () => {
    renderSwitcher();

    // Tab lands on the checked radio and arrows select: focus is the only way to reach it
    act(() => radio('raw-color').focus());

    expect(colorLoader).toHaveBeenCalledTimes(1);
  });

  it('prefetches the skin on touchstart', () => {
    renderSwitcher();

    // user-event has no touch API (its pointer events never fire `touchstart`)
    fireEvent.touchStart(radio('raw-color'));

    expect(colorLoader).toHaveBeenCalledTimes(1);
  });

  it('downloads each skin only once', async () => {
    const { user } = renderSwitcher();

    await user.hover(radio('raw-color'));
    act(() => radio('raw-color').focus());
    await user.click(radio('raw-color'));

    await screen.findByRole('heading', { name: 'color skin' });
    expect(colorLoader).toHaveBeenCalledTimes(1);
  });

  it('swaps to the selected skin, announces it and tracks the change', async () => {
    const { user } = renderSwitcher();

    await user.click(radio('brutalist'));

    expect(await screen.findByRole('heading', { name: /^brutalist skin/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'default skin' })).not.toBeInTheDocument();
    expect(radio('brutalist')).toBeChecked();
    expect(screen.getByText(`Style: ${labels.skins.brutalist}`)).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith('skin_change', { skin: 'brutalist' });
  });

  it('hands the lazy skin the content and UI of the page language', async () => {
    const { user } = renderSwitcher('es');

    expect(screen.getByRole('group', { name: 'Estilo de la página' })).toBeInTheDocument();
    await user.click(radio('brutalist', 'es'));

    expect(
      await screen.findByRole('heading', { name: `brutalist skin es ${getProfile('es').summary}` })
    ).toBeInTheDocument();
    expect(screen.getByText('Estilo: Brutalista')).toBeInTheDocument();
  });

  it('shows the server skin again when going back to raw-bw', async () => {
    const { user } = renderSwitcher();

    await user.click(radio('raw-color'));
    await screen.findByRole('heading', { name: 'color skin' });
    await user.click(radio('raw-bw'));

    expect(await screen.findByRole('heading', { name: 'default skin' })).toBeInTheDocument();
  });

  it('keeps the current skin when the chunk fails to load', async () => {
    colorLoader.mockRejectedValue(new Error('offline'));
    const { user } = renderSwitcher();

    await user.click(radio('raw-color'));

    await waitFor(() => expect(colorLoader).toHaveBeenCalled());
    await act(() => Promise.resolve());
    expect(screen.getByRole('heading', { name: 'default skin' })).toBeInTheDocument();
    expect(radio('raw-bw')).toBeChecked();
  });

  it('uses a View Transition when available', async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.assign(document, { startViewTransition });
    const { user } = renderSwitcher();

    await user.click(radio('raw-color'));

    await screen.findByRole('heading', { name: 'color skin' });
    expect(startViewTransition).toHaveBeenCalledTimes(1);
  });

  it('skips the View Transition with prefers-reduced-motion', async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.assign(document, { startViewTransition });
    vi.stubGlobal(
      'matchMedia',
      mockMatchMedia(() => true)
    );
    const { user } = renderSwitcher();

    await user.click(radio('raw-color'));

    await screen.findByRole('heading', { name: 'color skin' });
    expect(startViewTransition).not.toHaveBeenCalled();
  });
});
