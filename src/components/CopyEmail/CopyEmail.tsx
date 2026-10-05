'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import { type AnchorHTMLAttributes, type FC, type MouseEvent, useEffect, useState } from 'react';

import { EmailAddress } from '@/components/EmailAddress';
import type { Dictionary } from '@/i18n/dictionaries';

const FEEDBACK_MS = 2500;

interface CopyEmailProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  email: string;
  labels: Dictionary['email'];
}

/** Plain clicks only: new tab/window, download and middle clicks keep the browser default */
const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/**
 * A mailto: link that copies the address instead of opening a mail app. It stays a real
 * mailto: link without JS, without the Clipboard API or if copying fails.
 * Feedback is a visible status that screen readers announce too.
 */
const CopyEmail: FC<CopyEmailProps> = ({ email, labels, className, ...anchorProps }) => {
  const [copied, setCopied] = useState(false);
  const href = `mailto:${email}`;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), FEEDBACK_MS);

    return () => clearTimeout(timer);
  }, [copied]);

  const copy = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event) || !navigator.clipboard?.writeText) return;

    event.preventDefault();
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        sendGTMEvent({ event: 'email_copy' });
      },
      () => window.location.assign(href)
    );
  };

  return (
    <>
      <a {...anchorProps} className={className} href={href} title={labels.copy} onClick={copy}>
        <EmailAddress email={email} />
      </a>
      <span className='copy-status' role='status'>
        {copied ? labels.copied : ''}
      </span>
    </>
  );
};

export default CopyEmail;
