import React, { PropsWithChildren } from 'react';
import { BodyShort, CopyButton, HStack, Loader, Spacer, Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import styles from './PersonaliaHeader.module.css';
import { useHentPersonopplysninger } from '../../hooks/useHentPersonopplysninger';
import { SakId } from '../../types/SakTypes';

type PersonaliaHeaderProps = PropsWithChildren & {
    sakId: SakId;
    saksnummer: string;
};

const PersonaliaHeader = ({ sakId, saksnummer, children }: PersonaliaHeaderProps) => {
    const { personopplysninger, isPersonopplysningerLoading } = useHentPersonopplysninger(sakId);

    if (isPersonopplysningerLoading || !personopplysninger) {
        return <Loader />;
    }

    const { fornavn, mellomnavn, etternavn, fnr, skjerming, strengtFortrolig, fortrolig } =
        personopplysninger;

    return (
        <HStack gap="3" align="center" className={styles.personaliaHeader}>
            <PersonCircleIcon className={styles.personIcon} />
            <BodyShort>
                {fornavn} {mellomnavn} {etternavn}
            </BodyShort>
            <BodyShort>{fnr}</BodyShort>
            <CopyButton copyText={fnr} variant="action" size="small" />
            {strengtFortrolig && <Tag variant="error">Søker har strengt fortrolig adresse</Tag>}
            {fortrolig && <Tag variant="error">Søker har fortrolig adresse</Tag>}
            {skjerming && <Tag variant="error">Søker er skjermet</Tag>}
            <Spacer />
            <b>Saksnr:</b> {saksnummer}
            <CopyButton copyText={saksnummer} variant="action" size="small" />
            {children}
        </HStack>
    );
};

export default PersonaliaHeader;
