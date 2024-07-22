import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './VilkårHeader';
import StegKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentInstitusjonsopphold } from '../../hooks/vilkår/useHentInstitusjonsopphold';

const Institusjonsopphold = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { institusjonsopphold, isLoading } =
    useHentInstitusjonsopphold(behandlingId);

  if (isLoading || !institusjonsopphold) {
    return <Loader />;
  }

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
      <UtfallstekstMedIkon samletUtfall={institusjonsopphold.samletUtfall} />
      <StegKort
        håndterLagreSaksopplysning={() => console.log()}
        editerbar={false}
        vurderingsperiode={institusjonsopphold.vurderingsperiode}
        saksopplysningsperiode={
          institusjonsopphold.søknadSaksopplysning.periodeMedOpphold.periode
        }
        kilde={institusjonsopphold.søknadSaksopplysning.kilde}
        utfall={institusjonsopphold.samletUtfall}
        vilkårTittel={'Institusjonsopphold'}
        grunnlag={institusjonsopphold.samletUtfall === 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Oppholder seg på institusjon'}
      />
    </VStack>
  );
};

export default Institusjonsopphold;
