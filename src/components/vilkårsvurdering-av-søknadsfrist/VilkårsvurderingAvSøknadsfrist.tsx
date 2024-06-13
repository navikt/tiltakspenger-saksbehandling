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
  søknadstidspunktFraSaksbehandler: Date;
  vurderinger: Vurdering[];
  samletUtfall: Utfall;
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
    // TODO: Finne ut av statehåndtering, siden 'vurderinger' er en Array (useMemo trigges ikke hvis kun innholdet endres)
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
            // TODO: Finne ut av om kilden bør sendes fra backend, eller om det i dette tilfellet er greit å hardkode i front
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
