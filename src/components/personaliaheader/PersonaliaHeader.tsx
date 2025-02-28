import React, { PropsWithChildren } from 'react';
import { BodyShort, CopyButton, HStack, Skeleton, Spacer, Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { Personopplysninger, useHentPersonopplysninger } from './useHentPersonopplysninger';
import { SakId } from '../../types/SakTypes';

import styles from './PersonaliaHeader.module.css';
import Link from 'next/link';

type PersonaliaHeaderProps = PropsWithChildren<{
    sakId: SakId;
    saksnummer: string;
}>;

export const PersonaliaHeader = ({ sakId, saksnummer, children }: PersonaliaHeaderProps) => {
    const { personopplysninger, isPersonopplysningerLoading } = useHentPersonopplysninger(sakId);

    return (
        <HStack gap="3" align="center" className={styles.personaliaHeader}>
            <PersonCircleIcon className={styles.personIcon} />
            {!isPersonopplysningerLoading && personopplysninger ? (
                <PersonaliaInnhold
                    saksnummer={saksnummer}
                    personopplysninger={personopplysninger}
                />
            ) : (
                <Skeleton variant={'text'} className={styles.loader} />
            )}
            <Spacer />
            <b>Saksnr:</b> {saksnummer}
            <CopyButton copyText={saksnummer} variant="action" size="small" />
            {children}
        </HStack>
    );
};

type PersonaliaInnholdProps = {
    saksnummer: string;
    personopplysninger: Personopplysninger;
};

const PersonaliaInnhold = ({ saksnummer, personopplysninger }: PersonaliaInnholdProps) => {
    const { fornavn, mellomnavn, etternavn, fnr, skjerming, strengtFortrolig, fortrolig } =
        personopplysninger || {};

    return (
        <>
            <Link href={`/sak/${saksnummer}`}>
                <BodyShort>
                    {fornavn} {mellomnavn} {etternavn}
                </BodyShort>
            </Link>
            <BodyShort>{fnr}</BodyShort>
            <CopyButton copyText={fnr} variant="action" size="small" />
            {strengtFortrolig && <Tag variant="error">Søker har strengt fortrolig adresse</Tag>}
            {fortrolig && <Tag variant="error">Søker har fortrolig adresse</Tag>}
            {skjerming && <Tag variant="error">Søker er skjermet</Tag>}
        </>
    );
};
