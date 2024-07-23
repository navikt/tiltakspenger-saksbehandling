import React from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegKort from './VilkårKort';
import { useSWRConfig } from 'swr';
import StegHeader from './VilkårHeader';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';

const VilkårsvurderingAvStønadsdager = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const mutator = useSWRConfig().mutate;

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const stønadsDager = valgtBehandling.stønadsdager;

  const håndterEndreAntallDager = (data: SkjemaFelter, tiltakId: string) => {
    const antallDager = {
      periode: {
        fraOgMed: data.periode.fraOgMed,
        tilOgMed: data.periode.tilOgMed,
      },
      antallDager: data.valgtVerdi,
    };

    fetch(`/api/behandling/${behandlingId}/antalldager/${tiltakId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(antallDager),
    })
      .then(() => {
        mutator(`/api/behandling/${behandlingId}`);
      })
      .catch((error) => {
        throw new Error(
          `Noe gikk galt ved lagring av antall dager: ${error.message}`,
        );
      });
  };

  return (
    <VStack gap="4">
      <StegHeader
        headertekst="Stønadsdager"
        lovdatatekst="Stønadsdager"
        paragraf="§6-1"
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      {stønadsDager.map((stønadsdagerSaksopplysning) => (
        <StegKort
          key={stønadsdagerSaksopplysning.tiltakId}
          håndterLagreSaksopplysning={(data) =>
            håndterEndreAntallDager(data, stønadsdagerSaksopplysning.tiltakId)
          }
          editerbar={false}
          vurderingsperiode={valgtBehandling.vurderingsperiode}
          saksopplysningsperiode={
            stønadsdagerSaksopplysning.antallDagerSaksopplysningerFraRegister
              .periode
          }
          kilde={
            stønadsdagerSaksopplysning.antallDagerSaksopplysningerFraRegister
              .kilde
          }
          utfall={null}
          vilkårTittel={'Stønadsdager'}
          grunnlag={stønadsdagerSaksopplysning.antallDagerSaksopplysningerFraRegister.antallDager.toString()}
          grunnlagHeader={'Antall dager'}
        />
      ))}
    </VStack>
  );
};

export default VilkårsvurderingAvStønadsdager;
