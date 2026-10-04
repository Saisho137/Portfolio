import { FC } from 'react';

/**
 * Email shown in display type: if it has to wrap, it breaks right after the `@`
 * instead of in the middle of the domain. <wbr> adds no text, so it reads as one word.
 */
const EmailAddress: FC<{ email: string }> = ({ email }) => {
  const at = email.lastIndexOf('@');
  if (at === -1) return email;

  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  );
};

export default EmailAddress;
