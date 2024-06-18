import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import { formatDateObject } from '../../utils/date';
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
    <>
      <StegHeader
        headertekst={saksopplysning.vilkårTittel}
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
        grunnlag={formatDateObject(saksopplysning.grunnlag)}
        grunnlagHeader={'Fødselsdato'}
      />
    </>
  );
};

export default Alder;
