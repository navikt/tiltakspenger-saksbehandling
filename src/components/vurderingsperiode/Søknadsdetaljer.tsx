import { VStack, BodyShort, Loader } from '@navikt/ds-react';
import styles from '../behandlingdetaljer/Behandlingdetaljer.module.css';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import { useHentKravfrist } from '../../hooks/vilkår/useHentKravfrist';

const Søknadsdetaljer = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { kravfristVilkår } = useHentKravfrist(behandlingId);

  if (isLoading || !valgtBehandling || !kravfristVilkår) {
    return <Loader />;
  }

  const { vurderingsperiode, vilkårssett, saksbehandler } = valgtBehandling;
  const andreYtelser =
    vilkårssett.livsoppholdVilkår.avklartSaksopplysning ?? false;

  return (
    <>
      <VStack gap="3" className={styles.wrapper}>
        <BodyShort>
          <b>Søknadsperiode: </b>
        </BodyShort>
        <BodyShort>{periodeTilFormatertDatotekst(vurderingsperiode)}</BodyShort>
        <BodyShort>
          <b>Tiltak</b>
        </BodyShort>
        <BodyShort>
          {vilkårssett.tiltakDeltagelseVilkår.registerSaksopplysning.tiltakNavn}
        </BodyShort>
        <BodyShort>
          <b>Andre ytelser</b>
        </BodyShort>
        <BodyShort>{andreYtelser ? 'Ja' : 'Nei'}</BodyShort>
        <BodyShort>
          <b>Vurdert av</b>
        </BodyShort>
        <BodyShort>{saksbehandler}</BodyShort>
      </VStack>
    </>
  );
};

export default Søknadsdetaljer;
