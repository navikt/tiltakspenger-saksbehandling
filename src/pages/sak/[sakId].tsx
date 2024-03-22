import React from 'react';
import { NextPage } from 'next';
import {
  pageWithAuthentication,
  redirectToLogin,
} from '../../utils/pageWithAuthentication';
import { Button } from '@navikt/ds-react';
import { getOnBehalfOfToken } from '../../utils/auth';
import { Sak } from '../../types/Behandling';

interface SakProps {
  saksnummer: string;
  ident: string;
}

const SakPage: NextPage<SakProps> = ({ saksnummer, ident }: SakProps) => {
  return (
    <div>
      <div> Saksnummer: {saksnummer}</div>
      <div> Fødselsnummer: {ident}</div>
      <Button>Revurder</Button>
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
