import { Loader, VStack } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { SaksbehandlerContext } from '../../pages/_app';
import { avklarLesevisning } from '../../utils/avklarLesevisning';
import StegHeader from './StegHeader';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';

export const AndreYtelser = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const andreYtelser = valgtBehandling.ytelsessaksopplysninger;

  const girInnvilget = valgtBehandling.samletUtfall === 'OPPFYLT';

  const lesevisning = avklarLesevisning(
    innloggetSaksbehandler!!,
    valgtBehandling.saksbehandler,
    valgtBehandling.beslutter,
    valgtBehandling.behandlingsteg,
    girInnvilget,
  );

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
        lesevisning={lesevisning}
      />
    </VStack>
  );
};
