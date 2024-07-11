import React from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../auth/pageWithAuthentication';
import { Button, Heading } from '@navikt/ds-react';
import { Sak } from '../../types/Behandling';
import styles from './Sak.module.css';

interface SakProps {
  saksnummer: string;
  ident: string;
}

const SakPage: NextPage<SakProps> = ({ saksnummer, ident }: SakProps) => {
  async function opprettRevurdering() {
    const response = await fetch(
      `/api/behandling/opprettrevurdering/${saksnummer}`,
      { method: 'POST' },
    );
    await response.json();
  }

  return (
    <div className={styles.saksside}>
      <div className={styles.saksinfo}>
        <Heading size="medium">Saksnummer: {saksnummer}</Heading>
        <Heading size="small">Fødselsnummer: {ident}</Heading>
      </div>
      <div>
        <Button className={styles.revurderknapp} onClick={opprettRevurdering}>
          Revurder
        </Button>
      </div>
    </div>
  );
};

export default SakPage;

export const getServerSideProps = pageWithAuthentication(async (context) => {
  const sakResponse: Response = await fetch(
    `api/sak/${context.params!.sakId}`,
    {
      method: 'GET',
    },
  );
  const sak: Sak = await sakResponse.json();

  return {
    props: {
      ...sak,
    },
  };
});
