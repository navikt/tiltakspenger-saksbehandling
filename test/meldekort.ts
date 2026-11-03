/**
 * Testdata-byggere for meldekort. Kun ment for tester, og skal ikke importeres fra appkoden.
 */
import dayjs from 'dayjs';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortDagProps,
    MeldeperiodebehandlingProps,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeProps } from '~/lib/meldekort/typer/Meldeperiode';
import {
    MeldeperiodeKjedeId,
    MeldeperiodekjedeProps,
} from '~/lib/meldekort/typer/Meldeperiodekjede';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortId,
    BrukersMeldekortKjedeStatus,
    BrukersMeldekortProps,
    MeldekortBehandletAutomatiskStatus,
} from '~/lib/meldekort/typer/BrukersMeldekort';
import { Utbetalingsstatus } from '~/lib/_felles/utbetaling/utbetalingTyper';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Periode } from '~/types/Periode';
import { Dato, tilDato, tilTidspunkt } from '~/types/DatoTid';

// Mandag i uke 2, 2025
export const FØRSTE_MANDAG = tilDato('2025-01-06');
// Mandagen to uker senere (uke 4, 2025)
export const ANDRE_MANDAG = tilDato('2025-01-20');

export const leggTilDager = (dato: Dato, antall: number): Dato =>
    tilDato(dayjs(dato).add(antall, 'day').format('YYYY-MM-DD'));

/** De 14 datoene i meldeperioden som starter på `fraOgMed` (en mandag). */
export const meldeperiodeDatoer = (fraOgMed: Dato): Dato[] =>
    Array.from({ length: 14 }, (_, index) => leggTilDager(fraOgMed, index));

export const meldeperiodePeriode = (fraOgMed: Dato): Periode => ({
    fraOgMed,
    tilOgMed: leggTilDager(fraOgMed, 13),
});

export const kjedeIdFor = (fraOgMed: Dato): MeldeperiodeKjedeId =>
    `${fraOgMed}/${leggTilDager(fraOgMed, 13)}`;

export const erHelg = (dato: Dato): boolean => [0, 6].includes(dayjs(dato).day());

export const meldeperiode = (
    fraOgMed: Dato,
    overstyringer: {
        antallDager?: number;
        girRett?: (dato: Dato) => boolean;
        versjon?: number;
    } = {},
): MeldeperiodeProps => {
    const { antallDager = 10, girRett = () => true, versjon = 1 } = overstyringer;

    const girRettPerDag = Object.fromEntries(
        meldeperiodeDatoer(fraOgMed).map((dato) => [dato, girRett(dato)]),
    );

    return {
        id: `meldeperiode_${fraOgMed}_v${versjon}`,
        versjon,
        kjedeId: kjedeIdFor(fraOgMed),
        periode: meldeperiodePeriode(fraOgMed),
        opprettet: tilTidspunkt('2025-01-01T12:00:00'),
        antallDager,
        girRett: girRettPerDag,
        ingenDagerGirRett: Object.values(girRettPerDag).every((rett) => !rett),
    };
};

export const meldeperiodekjede = (
    fraOgMed: Dato,
    overstyringer: Partial<MeldeperiodekjedeProps> = {},
): MeldeperiodekjedeProps => {
    const sisteMeldeperiode = overstyringer.sisteMeldeperiode ?? meldeperiode(fraOgMed);

    return {
        id: sisteMeldeperiode.kjedeId,
        periode: sisteMeldeperiode.periode,
        tiltaksnavn: ['Arbeidsmarkedsopplæring'],
        sisteMeldeperiode,
        meldekortbehandlingIder: [],
        meldekortbehandlingStatus: null,
        brukersMeldekort: [],
        brukersMeldekortStatus: BrukersMeldekortKjedeStatus.IKKE_MOTTATT,
        gjeldendeBeregning: null,
        kanIkkeBehandlesGrunn: null,
        åpenBehandlingId: null,
        ...overstyringer,
    };
};

export const brukersMeldekort = (
    fraOgMed: Dato,
    statusForDag: (dato: Dato) => BrukersMeldekortDagStatus,
    overstyringer: Partial<BrukersMeldekortProps> = {},
): BrukersMeldekortProps => ({
    id: `meldekort_bruker_${fraOgMed}` as BrukersMeldekortId,
    mottatt: tilTidspunkt(`${leggTilDager(fraOgMed, 13)}T18:00:00`),
    dager: meldeperiodeDatoer(fraOgMed).map((dato) => ({ dato, status: statusForDag(dato) })),
    behandletAutomatiskStatus: MeldekortBehandletAutomatiskStatus.SKAL_IKKE_BEHANDLES_AUTOMATISK,
    behandlesAutomatiskNesteForsøk: null,
    ...overstyringer,
});

/** Dager for en meldeperiode der alle dagene har samme status, med mindre `statusForDag` sier noe annet. */
export const meldekortDager = (
    fraOgMed: Dato,
    statusForDag: (dato: Dato, index: number) => MeldekortbehandlingDagStatus = () =>
        MeldekortbehandlingDagStatus.IkkeBesvart,
): MeldekortDagProps[] =>
    meldeperiodeDatoer(fraOgMed).map((dato, index) => ({
        dato,
        status: statusForDag(dato, index),
    }));

export const meldeperiodebehandling = (
    fraOgMed: Dato,
    overstyringer: Partial<MeldeperiodebehandlingProps> = {},
): MeldeperiodebehandlingProps => ({
    meldeperiodeId: `meldeperiode_${fraOgMed}_v1`,
    kjedeId: kjedeIdFor(fraOgMed),
    brukersMeldekortId: [],
    periode: meldeperiodePeriode(fraOgMed),
    dager: meldekortDager(fraOgMed),
    beregning: null,
    type: MeldeperiodebehandlingType.FØRSTE_BEHANDLING,
    ...overstyringer,
});

export const meldekortbehandling = (
    overstyringer: Partial<MeldekortbehandlingProps> = {},
): MeldekortbehandlingProps => {
    const meldeperioder = overstyringer.meldeperioder ?? [meldeperiodebehandling(FØRSTE_MANDAG)];

    return {
        id: 'meldekort_behandling_1' as MeldekortbehandlingId,
        sakId: 'sak_1',
        saksbehandler: 'Z123456',
        beslutter: null,
        opprettet: tilTidspunkt('2025-01-20T09:00:00'),
        sistEndret: tilTidspunkt('2025-01-20T09:00:00'),
        godkjentTidspunkt: null,
        status: MeldekortbehandlingStatus.UNDER_BEHANDLING,
        erAvsluttet: false,
        navkontor: ikkeSladdet('0220'),
        navkontorNavn: ikkeSladdet('Nav Asker'),
        begrunnelse: ikkeSladdet(null),
        attesteringer: [],
        utbetalingsstatus: Utbetalingsstatus.IKKE_GODKJENT,
        periode: {
            fraOgMed: meldeperioder.atNonNull(0).periode.fraOgMed,
            tilOgMed: meldeperioder.atNonNull(-1).periode.tilOgMed,
        },
        meldeperioder,
        avbrutt: null,
        simulertBeregning: null,
        utbetalingskontroll: null,
        kanIkkeIverksetteUtbetaling: null,
        kanIkkeIverksetteUtbetalingMelding: null,
        tekstTilVedtaksbrev: ikkeSladdet(null),
        tilbakekrevingId: null,
        klagebehandlingId: null,
        skalSendeVedtaksbrev: true,
        skalJournalføreNotat: false,
        beslutterEndringer: { skalJournalføreNotat: null },
        prioritering: null,
        ventestatus: [],
        gyldigeKommandoer: [SaksbehandlerBehandlingKommando.Saksbehandle],
        ...overstyringer,
    };
};
