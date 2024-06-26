import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';

const Institusjonsopphold = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const saksopplysning =
    valgtBehandling.ytelsessaksopplysninger.saksopplysninger.find(
      (saksopplysning) =>
        saksopplysning.saksopplysningTittel == 'Institusjonsopphold',
    );

  if (!saksopplysning) return <Loader />;

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
      <UtfallstekstMedIkon utfall={saksopplysning.utfall} />
      <StegKort
        editerbar={false}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={saksopplysning.periode}
        kilde={saksopplysning.kilde}
        utfall={saksopplysning.utfall}
        vilkår={valgtBehandling.ytelsessaksopplysninger.vilkår}
        vilkårTittel={'Institusjonsopphold'}
        grunnlag={saksopplysning.utfall === 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Oppholder seg på institusjon'}
      />
    </VStack>
  );
};

export default Institusjonsopphold;
