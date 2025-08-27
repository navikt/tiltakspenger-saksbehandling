import { BodyShort, Heading, Tag, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    meldekortHeading,
    periodeTilFormatertDatotekst,
} from '../../../utils/date';
import { MeldekortBehandlingOpprett } from './opprett-behandling/MeldekortBehandlingOpprett';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
    MeldekortBehandlingType,
} from '../../../types/meldekort/MeldekortBehandling';
import { useSak } from '../../../context/sak/SakContext';
import { useFeatureToggles } from '../../../context/feature-toggles/FeatureTogglesContext';
import { ArrayOrSingle } from '../../../types/UtilTypes';
import { forceArray } from '../../../utils/array';
import { useMeldeperiodeKjede } from '../MeldeperiodeKjedeContext';
import OppsummeringAvAttesteringer from '../../attestering/OppsummeringAvAttestering';
import { finnMeldeperiodeKjedeStatusTekst } from '../../../utils/tekstformateringUtils';
import { MeldeperiodeKjedeStatus } from '../../../types/meldekort/Meldeperiode';
import React, { ComponentProps } from 'react';
import {
    CheckmarkIcon,
    CircleSlashIcon,
    HourglassTopFilledIcon,
    NotePencilDashIcon,
    NotePencilIcon,
    RobotSmileIcon,
} from '@navikt/aksel-icons';

import styles from './MeldekortVenstreSeksjon.module.css';

export const MeldekortVenstreSeksjon = () => {
    const { sak } = useSak();
    const { sisteDagSomGirRett } = sak;

    const { meldeperiodeKjede, sisteMeldeperiode, sisteMeldekortBehandling } =
        useMeldeperiodeKjede();
    const { periode, tiltaksnavn, brukersMeldekort, status } = meldeperiodeKjede;

    return (
        <VStack gap="3" className={styles.wrapper}>
            <Heading level={'2'} size={'medium'} className={styles.header}>
                {meldekortHeading(periode)}
            </Heading>
            <Tag
                variant={meldekortStatusTagVariant[status]}
                icon={meldekortStatusIkon[status]}
                className={styles.behandlingTag}
            >
                {finnMeldeperiodeKjedeStatusTekst[status]}
            </Tag>
            <MeldekortDetalj
                header={'Meldekortperiode'}
                tekst={periodeTilFormatertDatotekst(periode)}
            />
            <MeldekortDetalj
                header={'Siste dag med rett'}
                tekst={sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : 'Ukjent'}
            />
            <MeldekortDetalj header={'Tiltak'} tekst={tiltaksnavn ?? 'Ukjent'} />
            <MeldekortDetalj
                header={'Antall dager per meldeperiode'}
                tekst={sisteMeldeperiode.antallDager.toString()}
            />
            <MeldekortDetalj
                header={'Siste meldekort mottatt fra bruker'}
                tekst={
                    brukersMeldekort.at(-1)
                        ? formaterTidspunkt(brukersMeldekort.at(-1)!.mottatt)
                        : 'Ikke mottatt'
                }
            />

            {sisteMeldekortBehandling ? (
                <MeldekortBehandlingDetaljer {...sisteMeldekortBehandling} />
            ) : (
                <MeldekortBehandlingOpprett type={MeldekortBehandlingType.FØRSTE_BEHANDLING} />
            )}

            {sisteMeldekortBehandling?.attesteringer && (
                <OppsummeringAvAttesteringer
                    attesteringer={sisteMeldekortBehandling.attesteringer}
                />
            )}
        </VStack>
    );
};

const MeldekortBehandlingDetaljer = ({
    saksbehandler,
    beslutter,
    erAvsluttet,
    status,
}: MeldekortBehandlingProps) => {
    const { meldekortKorrigeringToggle } = useFeatureToggles();

    return (
        <>
            {status !== MeldekortBehandlingStatus.AUTOMATISK_BEHANDLET && (
                <>
                    {saksbehandler && (
                        <MeldekortDetalj header={'Behandler'} tekst={saksbehandler} />
                    )}
                    {beslutter && <MeldekortDetalj header={'Beslutter'} tekst={beslutter} />}
                </>
            )}

            {meldekortKorrigeringToggle &&
                (erAvsluttet || status === MeldekortBehandlingStatus.KLAR_TIL_BEHANDLING) && (
                    <MeldekortBehandlingOpprett type={MeldekortBehandlingType.KORRIGERING} />
                )}
        </>
    );
};

const MeldekortDetalj = ({ header, tekst }: { header: string; tekst: ArrayOrSingle<string> }) => {
    return (
        <div className={styles.detalj}>
            <BodyShort weight={'semibold'}>{header}</BodyShort>
            {forceArray(tekst).map((tekstverdi, index) => (
                <BodyShort className={styles.detaljtekst} key={`${tekstverdi}-${index}`}>
                    {tekstverdi}
                </BodyShort>
            ))}
        </div>
    );
};

const meldekortStatusTagVariant: Record<
    MeldeperiodeKjedeStatus,
    ComponentProps<typeof Tag>['variant']
> = {
    AUTOMATISK_BEHANDLET: 'success-moderate',
    GODKJENT: 'success-moderate',
    IKKE_KLAR_TIL_BEHANDLING: 'warning-moderate',
    IKKE_RETT_TIL_TILTAKSPENGER: 'warning-moderate',
    KLAR_TIL_BEHANDLING: 'info-moderate',
    KLAR_TIL_BESLUTNING: 'alt1-moderate',
    UNDER_BEHANDLING: 'alt3-moderate',
    UNDER_BESLUTNING: 'alt3-moderate',
    AVBRUTT: 'warning-moderate',
    AVVENTER_MELDEKORT: 'neutral-moderate',
    KORRIGERT_MELDEKORT: 'info-moderate',
};

const meldekortStatusIkon: Record<MeldeperiodeKjedeStatus, React.ReactNode> = {
    [MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: <CircleSlashIcon />,
    [MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING]: <CircleSlashIcon />,
    [MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING]: <NotePencilDashIcon />,
    [MeldeperiodeKjedeStatus.UNDER_BEHANDLING]: <NotePencilIcon />,
    [MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING]: <HourglassTopFilledIcon />,
    [MeldeperiodeKjedeStatus.UNDER_BESLUTNING]: <NotePencilIcon />,
    [MeldeperiodeKjedeStatus.GODKJENT]: <CheckmarkIcon />,
    [MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET]: <RobotSmileIcon />,
    [MeldeperiodeKjedeStatus.AVBRUTT]: <CircleSlashIcon />,
    [MeldeperiodeKjedeStatus.AVVENTER_MELDEKORT]: <HourglassTopFilledIcon />,
    [MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT]: <NotePencilDashIcon />,
};
