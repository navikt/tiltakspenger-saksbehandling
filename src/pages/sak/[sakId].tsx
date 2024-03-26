import React from 'react';
import { NextPage } from 'next';
import {
  pageWithAuthentication,
  redirectToLogin,
} from '../../utils/pageWithAuthentication';
import { Button, Heading } from '@navikt/ds-react';
import { getOnBehalfOfToken } from '../../utils/auth';
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
  const backendUrl = process.env.TILTAKSPENGER_VEDTAK_URL;
  const scope = process.env.SCOPE;

  let token = null;
  try {
    token = await getOnBehalfOfToken(
      context.req.headers.authorization!!.replace('Bearer ', ''),
      scope!!,
    );
  } catch (error) {
    console.error(`Bruker har ikke tilgang: ${(error as Error).message}`);
    return redirectToLogin(context);
  }

  const sakResponse: Response = await fetch(
    `${backendUrl}/sak/${context.params!.sakId}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    },
  );
  const sak: Sak = await sakResponse.json();

  return {
    props: {
      ...sak,
    },
  };
});
