import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './VilkårHeader';
import StegKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { Utfall } from '../../types/Utfall';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

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
      <UtfallstekstMedIkon samletUtfall={Utfall.KREVER_MANUELL_VURDERING} />
      <StegKort
        editerbar={false}
        håndterLagreSaksopplysning={() => console.log()}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={valgtBehandling.vurderingsperiode}
        kilde={'PDL'}
        utfall={'Krever manuell'}
        vilkårTittel={'Alder'}
        grunnlag={'dd.mm.yyyy'}
        grunnlagHeader={'Fødselsdato'}
      />
    </VStack>
  );
};

export default Alder;
