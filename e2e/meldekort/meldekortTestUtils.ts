import type { Page } from '@playwright/test';
import { expect, http, HttpResponse, lagSaksbehandler } from '../felles/e2eFelles';
import { periode, sakMedInnvilgetVedtak } from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import type { SakProps } from '~/lib/sak/SakTyper';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import type {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
    MeldekortDagProps,
    MeldeperiodebehandlingProps,
    OppdaterMeldekortbehandlingDTO,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import type {
    MeldeperiodeKjedeId,
    MeldeperiodekjedeProps,
} from '~/lib/meldekort/typer/Meldeperiodekjede';
import { KanIkkeBehandlesGrunn } from '~/lib/meldekort/typer/Meldeperiodekjede';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortKjedeStatus,
    MeldekortBehandletAutomatiskStatus,
} from '~/lib/meldekort/typer/BrukersMeldekort';
import type {
    BrukersMeldekortId,
    BrukersMeldekortProps,
} from '~/lib/meldekort/typer/BrukersMeldekort';
import type { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';
import { Utbetalingsstatus } from '~/lib/_felles/utbetaling/utbetalingTyper';
import { Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import type {
    BeregningerSummert,
    MeldeperiodeBeregningProps,
} from '~/lib/beregning-og-simulering/typer/Beregning';
import {
    SimuleringResultat,
    SimulerertBehandlingstype,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import type { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';

export const SAK_ID = 'sak_1';
export const SAKSNUMMER = tilSaksnummer('202501011001');
export const VEDTAKSPERIODE = periode('2025-01-01', '2025-03-31');

/** Meldeperioden mandag 06.01.2025 - søndag 19.01.2025 (uke 2 og 3) */
export const KJEDE_PERIODE = periode('2025-01-06', '2025-01-19');
export const KJEDE_ID: MeldeperiodeKjedeId = `${KJEDE_PERIODE.fraOgMed}/${KJEDE_PERIODE.tilOgMed}`;
export const MAKS_ANTALL_DAGER = 10;

/** Dagsats i den falske beregningen, for dager med deltakelse eller fravær som gir utbetaling */
export const DAGSATS = 298;

export const PERSONOVERSIKT_URL = `/sak/${SAKSNUMMER}#Meldekort`;
export const KJEDE_URL = `/sak/${SAKSNUMMER}/meldeperiode/${KJEDE_PERIODE.fraOgMed}/${KJEDE_PERIODE.tilOgMed}`;
export const behandlingUrl = (id: MeldekortbehandlingId) =>
    `/sak/${SAKSNUMMER}/meldekortbehandling/${id}`;

/** Alle de 14 datoene i meldeperioden */
export const DATOER: string[] = Array.from({ length: 14 }, (_, index) => {
    const dato = new Date(`${KJEDE_PERIODE.fraOgMed}T12:00:00Z`);
    dato.setUTCDate(dato.getUTCDate() + index);
    return dato.toISOString().slice(0, 10);
});

export const erHelg = (dato: string) => {
    const ukedag = new Date(`${dato}T12:00:00Z`).getUTCDay();
    return ukedag === 0 || ukedag === 6;
};

/** Gitt status alle hverdager, og ikke tiltaksdag i helgene */
export const fullUtfylling = (
    hverdag: MeldekortbehandlingDagStatus = MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
): MeldekortDagProps[] =>
    DATOER.map((dato) => ({
        dato,
        status: erHelg(dato) ? MeldekortbehandlingDagStatus.IkkeTiltaksdag : hverdag,
    }));

export const ikkeBesvarteDager = (): MeldekortDagProps[] =>
    DATOER.map((dato) => ({ dato, status: MeldekortbehandlingDagStatus.IkkeBesvart }));

const statuserMedUtbetaling: ReadonlySet<MeldekortbehandlingDagStatus> = new Set([
    MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
    MeldekortbehandlingDagStatus.FraværSyk,
    MeldekortbehandlingDagStatus.FraværSyktBarn,
    MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
    MeldekortbehandlingDagStatus.FraværGodkjentAvNav,
]);

const summert = (nå: number, før: number | null = null): BeregningerSummert => ({
    totalt: { før, nå },
    ordinært: { før, nå },
    barnetillegg: { før: før === null ? null : 0, nå: 0 },
});

/** Forenklet beregning: full dagsats for deltakelse og fravær som gir utbetaling, ellers ingenting */
export const lagMeldeperiodeBeregning = (
    behandlingId: MeldekortbehandlingId,
    dager: MeldekortDagProps[],
): MeldeperiodeBeregningProps => {
    const beregnedeDager = dager.map(({ dato, status }) => {
        const beløp = statuserMedUtbetaling.has(status) ? DAGSATS : 0;
        return {
            dato,
            status,
            beregningsdag: { beløp, prosent: beløp > 0 ? 100 : 0, barnetillegg: 0 },
        };
    });
    const totalt = beregnedeDager.reduce((sum, dag) => sum + dag.beregningsdag.beløp, 0);

    return {
        kjedeId: KJEDE_ID,
        periode: KJEDE_PERIODE,
        beløp: { totalt, ordinært: totalt, barnetillegg: 0 },
        dager: beregnedeDager,
        beregningKilde: { id: behandlingId, type: BeregningKildeType.MELDEKORT },
    };
};

export const lagSimulertBeregning = (
    beregning: MeldeperiodeBeregningProps,
    tidspunkt: string,
    forrige: MeldeperiodeBeregningProps | null = null,
): SimulertBeregning => {
    const totalt = beregning.beløp.totalt;
    const forrigeTotalt = forrige?.beløp.totalt ?? null;
    return {
        behandlingId: beregning.beregningKilde.id as MeldekortbehandlingId,
        behandlingstype: SimulerertBehandlingstype.MELDERKORT,
        meldeperioder: [
            {
                kjedeId: KJEDE_ID,
                dager: beregning.dager.map((dag, index) => ({
                    dato: dag.dato,
                    merker: [],
                    status: dag.status,
                    beregning: summert(
                        dag.beregningsdag?.beløp ?? 0,
                        forrige ? (forrige.dager[index]?.beregningsdag?.beløp ?? 0) : null,
                    ),
                })),
                simulerteBeløp: null,
                beregning: summert(totalt, forrigeTotalt),
                flagg: {
                    harJustering: false,
                    justeringGårOppINull: false,
                    justeringPåTversAvMeldeperiodeEllerMåned: false,
                    harFeilutbetaling: false,
                    harTrekk: false,
                },
                posteringer: [],
            },
        ],
        beregningstidspunkt: tidspunkt,
        beregning: summert(totalt, forrigeTotalt),
        simuleringstidspunkt: null,
        simuleringsdato: null,
        simuleringTotalBeløp: null,
        simulerteBeløp: null,
        simuleringResultat: SimuleringResultat.IKKE_SIMULERT,
    };
};

export const lagKjede = (
    overstyringer: Partial<MeldeperiodekjedeProps> = {},
): MeldeperiodekjedeProps => ({
    id: KJEDE_ID,
    periode: KJEDE_PERIODE,
    tiltaksnavn: ['Arbeidsmarkedsopplæring (AMO)'],
    sisteMeldeperiode: {
        id: 'meldeperiode_1',
        versjon: 1,
        kjedeId: KJEDE_ID,
        periode: KJEDE_PERIODE,
        opprettet: '2025-01-01T09:00:00',
        antallDager: MAKS_ANTALL_DAGER,
        girRett: Object.fromEntries(DATOER.map((dato) => [dato, true])),
        ingenDagerGirRett: false,
    },
    meldekortbehandlingIder: [],
    meldekortbehandlingStatus: null,
    brukersMeldekort: [],
    brukersMeldekortStatus: BrukersMeldekortKjedeStatus.IKKE_MOTTATT,
    gjeldendeBeregning: null,
    kanIkkeBehandlesGrunn: null,
    åpenBehandlingId: null,
    ...overstyringer,
});

/** Index i meldeperioden for fredag 10.01.2025, som bruker har meldt som syk */
export const BRUKERS_SYKEDAG_INDEX = 4;

/** Brukers meldekort: deltatt på hverdager, unntatt syk fredag i uke 2, og ikke besvart i helgene */
export const lagBrukersMeldekort = (
    overstyringer: Partial<BrukersMeldekortProps> = {},
): BrukersMeldekortProps => ({
    id: 'meldekort_bruker_1' as BrukersMeldekortId,
    mottatt: '2025-01-20T08:00:00',
    dager: DATOER.map((dato, index) => ({
        dato,
        status: erHelg(dato)
            ? BrukersMeldekortDagStatus.IKKE_BESVART
            : index === BRUKERS_SYKEDAG_INDEX
              ? BrukersMeldekortDagStatus.FRAVÆR_SYK
              : BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET,
    })),
    behandletAutomatiskStatus: MeldekortBehandletAutomatiskStatus.SKAL_IKKE_BEHANDLES_AUTOMATISK,
    behandlesAutomatiskNesteForsøk: null,
    ...overstyringer,
});

type MeldekortbehandlingOverstyringer = Partial<MeldekortbehandlingProps> & {
    dager?: MeldekortDagProps[];
    type?: MeldeperiodebehandlingType;
};

/**
 * Bygger en meldekortbehandling for kjeden. Er alle dagene besvart, får behandlingen også
 * beregning og simulert beregning, slik den har etter lagring i backend.
 */
export const lagMeldekortbehandling = ({
    dager = ikkeBesvarteDager(),
    type = MeldeperiodebehandlingType.FØRSTE_BEHANDLING,
    ...overstyringer
}: MeldekortbehandlingOverstyringer = {}): MeldekortbehandlingProps => {
    const id = overstyringer.id ?? ('meldekort_behandling_1' as MeldekortbehandlingId);
    const erUtfylt = dager.every((dag) => dag.status !== MeldekortbehandlingDagStatus.IkkeBesvart);
    const beregning = erUtfylt ? lagMeldeperiodeBeregning(id, dager) : null;

    const meldeperiode: MeldeperiodebehandlingProps = {
        meldeperiodeId: 'meldeperiode_1',
        kjedeId: KJEDE_ID,
        brukersMeldekortId: [],
        periode: KJEDE_PERIODE,
        dager,
        beregning,
        type,
    };

    return {
        id,
        sakId: SAK_ID,
        saksbehandler: lagSaksbehandler().navIdent,
        beslutter: null,
        opprettet: '2025-01-20T09:00:00',
        sistEndret: '2025-01-20T09:00:00',
        godkjentTidspunkt: null,
        status: MeldekortbehandlingStatus.UNDER_BEHANDLING,
        erAvsluttet: false,
        navkontor: ikkeSladdet('0220'),
        navkontorNavn: ikkeSladdet('Nav Asker'),
        begrunnelse: ikkeSladdet(null),
        attesteringer: [],
        utbetalingsstatus: Utbetalingsstatus.IKKE_GODKJENT,
        periode: KJEDE_PERIODE,
        meldeperioder: [meldeperiode],
        avbrutt: null,
        simulertBeregning: beregning
            ? lagSimulertBeregning(beregning, '2025-01-20T09:00:00')
            : null,
        utbetalingskontroll: null,
        kanIkkeIverksetteUtbetaling: null,
        kanIkkeIverksetteUtbetalingMelding: null,
        tekstTilVedtaksbrev: ikkeSladdet(null),
        tilbakekrevingId: null,
        klagebehandlingId: null,
        skalSendeVedtaksbrev: false,
        skalJournalføreNotat: false,
        beslutterEndringer: { skalJournalføreNotat: null },
        prioritering: null,
        ventestatus: [],
        gyldigeKommandoer: [],
        ...overstyringer,
    };
};

const K = SaksbehandlerBehandlingKommando;

/** Speiler backendens utledning av gyldige kommandoer for innlogget saksbehandler/beslutter */
const utledGyldigeKommandoer = (
    behandling: MeldekortbehandlingProps,
    innlogget: Saksbehandler,
): SaksbehandlerBehandlingKommando[] => {
    const ident = innlogget.navIdent;
    const erSaksbehandler = innlogget.roller.includes(SaksbehandlerRolle.SAKSBEHANDLER);
    const erBeslutter = innlogget.roller.includes(SaksbehandlerRolle.BESLUTTER);
    const erPåVent = behandling.ventestatus.at(0)?.erSattPåVent ?? false;
    const ventekommandoer = erPåVent ? [K.Gjenoppta, K.OppdatereSettPåVent] : [];

    switch (behandling.status) {
        case MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING:
            return erSaksbehandler ? [K.TildelSaksbehandler, ...ventekommandoer] : [];
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
            if (!erSaksbehandler) {
                return [];
            }
            return behandling.saksbehandler === ident && !erPåVent
                ? [K.Saksbehandle, K.SettPåVent, K.LeggTilbakeSaksbehandler]
                : [K.OvertaSaksbehandler];
        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING:
            if (erBeslutter && behandling.saksbehandler !== ident) {
                return [K.TildelBeslutter, ...ventekommandoer];
            }
            return erSaksbehandler && behandling.saksbehandler === ident
                ? [K.AngreSendTilBeslutning]
                : [];
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return erBeslutter && behandling.beslutter === ident && !erPåVent
                ? [K.Beslutte, K.SettPåVent, K.LeggTilbakeBeslutter]
                : [];
        default:
            return [];
    }
};

type BackendOppsett = {
    innlogget?: Saksbehandler;
    behandlinger?: MeldekortbehandlingProps[];
    brukersMeldekort?: BrukersMeldekortProps[];
    meldekortvedtak?: Meldekortvedtak[];
};

export type VentRequest = {
    begrunnelse: string;
    frist: string | null;
    oppdaterSattPåVent: boolean;
};

export type MeldekortRequester = {
    opprett: { kjedeIder: string[] }[];
    oppdater: OppdaterMeldekortbehandlingDTO[];
    sendTilBeslutning: string[];
    ta: string[];
    iverksett: string[];
    underkjenn: { begrunnelse: string }[];
    vent: VentRequest[];
    gjenoppta: string[];
    oppdaterSimulering: string[];
};

/**
 * Stateful falsk backend for meldekortbehandling. Saken bygges på nytt fra tilstanden for hvert
 * kall, slik at avledede felter på kjeden og saken (åpne behandlinger, status, gyldige kommandoer
 * osv.) alltid henger sammen med behandlingene, slik de gjør i backend.
 */
export const lagMeldekortBackend = ({
    innlogget = lagSaksbehandler(),
    behandlinger: initielleBehandlinger = [],
    brukersMeldekort = [],
    meldekortvedtak: initielleVedtak = [],
}: BackendOppsett = {}) => {
    const behandlinger = new Map<MeldekortbehandlingId, MeldekortbehandlingProps>(
        initielleBehandlinger.map((behandling) => [behandling.id, structuredClone(behandling)]),
    );
    const meldekortvedtak = [...initielleVedtak];

    const requester: MeldekortRequester = {
        opprett: [],
        oppdater: [],
        sendTilBeslutning: [],
        ta: [],
        iverksett: [],
        underkjenn: [],
        vent: [],
        gjenoppta: [],
        oppdaterSimulering: [],
    };

    let tidspunktTeller = 0;
    const nyttTidspunkt = () => {
        tidspunktTeller += 1;
        return `2025-01-21T10:${String(tidspunktTeller).padStart(2, '0')}:00`;
    };

    const sorterteBehandlinger = () =>
        [...behandlinger.values()].toSorted((a, b) => a.opprettet.localeCompare(b.opprettet));

    const sisteGodkjente = () =>
        sorterteBehandlinger()
            .filter((behandling) => behandling.status === MeldekortbehandlingStatus.GODKJENT)
            .at(-1);

    const medKommandoer = (behandling: MeldekortbehandlingProps): MeldekortbehandlingProps => ({
        ...behandling,
        gyldigeKommandoer: utledGyldigeKommandoer(behandling, innlogget),
    });

    const byggKjede = (): MeldeperiodekjedeProps => {
        const alle = sorterteBehandlinger();
        const åpen = alle.find((behandling) => !behandling.erAvsluttet);
        const godkjent = sisteGodkjente();

        const brukersMeldekortStatus =
            brukersMeldekort.length === 0
                ? BrukersMeldekortKjedeStatus.IKKE_MOTTATT
                : åpen
                  ? BrukersMeldekortKjedeStatus.UNDER_BEHANDLING
                  : godkjent
                    ? BrukersMeldekortKjedeStatus.BEHANDLET
                    : BrukersMeldekortKjedeStatus.VENTER_BEHANDLING;

        return lagKjede({
            meldekortbehandlingIder: alle.map((behandling) => behandling.id),
            meldekortbehandlingStatus: alle.at(-1)?.status ?? null,
            brukersMeldekort,
            brukersMeldekortStatus,
            gjeldendeBeregning: godkjent?.meldeperioder.at(0)?.beregning ?? null,
            kanIkkeBehandlesGrunn: åpen ? KanIkkeBehandlesGrunn.HAR_ÅPEN_BEHANDLING : null,
            åpenBehandlingId: åpen?.id ?? null,
        });
    };

    const byggSak = (): SakProps => {
        const alle = sorterteBehandlinger();

        return {
            ...sakMedInnvilgetVedtak(VEDTAKSPERIODE),
            førsteDagSomGirRett: VEDTAKSPERIODE.fraOgMed,
            sisteDagSomGirRett: VEDTAKSPERIODE.tilOgMed,
            meldeperiodeKjeder: [byggKjede()],
            meldekortbehandlinger: Object.fromEntries(
                alle.map((behandling) => [behandling.id, medKommandoer(behandling)]),
            ),
            åpneBehandlinger: alle
                .filter((behandling) => !behandling.erAvsluttet)
                .map((behandling) => ({ id: behandling.id, type: ÅpenBehandlingType.MELDEKORT })),
            meldekortvedtak,
        };
    };

    const hentBehandling = (id: string) => behandlinger.get(id as MeldekortbehandlingId) ?? null;

    /** Oppdaterer en behandling og svarer med hele saken, slik backend gjør */
    const oppdaterOgSvar = (
        id: string,
        oppdater: (behandling: MeldekortbehandlingProps) => Partial<MeldekortbehandlingProps>,
    ) => {
        const behandling = hentBehandling(id);
        if (!behandling) {
            return HttpResponse.json(
                { melding: 'Fant ikke meldekortbehandlingen', kode: 'fant_ikke_behandling' },
                { status: 404 },
            );
        }
        behandlinger.set(behandling.id, { ...behandling, ...oppdater(behandling) });
        return HttpResponse.json(byggSak());
    };

    const handlere = [
        http.post('*/sak/:sakId/meldekort/opprettBehandling', async ({ request }) => {
            const body = (await request.json()) as { kjedeIder: string[] };
            requester.opprett.push(body);

            const erKorrigering = behandlinger.size > 0;
            const id = `meldekort_ny_${behandlinger.size + 1}` as MeldekortbehandlingId;
            const tidspunkt = nyttTidspunkt();
            const forrigeDager = sisteGodkjente()?.meldeperioder.at(0)?.dager;

            const nyBehandling = lagMeldekortbehandling({
                id,
                type: erKorrigering
                    ? MeldeperiodebehandlingType.KORRIGERING
                    : MeldeperiodebehandlingType.FØRSTE_BEHANDLING,
                dager: forrigeDager ?? ikkeBesvarteDager(),
                saksbehandler: innlogget.navIdent,
                opprettet: tidspunkt,
                sistEndret: tidspunkt,
            });

            // En ny behandling er ikke beregnet før den er lagret
            const uberegnet: MeldekortbehandlingProps = {
                ...nyBehandling,
                meldeperioder: nyBehandling.meldeperioder.map((meldeperiode) => ({
                    ...meldeperiode,
                    beregning: null,
                })),
                simulertBeregning: null,
            };

            behandlinger.set(id, uberegnet);
            return HttpResponse.json(medKommandoer(uberegnet));
        }),
        http.post('*/sak/:sakId/meldekort/:id/oppdater', async ({ request, params }) => {
            const body = (await request.json()) as OppdaterMeldekortbehandlingDTO;
            requester.oppdater.push(body);

            return oppdaterOgSvar(params.id as string, (behandling) => {
                const tidspunkt = nyttTidspunkt();
                const dager = body.meldeperioder[0]?.dager ?? [];
                const beregning = lagMeldeperiodeBeregning(behandling.id, dager);
                const forrigeBeregning = sisteGodkjente()?.meldeperioder.at(0)?.beregning ?? null;

                return {
                    meldeperioder: behandling.meldeperioder.map((meldeperiode) => ({
                        ...meldeperiode,
                        dager,
                        beregning,
                    })),
                    simulertBeregning: lagSimulertBeregning(beregning, tidspunkt, forrigeBeregning),
                    skalSendeVedtaksbrev: body.skalSendeVedtaksbrev,
                    skalJournalføreNotat: body.skalJournalføreNotat,
                    begrunnelse: ikkeSladdet(body.begrunnelse),
                    tekstTilVedtaksbrev: ikkeSladdet(body.tekstTilVedtaksbrev),
                    sistEndret: tidspunkt,
                };
            });
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/oppdaterSimulering', ({ params }) => {
            requester.oppdaterSimulering.push(params.behandlingId as string);

            return oppdaterOgSvar(params.behandlingId as string, (behandling) => ({
                simulertBeregning: behandling.simulertBeregning && {
                    ...behandling.simulertBeregning,
                    simuleringstidspunkt: nyttTidspunkt(),
                    simuleringsdato: null,
                    simuleringTotalBeløp: null,
                    simulerteBeløp: null,
                    simuleringResultat: SimuleringResultat.INGEN_ENDRING,
                },
            }));
        }),
        http.post('*/sak/:sakId/meldekort/:id/sendtilbeslutning', ({ params }) => {
            requester.sendTilBeslutning.push(params.id as string);

            return oppdaterOgSvar(params.id as string, () => ({
                status: MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING,
                sistEndret: nyttTidspunkt(),
            }));
        }),
        http.post('*/sak/:sakId/meldekort/:id/ta', ({ params }) => {
            requester.ta.push(params.id as string);

            return oppdaterOgSvar(params.id as string, (behandling) =>
                behandling.status === MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING
                    ? {
                          status: MeldekortbehandlingStatus.UNDER_BESLUTNING,
                          beslutter: innlogget.navIdent,
                      }
                    : {
                          status: MeldekortbehandlingStatus.UNDER_BEHANDLING,
                          saksbehandler: innlogget.navIdent,
                      },
            );
        }),
        http.post('*/sak/:sakId/meldekort/:id/iverksett', ({ params }) => {
            requester.iverksett.push(params.id as string);

            return oppdaterOgSvar(params.id as string, (behandling) => {
                const tidspunkt = nyttTidspunkt();
                meldekortvedtak.push({
                    id: `vedtak_meldekort_${meldekortvedtak.length + 1}`,
                    sakId: SAK_ID,
                    meldekortId: behandling.id,
                    opprettet: tidspunkt,
                    journalpostId: null,
                });

                return {
                    status: MeldekortbehandlingStatus.GODKJENT,
                    erAvsluttet: true,
                    godkjentTidspunkt: tidspunkt,
                    sistEndret: tidspunkt,
                    utbetalingsstatus: Utbetalingsstatus.IKKE_SENDT_TIL_HELVED,
                    attesteringer: [
                        ...behandling.attesteringer,
                        {
                            status: Attesteringsstatus.GODKJENT,
                            begrunnelse: ikkeSladdet(null),
                            endretAv: innlogget.navIdent,
                            endretTidspunkt: tidspunkt,
                        },
                    ],
                };
            });
        }),
        http.post('*/sak/:sakId/meldekort/:id/underkjenn', async ({ request, params }) => {
            const body = (await request.json()) as { begrunnelse: string };
            requester.underkjenn.push(body);

            return oppdaterOgSvar(params.id as string, (behandling) => {
                const tidspunkt = nyttTidspunkt();
                return {
                    status: MeldekortbehandlingStatus.UNDER_BEHANDLING,
                    sistEndret: tidspunkt,
                    attesteringer: [
                        ...behandling.attesteringer,
                        {
                            status: Attesteringsstatus.SENDT_TILBAKE,
                            begrunnelse: ikkeSladdet(body.begrunnelse),
                            endretAv: innlogget.navIdent,
                            endretTidspunkt: tidspunkt,
                        },
                    ],
                };
            });
        }),
        http.patch('*/sak/:sakId/meldekort/:id/vent', async ({ request, params }) => {
            const body = (await request.json()) as VentRequest;
            requester.vent.push(body);

            return oppdaterOgSvar(params.id as string, (behandling) => {
                const varUnderBeslutning =
                    behandling.status === MeldekortbehandlingStatus.UNDER_BESLUTNING;
                return {
                    status: varUnderBeslutning
                        ? MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING
                        : MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING,
                    ...(varUnderBeslutning ? { beslutter: null } : { saksbehandler: null }),
                    ventestatus: [
                        {
                            sattPåVentAv: innlogget.navIdent,
                            tidspunkt: nyttTidspunkt(),
                            begrunnelse: ikkeSladdet(body.begrunnelse),
                            erSattPåVent: true,
                            frist: body.frist,
                            status: behandling.status,
                        },
                        ...behandling.ventestatus,
                    ],
                };
            });
        }),
        http.patch('*/sak/:sakId/meldekort/:id/gjenoppta', ({ params }) => {
            requester.gjenoppta.push(params.id as string);

            return oppdaterOgSvar(params.id as string, (behandling) => {
                const varTilBeslutning =
                    behandling.status === MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING;
                return {
                    status: varTilBeslutning
                        ? MeldekortbehandlingStatus.UNDER_BESLUTNING
                        : MeldekortbehandlingStatus.UNDER_BEHANDLING,
                    ...(varTilBeslutning
                        ? { beslutter: innlogget.navIdent }
                        : { saksbehandler: innlogget.navIdent }),
                    ventestatus: [
                        {
                            sattPåVentAv: innlogget.navIdent,
                            tidspunkt: nyttTidspunkt(),
                            begrunnelse: ikkeSladdet(''),
                            erSattPåVent: false,
                            frist: null,
                            status: behandling.status,
                        },
                        ...behandling.ventestatus,
                    ],
                };
            });
        }),
        // Saken hentes på nytt (SSR) ved hver sidevisning, og skal alltid gjenspeile tilstanden
        http.get('*/sak/:saksnummer', () => HttpResponse.json(byggSak())),
    ];

    /** Gjeldende tilstand for en behandling i den falske backenden, for å verifisere i testene */
    const hentLagretBehandling = (id: string): MeldekortbehandlingProps => {
        const behandling = hentBehandling(id);
        if (!behandling) {
            throw new Error(`Fant ikke meldekortbehandling ${id} i den falske backenden`);
        }
        return behandling;
    };

    return { handlere, requester, hentBehandling: hentLagretBehandling };
};

/** 2025-01-06 -> 06.01.2025 */
export const formaterDato = (dato: string) => dato.split('-').toReversed().join('.');

/** Statusvelgeren for en dag i utfyllingen av meldeperioden */
export const dagStatus = (page: Page, dato: string) =>
    page
        .getByRole('row')
        .filter({ hasText: formaterDato(dato) })
        .getByLabel('Velg status for dag');

/** Raden med et beregnet beløp, f.eks. "Totalt beløp", i steget som vises nå */
export const beløpRad = (page: Page, tekst: string) =>
    page.getByText(tekst, { exact: true }).filter({ visible: true }).locator('..');

/**
 * Går til et steg i stepperen og venter til steget er aktivt. Steget leses fra hashen i URL-en
 * via Next-routeren. I Firefox under høy last hender det at hashen endres uten at steget byttes,
 * så klikket prøves på nytt til steget er aktivt.
 */
export const gåTilSteg = async (page: Page, steg: RegExp) => {
    const lenke = page.getByRole('link', { name: steg });
    await expect(async () => {
        await lenke.click();
        await expect(lenke).toHaveAttribute('aria-current', 'step', { timeout: 2_000 });
    }).toPass();
};

export const velgIMeny = async (page: Page, valg: string) => {
    await page.getByRole('button', { name: 'Meny' }).click();
    await page.getByRole('menuitem', { name: valg }).click();
};

/** Beløp formateres med (hardt) mellomrom som tusenskille */
export const beløpRegex = (beløp: number) =>
    new RegExp(String(beløp).replace(/\B(?=(\d{3})+(?!\d))/g, '\\s?'));
