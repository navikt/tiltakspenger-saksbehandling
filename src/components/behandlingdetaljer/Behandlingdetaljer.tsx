import { VStack, BodyShort } from '@navikt/ds-react';
import styles from './Behandlingdetaljer.module.css';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import {
  formaterDatotekst,
  periodeTilFormatertDatotekst,
} from '../../utils/date';

const Behandlingdetaljer = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling } = useHentBehandling(behandlingId);

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
