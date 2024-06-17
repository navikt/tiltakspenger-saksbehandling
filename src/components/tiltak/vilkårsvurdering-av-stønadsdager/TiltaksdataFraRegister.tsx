import React, { useState } from 'react';
import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import styles from './TiltaksdataFraRegister.module.css';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import {
  Stønadsdager,
  StønadsdagerSaksopplysning,
} from '../../../types/Behandling';

interface TiltaksdataFraRegisterProps {
  antallDagerSaksopplysning: StønadsdagerSaksopplysning;
}

async function tilbakestillAntallDager(behandlingId: string, tiltakId: string) {
  const response = await fetch(
    `/api/behandling/${behandlingId}/antalldager/${tiltakId}`,
    {
      method: 'DELETE',
    },
  );
  if (!response.ok) {
    throw new Error(
      `Noe gikk galt ved lagring av antall dager: ${response.statusText}`,
    );
  }
  return response;
}

const TiltaksdataFraRegister = ({
  antallDagerSaksopplysning: {
    tiltak,
    arrangør,
    tiltakId,
    antallDagerSaksopplysningerFraRegister: { antallDager, kilde },
  },
}: TiltaksdataFraRegisterProps) => {
  const [feilmelding, setFeilmelding] = useState('');
  const mutator = useSWRConfig().mutate;

  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;

  return (
    <div className={styles.tiltaksdataFraRegister__container}>
      <Heading size="small">Registerdata</Heading>
      <VStack gap="1" className={styles.tiltaksdataFraRegister__dataGrid}>
        <span>Tiltaksvariant:</span>
        <span>{tiltak}</span>
        <span>Arrangør:</span>
        <span>{arrangør}</span>
        <span>Antall dager per uke:</span>
        <span>{antallDager ? antallDager : 'Mangler registerdata'}</span>
        <span>Kilde:</span>
        <span>{kilde}</span>
      </VStack>
      <Button
        className={styles.tiltaksdataFraRegister__tilbakestillKnapp}
        variant="secondary"
        type="button"
        size="small"
        onClick={async () => {
          try {
            setFeilmelding('');
            await tilbakestillAntallDager(behandlingId, tiltakId);
            await mutator(`/api/behandling/${behandlingId}`);
          } catch (e: any) {
            setFeilmelding('Noe gikk galt ved tilbakestilling av antall dager');
          }
        }}
      >
        Tilbakestill til registerdata
      </Button>
      {feilmelding && <BodyShort size="small">{feilmelding}</BodyShort>}
    </div>
  );
};

export default TiltaksdataFraRegister;
