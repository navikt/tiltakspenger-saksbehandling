import React from 'react';
import { VStack } from '@navikt/ds-react';
import { Utfall } from '../../types/Utfall';
import VilkårsvurderingAvSøknadsfristHeading from './VilkårsvurderingAvSøknadsfristHeading';
import SøknadsfristVilkårsvurderinger from './SøknadsfristVilkårsvurderinger';
import SøknadsfristSaksopplysninger from './SøknadsfristSaksopplysninger';
import { Vurdering } from '../../types/Vurdering';
import UtfallstekstMedIkon from '../utfallstekst-med-ikon/UtfallstekstMedIkon';
import styles from './VilkårsvurderingAvSøknadsfrist.module.css';

interface SøknadsfristData {
  opprinneligSøknadstidspunkt: Date;
  søknadstidspunktFraSaksbehandler: Date | null;
  vurderinger: Vurdering[];
}

function inneholderOppfyltePerioder(vurderinger: Vurdering[]) {
  return vurderinger.some(({ utfall }) => utfall === Utfall.OPPFYLT);
}

const VilkårsvurderingAvSøknadsfrist = ({
  opprinneligSøknadstidspunkt,
  søknadstidspunktFraSaksbehandler,
  vurderinger,
}: SøknadsfristData) => {
  const samletUtfall = React.useMemo(() => {
    if (inneholderOppfyltePerioder(vurderinger)) {
      return Utfall.OPPFYLT;
    } else {
      return Utfall.IKKE_OPPFYLT;
    }
  }, vurderinger);
  return (
    <VStack gap="4">
      <VilkårsvurderingAvSøknadsfristHeading />
      <UtfallstekstMedIkon utfall={samletUtfall} />
      <div className={styles.vilkårsvurderingAvSøknadsfrist}>
        <SøknadsfristVilkårsvurderinger
          vurderinger={vurderinger}
          kravdato={
            søknadstidspunktFraSaksbehandler || opprinneligSøknadstidspunkt
          }
          kravdatoKilde={
            søknadstidspunktFraSaksbehandler ? 'Saksbehandler' : 'Søknad'
          }
        />
        <div className={styles.verticalLine}></div>
        <SøknadsfristSaksopplysninger
          opprinneligSøknadstidspunkt={opprinneligSøknadstidspunkt}
          visTilbakestillKnapp={!!søknadstidspunktFraSaksbehandler}
        />
      </div>
    </VStack>
  );
};

export default VilkårsvurderingAvSøknadsfrist;
