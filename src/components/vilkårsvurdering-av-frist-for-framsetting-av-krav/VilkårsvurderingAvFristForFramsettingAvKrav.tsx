import React from 'react';
import { VStack } from '@navikt/ds-react';
import { Utfall } from '../../types/Utfall';
import VilkårsvurderingAvFristForFramsettingAvKravHeading from './VilkårsvurderingAvFristForFramsettingAvKravHeading';
import VilkårsvurderingerAvFristForFramsettingAvKrav from './VilkårsvurderingerAvFristForFramsettingAvKrav';
import KravdatoSaksopplysninger from './KravdatoSaksopplysninger';
import { Vurdering } from '../../types/Vurdering';
import UtfallstekstMedIkon from '../utfallstekst-med-ikon/UtfallstekstMedIkon';
import { KravdatoSaksopplysning } from '../../types/Behandling';
import styles from './VilkårsvurderingAvFristForFramsettingAvKrav.module.css';

interface VilkårsvurderingAvFristForFramsettingAvKravProps {
  opprinneligKravdato: KravdatoSaksopplysning;
  kravdatoFraSaksbehandler: KravdatoSaksopplysning | null;
  vurderinger: Vurdering[];
}

function inneholderOppfyltePerioder(vurderinger: Vurdering[]) {
  return vurderinger.some(({ utfall }) => utfall === Utfall.OPPFYLT);
}

const VilkårsvurderingAvFristForFramsettingAvKrav = ({
  opprinneligKravdato,
  kravdatoFraSaksbehandler,
  vurderinger,
}: VilkårsvurderingAvFristForFramsettingAvKravProps) => {
  const samletUtfall = React.useMemo(() => {
    if (inneholderOppfyltePerioder(vurderinger)) {
      return Utfall.OPPFYLT;
    } else {
      return Utfall.IKKE_OPPFYLT;
    }
  }, vurderinger);

  const gjeldendeKravdato = React.useMemo(
    () => kravdatoFraSaksbehandler || opprinneligKravdato,
    [kravdatoFraSaksbehandler],
  );

  return (
    <VStack gap="4">
      <VilkårsvurderingAvFristForFramsettingAvKravHeading />
      <UtfallstekstMedIkon utfall={samletUtfall} />
      <div className={styles.container}>
        <VilkårsvurderingerAvFristForFramsettingAvKrav
          vurderinger={vurderinger}
          kravdatoSaksopplysning={gjeldendeKravdato}
        />
        <div className={styles.verticalLine}></div>
        <KravdatoSaksopplysninger
          kravdatoSaksopplysning={opprinneligKravdato}
          visTilbakestillKnapp={!!kravdatoFraSaksbehandler}
        />
      </div>
    </VStack>
  );
};

export default VilkårsvurderingAvFristForFramsettingAvKrav;
