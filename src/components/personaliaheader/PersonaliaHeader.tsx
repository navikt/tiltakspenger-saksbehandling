import React, { PropsWithChildren, useContext } from 'react';
import { BodyShort, HStack, Loader, Spacer, Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import styles from './PersonaliaHeader.module.css';
import { useHentPersonopplysninger } from '../../hooks/useHentPersonopplysninger';

type PersonaliaHeaderProps = PropsWithChildren & {
  sakId: string;
};

const PersonaliaHeader = ({ sakId, children }: PersonaliaHeaderProps) => {
  const { personopplysninger, isPersonopplysningerLoading } =
    useHentPersonopplysninger(sakId);

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
    <HStack gap="3" align="center" className={styles.personaliaHeader}>
      <PersonCircleIcon className={styles.personIcon} />
      <BodyShort>
        {fornavn} {mellomnavn} {etternavn}
      </BodyShort>
      <BodyShort>{fnr}</BodyShort>
      {strengtFortrolig && (
        <Tag variant="error">Søker har strengt fortrolig adresse</Tag>
      )}
      {fortrolig && <Tag variant="error">Søker har fortrolig adresse</Tag>}
      {skjerming && <Tag variant="error">Søker er skjermet</Tag>}
      <Spacer />
      {children}
    </HStack>
  );
};

export default PersonaliaHeader;
