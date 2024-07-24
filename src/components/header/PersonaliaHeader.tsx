import React, { useContext } from 'react';
import { Button, Loader, Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import styles from './PersonaliaHeader.module.css';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const PersonaliaHeader = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const { fornavn, etternavn, ident, skjerming, strengtFortrolig, fortrolig } =
    valgtBehandling.personopplysninger;

  const håndterAvbrytBehandling = () => {
    fetch(`/api/behandling/avbrytbehandling/${valgtBehandling.behandlingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      router.push('/');
    });
  };

  return (
    <div className={styles.personaliaHeader}>
      <PersonCircleIcon className={styles.personIcon} />
      <span data-testid="nav-personalia-header-name" className={styles.name}>
        {fornavn} {etternavn}
      </span>
      <span data-testid="nav-personalia-header-ident" className={styles.ident}>
        {ident}
      </span>
      {strengtFortrolig && (
        <Tag variant="error" className={styles.skjermingTag}>
          Søker har strengt fortrolig adresse
        </Tag>
      )}
      {fortrolig && (
        <Tag variant="error" className={styles.skjermingTag}>
          Søker har fortrolig adresse
        </Tag>
      )}
      {skjerming && (
        <Tag variant="error" className={styles.skjermingTag}>
          Søker er skjermet
        </Tag>
      )}
      <Button
        type="submit"
        size="small"
        onClick={() => håndterAvbrytBehandling()}
        className={styles.behandlingTag}
      >
        Avbryt behandling{' '}
      </Button>
      <Tag variant="info-filled" size="medium" className={styles.behandlingTag}>
        Førstegangsbehandling
      </Tag>
      <Tag variant="alt1" className={styles.behandlingTag}>
        {valgtBehandling.status}
      </Tag>
    </div>
  );
};

export default PersonaliaHeader;
