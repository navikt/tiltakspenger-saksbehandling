import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortDagStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import { MeldeperiodeKjedeStatus } from '~/lib/meldekort/typer/Meldeperiode';
import React, { ReactElement } from 'react';
import { Tag } from '@navikt/ds-react';
import {
    RammebehandlingResultat,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { Utbetalingsstatus } from '~/types/Utbetaling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { ÅpenBehandlingForOversiktType } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { Behandlingsårsak, Søknadstype } from '~/types/Søknad';
import {
    SøknadBehandlingsårsakManueltRegistrertSøknad,
    SøknadstypeManueltRegistrertSøknad,
} from '~/lib/manuell-søknad/ManueltRegistrertSøknad';
import {
    KlagebehandlingResultat,
    KlagebehandlingStatus,
    OmgjøringÅrsak,
} from '~/lib/klage/typer/Klage';

export const finnBehandlingStatusTag = (
    status: Rammebehandlingsstatus,
    underkjent: boolean,
    erSattPåVent: boolean = false,
) => {
    if (
        (status === Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
            status == Rammebehandlingsstatus.UNDER_BEHANDLING ||
            status === Rammebehandlingsstatus.KLAR_TIL_BESLUTNING ||
            status === Rammebehandlingsstatus.UNDER_BESLUTNING) &&
        erSattPåVent
    ) {
        return (
            <Tag data-color="warning" variant="outline">
                Satt på vent
            </Tag>
        );
    }
    if (
        (status === Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
            status === Rammebehandlingsstatus.UNDER_BEHANDLING) &&
        underkjent
    ) {
        return (
            <Tag data-color="warning" variant="outline">
                Underkjent
            </Tag>
        );
    }
    return behandlingStatusTag[status];
};

const behandlingStatusTag: Record<Rammebehandlingsstatus, React.ReactElement> = {
    [Rammebehandlingsstatus.VEDTATT]: (
        <Tag data-color="success" variant="outline">
            Vedtatt
        </Tag>
    ),
    [Rammebehandlingsstatus.KLAR_TIL_BEHANDLING]: (
        <Tag data-color="info" variant="outline">
            Klar til behandling
        </Tag>
    ),
    [Rammebehandlingsstatus.KLAR_TIL_BESLUTNING]: (
        <Tag data-color="info" variant="outline">
            Klar til beslutning
        </Tag>
    ),
    [Rammebehandlingsstatus.UNDER_BEHANDLING]: (
        <Tag data-color="info" variant="outline">
            Under behandling
        </Tag>
    ),
    [Rammebehandlingsstatus.UNDER_BESLUTNING]: (
        <Tag data-color="info" variant="outline">
            Under beslutning
        </Tag>
    ),
    [Rammebehandlingsstatus.AVBRUTT]: (
        <Tag data-color="neutral" variant="outline">
            Avsluttet
        </Tag>
    ),
    [Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING]: (
        <Tag data-color="neutral" variant="outline">
            Under automatisk behandling
        </Tag>
    ),
};

export const brukersMeldekortDagStatusTekst: Record<BrukersMeldekortDagStatus, string> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]: 'Deltatt',
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]: 'Deltatt med lønn',
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: 'Syk',
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: 'Sykt barn eller syk barnepasser',
    [BrukersMeldekortDagStatus.FRAVÆR_STERKE_VELFERDSGRUNNER_ELLER_JOBBINTERVJU]:
        'Sterke velferdsgrunner eller jobbintervju',
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]: 'Fravær godkjent av Nav',
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: 'Annet fravær',
    [BrukersMeldekortDagStatus.IKKE_BESVART]: 'Ikke besvart',
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG]: 'Ikke tiltaksdag',
} as const;

export const meldekortbehandlingDagStatusTekst: Record<MeldekortbehandlingDagStatus, string> = {
    // OBS! Endring av disse tekstene krever tilsvarende endringer tekstene som utledes for brevene!
    [MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger]: 'Ikke rett til tiltakspenger',
    [MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket]: 'Deltatt med lønn',
    [MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket]: 'Deltatt',
    [MeldekortbehandlingDagStatus.FraværSyk]: 'Syk',
    [MeldekortbehandlingDagStatus.FraværSyktBarn]: 'Sykt barn eller syk barnepasser',
    [MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju]:
        'Sterke velferdsgrunner eller jobbintervju',
    [MeldekortbehandlingDagStatus.FraværGodkjentAvNav]: 'Fravær godkjent av Nav (utfaset)',
    [MeldekortbehandlingDagStatus.FraværAnnet]: 'Annet fravær',
    [MeldekortbehandlingDagStatus.IkkeBesvart]: 'Ikke besvart',
    [MeldekortbehandlingDagStatus.IkkeTiltaksdag]: 'Ikke tiltaksdag',
} as const;

export const finnMeldeperiodeKjedeStatusTekst: Record<MeldeperiodeKjedeStatus, string> = {
    [MeldeperiodeKjedeStatus.AVVENTER_MELDEKORT]: 'Avventer meldekort',
    [MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING]: 'Ikke klar til behandling',
    [MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [MeldeperiodeKjedeStatus.UNDER_BEHANDLING]: 'Under behandling',
    [MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [MeldeperiodeKjedeStatus.UNDER_BESLUTNING]: 'Under beslutning',
    [MeldeperiodeKjedeStatus.GODKJENT]: 'Godkjent',
    [MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET]: 'Automatisk behandlet',
    [MeldeperiodeKjedeStatus.AVBRUTT]: 'Avsluttet',
    [MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
    [MeldeperiodeKjedeStatus.VENTER_AUTOMATISK_BEHANDLING]: 'Venter på automatisk behandling',
} as const;

export const meldeperiodeKjedeStatusTag: Record<MeldeperiodeKjedeStatus, React.ReactElement> = {
    [MeldeperiodeKjedeStatus.GODKJENT]: (
        <Tag data-color="success" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.GODKJENT]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET]: (
        <Tag data-color="success" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING]: (
        <Tag data-color="info" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING]: (
        <Tag data-color="info" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.UNDER_BEHANDLING]: (
        <Tag data-color="info" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.UNDER_BEHANDLING]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.UNDER_BESLUTNING]: (
        <Tag data-color="info" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.UNDER_BESLUTNING]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.AVBRUTT]: (
        <Tag data-color="neutral" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.AVBRUTT]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.AVVENTER_MELDEKORT]: (
        <Tag data-color="neutral" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.AVVENTER_MELDEKORT]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: (
        <Tag data-color="neutral" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING]: (
        <Tag data-color="neutral" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT]: (
        <Tag data-color="info" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT]}
        </Tag>
    ),
    [MeldeperiodeKjedeStatus.VENTER_AUTOMATISK_BEHANDLING]: (
        <Tag data-color="neutral" variant="outline">
            {finnMeldeperiodeKjedeStatusTekst[MeldeperiodeKjedeStatus.VENTER_AUTOMATISK_BEHANDLING]}
        </Tag>
    ),
} as const;

export const finnBehandlingstypeTekst: Record<Rammebehandlingstype, string> = {
    [Rammebehandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [Rammebehandlingstype.REVURDERING]: 'Revurdering',
} as const;

export const finnTypeBehandlingTekstForOversikt: Record<ÅpenBehandlingForOversiktType, string> = {
    [ÅpenBehandlingForOversiktType.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [ÅpenBehandlingForOversiktType.REVURDERING]: 'Revurdering',
    [ÅpenBehandlingForOversiktType.SØKNAD]: 'Søknad',
    [ÅpenBehandlingForOversiktType.MELDEKORT]: 'Meldekort',
    [ÅpenBehandlingForOversiktType.KLAGE]: 'Klage',
} as const;

export const behandlingResultatTilText: Record<RammebehandlingResultat, string> = {
    [SøknadsbehandlingResultat.AVSLAG]: 'Avslag',
    [SøknadsbehandlingResultat.INNVILGELSE]: 'Innvilgelse',
    [SøknadsbehandlingResultat.IKKE_VALGT]: 'Ikke valgt',
    [RevurderingResultat.STANS]: 'Stans',
    [RevurderingResultat.INNVILGELSE]: 'Innvilgelse',
    [RevurderingResultat.OMGJØRING]: 'Omgjøring med innvilgelse',
    [RevurderingResultat.OMGJØRING_OPPHØR]: 'Opphør',
    [RevurderingResultat.OMGJØRING_IKKE_VALGT]: 'Ikke valgt',
};

export function behandlingResultatTilTag(
    resultat: RammebehandlingResultat,
    ekstraTekst?: string,
): ReactElement {
    const resultatText = behandlingResultatTilText[resultat];

    switch (resultat) {
        case SøknadsbehandlingResultat.AVSLAG:
            return (
                <Tag data-color="danger" variant="outline">
                    {ekstraTekst} {resultatText}
                </Tag>
            );

        case SøknadsbehandlingResultat.INNVILGELSE:
            return (
                <Tag data-color="success" variant="outline">
                    {ekstraTekst} {resultatText}
                </Tag>
            );

        case RevurderingResultat.STANS:
        case RevurderingResultat.OMGJØRING_OPPHØR:
            return (
                <Tag data-color="warning" variant="outline">
                    {ekstraTekst} {resultatText}
                </Tag>
            );

        case RevurderingResultat.INNVILGELSE:
            return (
                <Tag data-color="info" variant="outline">
                    {ekstraTekst} {resultatText}
                </Tag>
            );

        case SøknadsbehandlingResultat.IKKE_VALGT:
        case RevurderingResultat.OMGJØRING_IKKE_VALGT:
            return (
                <Tag data-color="neutral" variant="outline">
                    {ekstraTekst} {resultatText}
                </Tag>
            );

        case RevurderingResultat.OMGJØRING:
            return (
                <Tag data-color="meta-purple" variant="outline">
                    {ekstraTekst} {resultatText}
                </Tag>
            );
    }
}

export const klagebehandlingStatusTilText: Record<KlagebehandlingStatus, string> = {
    [KlagebehandlingStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [KlagebehandlingStatus.UNDER_BEHANDLING]: 'Under behandling',
    [KlagebehandlingStatus.AVBRUTT]: 'Avbrutt',
    [KlagebehandlingStatus.VEDTATT]: 'Vedtatt',
    [KlagebehandlingStatus.OPPRETTHOLDT]: 'Opprettholdt',
    [KlagebehandlingStatus.OVERSENDT]: 'Oversendt',
    [KlagebehandlingStatus.FERDIGSTILT]: 'Ferdigstilt',
    [KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS]: 'Mottatt fra klageinstans',
    [KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS]: 'Omgjøring etter klageinstans',
};

export const klagebehandlingStatusTilTag = (args: {
    status: KlagebehandlingStatus;
    size?: 'small' | 'medium';
    extraContent?: {
        before?: string;
        after?: string;
    };
}): ReactElement => {
    switch (args.status) {
        case KlagebehandlingStatus.KLAR_TIL_BEHANDLING:
            return (
                <Tag data-color="info" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.KLAR_TIL_BEHANDLING]}
                    {args.extraContent?.after}
                </Tag>
            );
        case KlagebehandlingStatus.UNDER_BEHANDLING:
            return (
                <Tag data-color="info" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.UNDER_BEHANDLING]}
                    {args.extraContent?.after}
                </Tag>
            );
        case KlagebehandlingStatus.AVBRUTT:
            return (
                <Tag data-color="neutral" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.AVBRUTT]}
                    {args.extraContent?.after}
                </Tag>
            );
        case KlagebehandlingStatus.VEDTATT:
            return (
                <Tag data-color="success" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.VEDTATT]}
                    {args.extraContent?.after}
                </Tag>
            );

        case KlagebehandlingStatus.OPPRETTHOLDT:
            return (
                <Tag data-color="success" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.OPPRETTHOLDT]}
                    {args.extraContent?.after}
                </Tag>
            );

        case KlagebehandlingStatus.OVERSENDT:
            return (
                <Tag data-color="success" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.OVERSENDT]}
                    {args.extraContent?.after}
                </Tag>
            );

        case KlagebehandlingStatus.FERDIGSTILT:
            return (
                <Tag data-color="success" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.FERDIGSTILT]}
                    {args.extraContent?.after}
                </Tag>
            );

        case KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS:
            return (
                <Tag data-color="info" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingStatusTilText[KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS]}
                    {args.extraContent?.after}
                </Tag>
            );
        case KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS:
            return (
                <Tag data-color="info" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {
                        klagebehandlingStatusTilText[
                            KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS
                        ]
                    }
                    {args.extraContent?.after}
                </Tag>
            );
    }
    throw new Error('Manglende status håndtering: ' + (args.status satisfies never));
};

export const klagebehandlingResultatTilText: Record<KlagebehandlingResultat, string> = {
    [KlagebehandlingResultat.AVVIST]: 'Avvist',
    [KlagebehandlingResultat.OMGJØR]: 'Omgjør',
    [KlagebehandlingResultat.OPPRETTHOLDT]: 'Opprettholdt',
};

export const klagebehandlingResultatTilTag = (args: {
    resultat: KlagebehandlingResultat;
    size?: 'small' | 'medium';
    extraContent?: {
        before?: string;
        after?: string;
    };
}): ReactElement => {
    switch (args.resultat) {
        case KlagebehandlingResultat.AVVIST:
            return (
                <Tag data-color="danger" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingResultatTilText[KlagebehandlingResultat.AVVIST]}
                    {args.extraContent?.after}
                </Tag>
            );
        case KlagebehandlingResultat.OMGJØR:
            return (
                <Tag data-color="meta-purple" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingResultatTilText[KlagebehandlingResultat.OMGJØR]}
                    {args.extraContent?.after}
                </Tag>
            );
        case KlagebehandlingResultat.OPPRETTHOLDT:
            return (
                <Tag data-color="meta-lime" variant="outline" size={args.size}>
                    {args.extraContent?.before}
                    {klagebehandlingResultatTilText[KlagebehandlingResultat.OPPRETTHOLDT]}
                    {args.extraContent?.after}
                </Tag>
            );
    }
    throw new Error('Manglende resultat håndtering: ' + (args.resultat satisfies never));
};

export const omgjøringsårsakTilText: Record<OmgjøringÅrsak, string> = {
    [OmgjøringÅrsak.ANNET]: 'Annet',
    [OmgjøringÅrsak.FEIL_ELLER_ENDRET_FAKTA]: 'Feil eller endret fakta',
    [OmgjøringÅrsak.FEIL_LOVANVENDELSE]: 'Feil lovanvendelse',
    [OmgjøringÅrsak.FEIL_REGELVERKSFORSTAAELSE]: 'Feil regelverksforståelse',
    [OmgjøringÅrsak.PROSESSUELL_FEIL]: 'Prosessuelt feil',
};

export const utbetalingsstatusTekst: Record<Utbetalingsstatus, string> = {
    FEILET_MOT_OPPDRAG: 'Feilet mot oppdrag',
    IKKE_SENDT_TIL_HELVED: 'Ikke sendt til helved',
    OK: 'Sendt til utbetaling',
    OK_UTEN_UTBETALING: 'Ok uten utbetaling',
    SENDT_TIL_HELVED: 'Venter på helved',
    SENDT_TIL_OPPDRAG: 'Venter på oppdrag',
    AVBRUTT: 'Avbrutt',
    IKKE_GODKJENT: 'Ikke godkjent',
};

export const formaterSøknadsspørsmålSvar = (value: string | undefined) => {
    switch (value) {
        case 'JA':
            return 'Ja';
        case 'NEI':
            return 'Nei';
        case 'IKKE_BESVART':
            return 'Ikke besvart';
        case undefined:
            return '-';
        default:
            return value;
    }
};

export const formaterSøknadstype = (value: Søknadstype | SøknadstypeManueltRegistrertSøknad) => {
    switch (value) {
        case 'DIGITAL':
            return 'Digital';
        case 'PAPIR_SKJEMA':
            return 'Papirsøknad (skjema)';
        case 'PAPIR_FRIHAND':
            return 'Papirsøknad (frihånd)';
        case 'MODIA':
            return 'Modia';
        case 'ANNET':
            return 'Annet';
    }
};

export const formaterSøknadBehandlingsårsak = (
    value: Behandlingsårsak | SøknadBehandlingsårsakManueltRegistrertSøknad,
) => {
    switch (value) {
        case 'FORLENGELSE_FRA_ARENA':
            return 'Forlengelse fra Arena';
        case 'SOKNADSBEHANDLING_FRA_ARENA':
            return 'Søknadsbehandling fra Arena';
        case 'OVERLAPPENDE_TILTAK_I_ARENA':
            return 'Overlappende tiltak i Arena';
        case 'ANNET':
            return 'Annet';
    }
};
