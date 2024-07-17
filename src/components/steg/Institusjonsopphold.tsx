import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { nyPeriodeTilPeriode } from '../../utils/date';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';
import { useSWRConfig } from 'swr';
import { useHentInstitusjonsopphold } from '../../hooks/useHentInstitusjonsopphold';

const Institusjonsopphold = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { institusjonsopphold, isLoading } =
    useHentInstitusjonsopphold(behandlingId);
  const mutator = useSWRConfig().mutate;

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
        håndterLagreSaksopplysning={
          (data: SkjemaFelter) => () => {} /*TODO når vi skal lagre*/
        }
        editerbar={false}
        vurderingsperiode={nyPeriodeTilPeriode(
          institusjonsopphold.vurderingsperiode,
        )}
        saksopplysningsperiode={nyPeriodeTilPeriode(
          institusjonsopphold.søknadSaksopplysning.periodeMedOpphold.periode,
        )}
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
