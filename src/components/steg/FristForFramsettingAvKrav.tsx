import React from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import styles from './Steg.module.css';
import StegHeader from './StegHeader';
import VilkårsvurderingerAvFristForFramsettingAvKrav from '../kravfrist/VilkårsvurderingerAvFristForFramsettingAvKrav';
import KravdatoSaksopplysninger from '../kravfrist/KravdatoSaksopplysninger';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';

const FristForFramsettingAvKrav = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const saksopplysning = valgtBehandling.kravdatoSaksopplysninger;

  if (!saksopplysning) return <Loader />;

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Frist for framsetting av krav'}
        lovdatatekst={saksopplysning.lovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={saksopplysning.lovreferanse.paragraf}
      />
      <UtfallstekstMedIkon samletUtfall={saksopplysning.samletUtfall} />
      <div className={styles.container}>
        <VilkårsvurderingerAvFristForFramsettingAvKrav
          vurderinger={saksopplysning.vurderinger}
          kravdatoSaksopplysning={
            saksopplysning.kravdatoFraSaksbehandler
              ? saksopplysning.kravdatoFraSaksbehandler
              : saksopplysning.opprinneligKravdato
          }
        />
        <div className={styles.verticalLine}></div>
        <KravdatoSaksopplysninger
          kravdatoSaksopplysning={saksopplysning.opprinneligKravdato}
          visTilbakestillKnapp={!!saksopplysning.kravdatoFraSaksbehandler}
        />
      </div>
    </VStack>
  );
};

export default FristForFramsettingAvKrav;
