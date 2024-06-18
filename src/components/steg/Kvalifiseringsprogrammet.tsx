import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';

const Kvalifiseringsprogrammet = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const KVP = valgtBehandling.ytelsessaksopplysninger.saksopplysninger.find(
    (saksopplysning) =>
      saksopplysning.saksopplysningTittel == 'Kvalifiseringsprogrammet(KVP)',
  );
  if (!KVP) return <Loader />;
  return (
    <>
      <StegHeader
        headertekst={KVP.saksopplysningTittel}
        lovdatatekst={
          valgtBehandling.ytelsessaksopplysninger.vilkårLovreferanse.beskrivelse
        }
        paragraf={
          valgtBehandling.ytelsessaksopplysninger.vilkårLovreferanse.paragraf
        }
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <UtfallstekstMedIkon utfall={KVP.utfall} />
      <StegKort
        editerbar={true}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
        saksopplysningsperiode={valgtBehandling.vurderingsperiode}
        kilde={KVP.kilde}
        utfall={KVP.utfall}
        vilkår={KVP.saksopplysning}
        vilkårTittel={KVP.saksopplysningTittel}
        grunnlag={KVP.utfall == 'OPPFYLT' ? 'Nei' : 'Ja'}
        grunnlagHeader={'Deltar'}
      />
    </>
  );
};

export default Kvalifiseringsprogrammet;
