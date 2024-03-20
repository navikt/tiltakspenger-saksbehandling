import React from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { Button } from '@navikt/ds-react';

interface SakProps {
  saksnummer: string;
  fødselsnummer: string;
}

const SakPage: NextPage<SakProps> = ({
  saksnummer,
  fødselsnummer,
}: SakProps) => {
  return (
    <div>
      <div> Saksnummer: {saksnummer}</div>
      <div> Fødselsnummer: {fødselsnummer}</div>
      <Button>Revurder</Button>
    </div>
  );
};

export default SakPage;

export const getServerSideProps = pageWithAuthentication(async () => {
  return {
    props: {
      saksnummer: 'foo',
      fødselsnummer: 'bar',
    },
  };
});
