import { PropsWithChildren, useEffect, useState } from 'react';
import { BodyShort, CopyButton, HStack, Skeleton, Spacer, Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import { Personopplysninger, useHentPersonopplysninger } from './useHentPersonopplysninger';
import { SakId } from '~/lib/sak/SakTyper';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { personoversiktUrl } from '~/utils/urls';

import styles from './PersonaliaHeader.module.css';

type PersonaliaHeaderProps = PropsWithChildren<{
    sakId: SakId;
    saksnummer: string;
    aktivTab?: PersonoversiktTab;
    visTilbakeKnapp?: boolean;
}>;

export const PersonaliaHeader = ({
    sakId,
    saksnummer,
    visTilbakeKnapp,
    aktivTab = PersonoversiktTab.ÅpneBehandlinger,
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
        <HStack gap="space-12" align="center" className={styles.personaliaHeader}>
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
            <CopyButton copyText={idSomVises} data-color={'accent'} size={'small'} />
            {visTilbakeKnapp && (
                <InternLenkeKnapp
                    variant={'primary'}
                    href={personoversiktUrl(saksnummer, aktivTab)}
                >
                    Tilbake til personoversikt
                </InternLenkeKnapp>
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
    const {
        fornavn,
        mellomnavn,
        etternavn,
        fnr,
        skjermet,
        strengtFortrolig,
        strengtFortroligUtland,
        fortrolig,
    } = personopplysninger || {};

    return (
        <>
            <InternLenke href={personoversiktUrl(saksnummer)}>
                {fornavn} {mellomnavn} {etternavn}
            </InternLenke>
            <BodyShort>{fnr}</BodyShort>
            <CopyButton copyText={fnr} data-color={'accent'} size={'small'} />
            {(strengtFortrolig || strengtFortroligUtland) && (
                <Tag data-color="danger" variant="outline">
                    Søker har strengt fortrolig adresse
                </Tag>
            )}
            {fortrolig && (
                <Tag data-color="danger" variant="outline">
                    Søker har fortrolig adresse
                </Tag>
            )}
            {skjermet && (
                <Tag data-color="danger" variant="outline">
                    Søker er skjermet
                </Tag>
            )}
        </>
    );
};
