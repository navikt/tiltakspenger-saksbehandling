import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
    BodyShort,
    Button,
    CopyButton,
    HStack,
    Link,
    Skeleton,
    Spacer,
    Tag,
} from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { Personopplysninger, useHentPersonopplysninger } from './useHentPersonopplysninger';
import { SakId } from '~/types/Sak';
import NextLink from 'next/link';

import styles from './PersonaliaHeader.module.css';

type PersonaliaHeaderProps = PropsWithChildren<{
    sakId: SakId;
    saksnummer: string;
    visTilbakeKnapp?: boolean;
}>;

export const PersonaliaHeader = ({
    sakId,
    saksnummer,
    visTilbakeKnapp,
    children,
}: PersonaliaHeaderProps) => {
    const { personopplysninger, isPersonopplysningerLoading } = useHentPersonopplysninger(sakId);

    const [visSakId, setVisSakId] = useState(false);

    const idSomVises = visSakId ? sakId : saksnummer;

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            setVisSakId(e.ctrlKey || e.metaKey);
        };

        window.addEventListener('keyup', listener);
        window.addEventListener('keydown', listener);
        return () => {
            window.removeEventListener('keyup', listener);
            window.removeEventListener('keydown', listener);
        };
    }, []);

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
            <strong>{visSakId ? 'Sak-id:' : 'Saksnr:'}</strong> {idSomVises}
            <CopyButton copyText={idSomVises} variant="action" size="small" />
            {visTilbakeKnapp && (
                <Button as={NextLink} href={`/sak/${saksnummer}`} type="submit" size="small">
                    Tilbake til personoversikt
                </Button>
            )}
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
            <Link as={NextLink} href={`/sak/${saksnummer}`}>
                {fornavn} {mellomnavn} {etternavn}
            </Link>
            <BodyShort>{fnr}</BodyShort>
            <CopyButton copyText={fnr} variant="action" size="small" />
            {strengtFortrolig && <Tag variant="error">Søker har strengt fortrolig adresse</Tag>}
            {fortrolig && <Tag variant="error">Søker har fortrolig adresse</Tag>}
            {skjerming && <Tag variant="error">Søker er skjermet</Tag>}
        </>
    );
};
