import { FC } from 'react';

import { PREFIX_PATH, PRIVATE_ENDPOINT } from '@/config/environments';

interface Props {
  title: string;
}

const Title: FC<Props> = ({ title }) => {
  console.log('Priv:', PRIVATE_ENDPOINT, 'Public:', PREFIX_PATH);
  return <h1>{title}</h1>;
};

export default Title;
