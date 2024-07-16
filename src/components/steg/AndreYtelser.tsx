import { Loader, VStack } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';

export const AndreYtelser = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const andreYtelser = valgtBehandling.ytelsessaksopplysninger;

  if (!andreYtelser) return <Loader />;
  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Forholdet til andre ytelser'}
        lovdatatekst={andreYtelser.vilkårLovreferanse.beskrivelse}
        paragraf={andreYtelser.vilkårLovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <UtfallstekstMedIkon samletUtfall={andreYtelser.samletUtfall} />
      <SaksopplysningTabell
        saksopplysninger={andreYtelser.saksopplysninger.filter(
          (saksopplysning) =>
            saksopplysning.saksopplysningTittel !=
              'Kvalifiseringsprogrammet(KVP)' &&
            saksopplysning.saksopplysningTittel != 'Introduksjonsprogrammet' &&
            saksopplysning.saksopplysningTittel != 'Institusjonsopphold',
        )}
        behandlingId={valgtBehandling.behandlingId}
        vurderingsperiode={valgtBehandling.vurderingsperiode}
      />
    </VStack>
  );
};
