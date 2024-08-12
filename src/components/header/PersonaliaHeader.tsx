import React, { useContext } from 'react';
import { Button, Loader, Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import styles from './PersonaliaHeader.module.css';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { useTaAvBehandling } from '../../hooks/useTaAvBehandling';
import { useHentPersonopplysninger } from '../../hooks/useHentPersonopplysninger';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { finnStatusTekst } from '../../utils/tekstformateringUtils';

const PersonaliaHeader = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling } = useHentBehandling(behandlingId);
  const { personopplysninger, isPersonopplysningerLoading } =
    useHentPersonopplysninger(behandlingId);
  const { taAvBehandling, tarAvBehandling, taAvBehandlingError } =
    useTaAvBehandling(behandlingId);

  if (isPersonopplysningerLoading || !personopplysninger) {
    return <Loader />;
  }
  const {
    fornavn,
    mellomnavn,
    etternavn,
    fnr,
    skjerming,
    strengtFortrolig,
    fortrolig,
  } = personopplysninger;

  return (
    <div className={styles.personaliaHeader}>
      <PersonCircleIcon className={styles.personIcon} />
      <span data-testid="nav-personalia-header-name" className={styles.name}>
        {fornavn} {mellomnavn} {etternavn}
      </span>
      <span data-testid="nav-personalia-header-ident" className={styles.ident}>
        {fnr}
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
        loading={tarAvBehandling}
        onClick={() => taAvBehandling()}
        className={styles.behandlingTag}
      >
        Ta av behandling
      </Button>
      <Tag variant="alt3-filled" className={styles.behandlingTag}>
        {finnStatusTekst(valgtBehandling.status)}
      </Tag>
    </div>
  );
};

export default PersonaliaHeader;
