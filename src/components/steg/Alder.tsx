import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import { dateTilFormatertTekst } from '../../utils/date';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const saksopplysning = valgtBehandling.alderssaksopplysning;

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
      <UtfallstekstMedIkon utfall={saksopplysning.utfall} />
      <StegKort
        editerbar={false}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={saksopplysning.periode}
        kilde={saksopplysning.kilde}
        utfall={saksopplysning.utfall}
        vilkår={saksopplysning.vilkår}
        vilkårTittel={saksopplysning.vilkårTittel}
        grunnlag={dateTilFormatertTekst(saksopplysning.grunnlag)}
        grunnlagHeader={'Fødselsdato'}
      />
    </VStack>
  );
};

export default Alder;
