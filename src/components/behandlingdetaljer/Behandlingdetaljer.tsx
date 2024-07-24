import { VStack, BodyShort, Loader } from '@navikt/ds-react';
import styles from './Behandlingdetaljer.module.css';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import {
  formaterDatotekst,
  periodeTilFormatertDatotekst,
} from '../../utils/date';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const Behandlingdetaljer = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  return (
    <>
      <VStack gap="3" className={styles.wrapper}>
        <BodyShort>
          <b>Søknadsdato</b>
        </BodyShort>
        <BodyShort>
          {formaterDatotekst(
            valgtBehandling.kravdatoSaksopplysninger.opprinneligKravdato
              .kravdato,
          )}
        </BodyShort>
        <BodyShort>
          <b>Vurderingsperiode: </b>
        </BodyShort>
        <BodyShort>
          {periodeTilFormatertDatotekst(valgtBehandling.vurderingsperiode)}
        </BodyShort>
        <BodyShort>
          <b>Tiltak</b>
        </BodyShort>
        <BodyShort>
          {
            valgtBehandling.tiltaksdeltagelsesaksopplysninger
              .saksopplysninger[0].navn
          }
        </BodyShort>
        <BodyShort>
          <b>Vurdert av</b>
        </BodyShort>
        <BodyShort>{valgtBehandling.saksbehandler}</BodyShort>
      </VStack>
    </>
  );
};

export default Behandlingdetaljer;
