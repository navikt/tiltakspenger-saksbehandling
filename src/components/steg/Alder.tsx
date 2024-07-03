import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import { dateTilFormatertTekst } from '../../utils/date';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { SkjemaFelter } from './OppdaterSaksopplysningForm';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const saksopplysning = valgtBehandling.alderssaksopplysning;

  const håndterLagreSaksopplysning = (data: SkjemaFelter) => {
    console.log('alder');
  };

  if (!saksopplysning) return <Loader />;

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Alder'}
        lovdatatekst={'Tiltakspenger og barnetillegg'}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={'§3'}
      />
      <UtfallstekstMedIkon samletUtfall={saksopplysning.utfall} />
      <StegKort
        editerbar={false}
        håndterLagreSaksopplysning={(data: SkjemaFelter) =>
          håndterLagreSaksopplysning(data)
        }
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={saksopplysning.periode}
        kilde={saksopplysning.kilde}
        utfall={saksopplysning.utfall}
        vilkårTittel={saksopplysning.vilkårTittel}
        grunnlag={dateTilFormatertTekst(saksopplysning.grunnlag)}
        grunnlagHeader={'Fødselsdato'}
      />
    </VStack>
  );
};

export default Alder;
