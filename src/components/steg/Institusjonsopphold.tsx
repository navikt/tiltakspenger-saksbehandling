import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { dateTilISOTekst } from '../../utils/date';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';
import { useSWRConfig } from 'swr';

const Institusjonsopphold = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const mutator = useSWRConfig().mutate;

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const saksopplysning =
    valgtBehandling.ytelsessaksopplysninger.saksopplysninger.find(
      (saksopplysning) =>
        saksopplysning.saksopplysningTittel == 'Institusjonsopphold',
    );

  if (!saksopplysning) return <Loader />;

  const håndterLagreSaksopplysning = (data: SkjemaFelter) => {
    console.log(data);
    fetch(`/api/behandling/${behandlingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fra: data.valgtVerdi
          ? dateTilISOTekst(data.periode.fra)
          : valgtBehandling.vurderingsperiode.fra,
        til: data.valgtVerdi
          ? dateTilISOTekst(data.periode.til)
          : valgtBehandling.vurderingsperiode.til,
        vilkår: saksopplysning.saksopplysning,
        begrunnelse: data.begrunnelse,
        harYtelse: data.valgtVerdi,
      }),
    }).then(() => {
      mutator(`/api/behandling/${behandlingId}`);
    });
  };

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Institusjonsopphold'}
        lovdatatekst="Opphold i institusjon, fengsel mv."
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={'§9'}
      />
      <UtfallstekstMedIkon samletUtfall={saksopplysning.utfall} />
      <StegKort
        håndterLagreSaksopplysning={(data: SkjemaFelter) =>
          håndterLagreSaksopplysning(data)
        }
        editerbar={true}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={saksopplysning.periode}
        kilde={saksopplysning.kilde}
        utfall={saksopplysning.utfall}
        vilkårTittel={'Institusjonsopphold'}
        grunnlag={saksopplysning.utfall === 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Oppholder seg på institusjon'}
      />
    </VStack>
  );
};

export default Institusjonsopphold;
