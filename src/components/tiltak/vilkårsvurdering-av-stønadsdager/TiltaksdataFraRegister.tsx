import React, { useState } from 'react';
import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import styles from './TiltaksdataFraRegister.module.css';
import {
  AntallDagerSaksopplysninger,
  RegistrertTiltak,
} from '../../types/Søknad';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';

interface TiltaksdataFraRegisterProps {
  tiltak: RegistrertTiltak;
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

function utledAntallDagerFraRegister({
  antallDagerSaksopplysningerFraRegister,
}: AntallDagerSaksopplysninger) {
  if (
    !antallDagerSaksopplysningerFraRegister ||
    antallDagerSaksopplysningerFraRegister.length === 0
  ) {
    return 'Mangler data fra register';
  }
  const [antallDagerSaksopplysning] = antallDagerSaksopplysningerFraRegister;
  return antallDagerSaksopplysning.antallDager;
}

const TiltaksdataFraRegister = ({
  tiltak: { id: tiltakId, navn, kilde, arrangør, antallDagerSaksopplysninger },
}: TiltaksdataFraRegisterProps) => {
  const [feilmelding, setFeilmelding] = useState('');
  const mutator = useSWRConfig().mutate;

  const router = useRouter();
  const antallDager = utledAntallDagerFraRegister(antallDagerSaksopplysninger);
  const behandlingId = router.query.behandlingId as string;

  return (
    <div className={styles.tiltaksdataFraRegister__container}>
      <Heading size="small">Registerdata</Heading>
      <VStack gap="1" className={styles.tiltaksdataFraRegister__dataGrid}>
        <span>Tiltaksvariant:</span>
        <span>{navn}</span>
        <span>Arrangør:</span>
        <span>{arrangør}</span>
        <span>Antall dager per uke:</span>
        <span>{antallDager}</span>
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
