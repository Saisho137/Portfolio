'use client';

import { Component, type ReactNode } from 'react';

interface SkinErrorBoundaryProps {
  children: ReactNode;
  /** The server-rendered default skin */
  fallback: ReactNode;
  /** Lets the switcher go back to the default skin */
  onError: () => void;
}

/**
 * A lazy skin that throws while rendering must not take the whole page down (there is
 * no error.tsx above it): the visitor gets the default skin back instead.
 * React still has no hook for this: error boundaries are class components.
 */
export class SkinErrorBoundary extends Component<SkinErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
