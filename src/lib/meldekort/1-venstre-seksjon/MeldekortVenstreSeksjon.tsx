import { BodyShort, Heading, Tag, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    periodeTilFormatertDatotekst,
    ukenummerFraDatotekst,
} from '~/utils/date';
import { MeldekortbehandlingOpprett } from './opprett-behandling/MeldekortbehandlingOpprett';
import { MeldekortbehandlingTaKnapp } from './ta-behandling/MeldekortbehandlingTaKnapp';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { ArrayOrSingle } from '~/types/UtilTypes';
import { forceArray } from '~/utils/array';
import { useMeldeperiodeKjede } from '../context/MeldeperiodeKjedeContext';
import OppsummeringAvAttesteringer from '~/lib/behandling-felles/attestering/OppsummeringAvAttestering';
import { finnMeldeperiodeKjedeStatusTekst } from '~/utils/tekstformateringUtils';
import { MeldeperiodeKjedeStatus } from '~/lib/meldekort/typer/Meldeperiode';
import React, { ComponentProps } from 'react';
import {
    CheckmarkIcon,
    CircleSlashIcon,
    HourglassTopFilledIcon,
    NotePencilDashIcon,
    NotePencilIcon,
    RobotSmileIcon,
} from '@navikt/aksel-icons';
import { erMeldekortbehandlingSattPaVent } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';

import styles from './MeldekortVenstreSeksjon.module.css';

export const MeldekortVenstreSeksjon = () => {
    const { sak } = useSak();
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = sak;

    const { meldeperiodeKjede, sisteMeldeperiode, sisteMeldekortbehandling } =
        useMeldeperiodeKjede();
    const { periode, tiltaksnavn, brukersMeldekort, status } = meldeperiodeKjede;
    const erSattPåVent = sisteMeldekortbehandling
        ? erMeldekortbehandlingSattPaVent(sisteMeldekortbehandling)
        : false;

    return (
        <VStack gap="space-12" className={styles.wrapper}>
            <Heading level={'2'} size={'medium'} className={styles.header}>
                {`Meldekort uke ${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)}`}
            </Heading>
            <Tag
                variant={erSattPåVent ? 'warning-moderate' : meldekortStatusTagVariant[status]}
                icon={erSattPåVent ? <HourglassTopFilledIcon /> : meldekortStatusIkon[status]}
                className={styles.behandlingTag}
            >
                {erSattPåVent ? 'Satt på vent' : finnMeldeperiodeKjedeStatusTekst[status]}
            </Tag>
            <MeldekortDetalj
                header={'Meldekortperiode'}
                tekst={periodeTilFormatertDatotekst(periode)}
            />
            <MeldekortDetalj
                header={'Første dag med rett'}
                tekst={førsteDagSomGirRett ? formaterDatotekst(førsteDagSomGirRett) : 'Ukjent'}
            />
            <MeldekortDetalj
                header={'Siste dag med rett'}
                tekst={sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : 'Ukjent'}
            />
            <MeldekortDetalj
                header={'Bruker kan melde helg?'}
                tekst={kanSendeInnHelgForMeldekort ? 'Ja' : 'Nei'}
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
            {sisteMeldekortbehandling ? (
                <MeldekortbehandlingDetaljer meldekortbehandling={sisteMeldekortbehandling} />
            ) : (
                <MeldekortbehandlingOpprett type={MeldekortbehandlingType.FØRSTE_BEHANDLING} />
            )}
        </VStack>
    );
};

const MeldekortbehandlingDetaljer = ({
    meldekortbehandling,
}: {
    meldekortbehandling: MeldekortbehandlingProps;
}) => {
    const { saksbehandler, beslutter, erAvsluttet, status, attesteringer } = meldekortbehandling;

    return (
        <>
            {status !== MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET && (
                <>
                    {saksbehandler && (
                        <MeldekortDetalj header={'Behandler'} tekst={saksbehandler} />
                    )}
                    {beslutter && <MeldekortDetalj header={'Beslutter'} tekst={beslutter} />}
                </>
            )}

            {erAvsluttet && (
                <MeldekortbehandlingOpprett type={MeldekortbehandlingType.KORRIGERING} />
            )}

            {status === MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING && (
                <MeldekortbehandlingTaKnapp meldekortbehandling={meldekortbehandling} />
            )}

            {attesteringer && <OppsummeringAvAttesteringer attesteringer={attesteringer} />}
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
    VENTER_AUTOMATISK_BEHANDLING: 'neutral-moderate',
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
    [MeldeperiodeKjedeStatus.VENTER_AUTOMATISK_BEHANDLING]: <HourglassTopFilledIcon />,
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
