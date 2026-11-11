import {
    omgjøringIkkeValgt,
    omgjøringInnvilgelse,
    omgjøringOpphør,
    lagretInnvilgelsesperiode,
    periode,
    revurderingInnvilgelse,
    revurderingStans,
    sakMedInnvilgetVedtak,
    søknad,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    Rammebehandlingsstatus,
    type OppdaterBehandlingDTO,
    type RammebehandlingId,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    HjemmelForStans,
    RevurderingResultat,
    type OmgjørRammevedtak,
    type Revurdering,
    type StartRevurderingDTO,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    Omgjøringsgrad,
    RammevedtakKommandoType,
    type VedtakId,
} from '~/lib/rammebehandling/typer/Rammevedtak';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import type { SakId, SakProps } from '~/lib/sak/SakTyper';
import type { Periode } from '~/types/Periode';
import type { InnvilgbarSøknad, Spørsmålsbesvarelser } from '~/lib/søknad/søknadTyper';
import { BESLUTTER_IDENT, http, HttpResponse, SAKSBEHANDLER_IDENT } from '../felles/e2eFelles';
import { Tidspunkt, tilTidspunkt } from '~/types/DatoTid';

export const SAKSNUMMER = '202501011001';
export const SAK_ID: SakId = 'sak_1';
export const VEDTAK_ID: VedtakId = 'vedtak_1';
export const REVURDERING_ID: RammebehandlingId = 'beh_revurdering';

/** Det innvilgede vedtaket på saken. Tiltaksdeltakelsen i saksopplysningene varer til 2025-06-30. */
export const VEDTAKSPERIODE: Periode = periode('2025-01-01', '2025-03-31');
export const FØRSTE_DAG_SOM_GIR_RETT = VEDTAKSPERIODE.fraOgMed;
export const SISTE_DAG_SOM_GIR_RETT = VEDTAKSPERIODE.tilOgMed;

export const behandlingUrl = `/sak/${SAKSNUMMER}/behandling/${REVURDERING_ID}`;
export const personoversiktUrl = `/sak/${SAKSNUMMER}`;

const nei = { svar: 'NEI' as const };
const neiPeriode = { svar: 'NEI' as const, periode: null };

// Søknaden vises i saksopplysningene på behandlingssiden, så den må ha besvarte spørsmål
const søknadMedSvar = (): InnvilgbarSøknad => ({
    ...søknad(),
    svar: {
        harSøktPåTiltak: { svar: 'JA' },
        harSøktOmBarnetillegg: nei,
        kvp: neiPeriode,
        intro: neiPeriode,
        institusjon: neiPeriode,
        sykepenger: neiPeriode,
        etterlønn: nei,
        alderspensjon: { svar: 'NEI', fraOgMed: null },
        gjenlevendepensjon: neiPeriode,
        supplerendeStønadAlder: neiPeriode,
        supplerendeStønadFlyktning: neiPeriode,
        trygdOgPensjon: neiPeriode,
        jobbsjansen: neiPeriode,
    } satisfies Spørsmålsbesvarelser,
});

/** Sak med ett innvilget vedtak, som kan omgjøres, og eventuelt en revurdering. */
export const lagSak = (revurdering: Revurdering | null): SakProps => {
    const sak = sakMedInnvilgetVedtak(VEDTAKSPERIODE, {
        søknadsbehandling: søknadsbehandlingInnvilgelse({
            id: 'beh_vedtatt',
            status: Rammebehandlingsstatus.VEDTATT,
            iverksattTidspunkt: tilTidspunkt('2025-01-01T09:00:00'),
            søknad: søknadMedSvar(),
            vedtaksperiode: VEDTAKSPERIODE,
            innvilgelsesperioder: [lagretInnvilgelsesperiode(VEDTAKSPERIODE)],
        }),
        vedtak: {
            gyldigeKommandoer: {
                OMGJØR: {
                    type: RammevedtakKommandoType.OMGJØR,
                    perioderSomKanOmgjøres: [VEDTAKSPERIODE],
                },
            },
        },
    });

    return {
        ...sak,
        førsteDagSomGirRett: FØRSTE_DAG_SOM_GIR_RETT,
        sisteDagSomGirRett: SISTE_DAG_SOM_GIR_RETT,
        rammebehandlinger: revurdering
            ? [...sak.rammebehandlinger, revurdering]
            : sak.rammebehandlinger,
    };
};

const saksbehandlersKommandoer = [
    SaksbehandlerBehandlingKommando.Saksbehandle,
    SaksbehandlerBehandlingKommando.LeggTilbakeSaksbehandler,
    SaksbehandlerBehandlingKommando.SettPåVent,
    SaksbehandlerBehandlingKommando.Avbryt,
];

const omgjørHeleVedtaket = (): OmgjørRammevedtak[] => [
    { vedtakId: VEDTAK_ID, periode: VEDTAKSPERIODE, omgjøringsgrad: Omgjøringsgrad.HELT },
];

/** Revurderingen slik backenden oppretter den ved `POST /sak/{sakId}/revurdering/start`. */
export const lagStartetRevurdering = (body: StartRevurderingDTO): Revurdering => {
    const felles = {
        id: REVURDERING_ID,
        saksbehandler: SAKSBEHANDLER_IDENT,
        gyldigeKommandoer: saksbehandlersKommandoer,
    };

    switch (body.revurderingType) {
        case RevurderingResultat.STANS:
            return revurderingStans(felles);
        case RevurderingResultat.INNVILGELSE:
            return revurderingInnvilgelse(felles);
        case RevurderingResultat.OMGJØRING:
            return omgjøringIkkeValgt({
                ...felles,
                omgjørRammevedtak: body.rammevedtakIdSomOmgjøres ? omgjørHeleVedtaket() : [],
            });
    }

    throw Error(`Testen støtter ikke å starte revurdering av type ${body.revurderingType}`);
};

const totalPeriode = (perioder: Periode[]): Periode => {
    const fraOgMed = perioder
        .map((p) => p.fraOgMed)
        .toSorted()
        .at(0);
    const tilOgMed = perioder
        .map((p) => p.tilOgMed)
        .toSorted()
        .at(-1);
    if (!fraOgMed || !tilOgMed) {
        throw Error('Kan ikke lage totalperiode uten perioder');
    }
    return { fraOgMed, tilOgMed };
};

/** Speiler hvordan backenden lagrer `POST /sak/{sakId}/behandling/{id}/oppdater` for en revurdering. */
const lagreRevurdering = (
    gjeldende: Revurdering,
    body: OppdaterBehandlingDTO,
    sistEndret: Tidspunkt,
): Revurdering => {
    const felles = {
        id: gjeldende.id,
        status: gjeldende.status,
        saksbehandler: gjeldende.saksbehandler,
        beslutter: gjeldende.beslutter,
        gyldigeKommandoer: gjeldende.gyldigeKommandoer,
        begrunnelseVilkårsvurdering: ikkeSladdet(body.begrunnelseVilkårsvurdering),
        fritekstTilVedtaksbrev: ikkeSladdet(body.fritekstTilVedtaksbrev),
        skalJournalføreNotat: body.skalJournalføreNotat,
        sistEndret,
        saksopplysninger: gjeldende.saksopplysninger,
        innvilgbarePerioder: gjeldende.innvilgbarePerioder,
        perioderForReversertOpphør: gjeldende.perioderForReversertOpphør,
    };

    switch (body.resultat) {
        case RevurderingResultat.STANS:
            return revurderingStans({
                ...felles,
                skalSendeVedtaksbrev: body.skalSendeVedtaksbrev,
                valgtHjemmelHarIkkeRettighet: body.valgteHjemler,
                harValgtStansFraFørsteDagSomGirRett: body.harValgtStansFraFørsteDagSomGirRett,
                vedtaksperiode: {
                    fraOgMed: body.stansFraOgMed ?? FØRSTE_DAG_SOM_GIR_RETT,
                    tilOgMed: SISTE_DAG_SOM_GIR_RETT,
                },
            });
        case RevurderingResultat.INNVILGELSE:
            return revurderingInnvilgelse({
                ...felles,
                skalSendeVedtaksbrev: body.skalSendeVedtaksbrev,
                innvilgelsesperioder: body.innvilgelsesperioder,
                barnetillegg: {
                    perioder: body.barnetillegg.perioder,
                    begrunnelse: ikkeSladdet(body.barnetillegg.begrunnelse),
                },
                vedtaksperiode: totalPeriode(body.innvilgelsesperioder.map((p) => p.periode)),
            });
        case RevurderingResultat.OMGJØRING:
            return omgjøringInnvilgelse({
                ...felles,
                skalSendeVedtaksbrev: body.skalSendeVedtaksbrev,
                omgjørRammevedtak: omgjørHeleVedtaket(),
                vedtaksperiode: body.vedtaksperiode,
                innvilgelsesperioder: body.innvilgelsesperioder,
                barnetillegg: {
                    perioder: body.barnetillegg.perioder,
                    begrunnelse: ikkeSladdet(body.barnetillegg.begrunnelse),
                },
            });
        case RevurderingResultat.OMGJØRING_OPPHØR:
            return omgjøringOpphør({
                ...felles,
                skalSendeVedtaksbrev: body.skalSendeVedtaksbrev,
                omgjørRammevedtak: omgjørHeleVedtaket(),
                vedtaksperiode: body.vedtaksperiode,
                valgteHjemler: body.valgteHjemler,
            });
        case RevurderingResultat.OMGJØRING_IKKE_VALGT:
            return omgjøringIkkeValgt({
                ...felles,
                omgjørRammevedtak:
                    'omgjørRammevedtak' in gjeldende ? gjeldende.omgjørRammevedtak : [],
            });
    }

    throw Error(`Testen støtter ikke å lagre resultat ${body.resultat} på en revurdering`);
};

type TaBehandlingBody = {
    behandlinger: { behandlingId: RammebehandlingId; sakId: SakId }[];
    returnerSaker: boolean;
};

/**
 * Stateful falsk backend for revurderingsflytene. Hvert kall endrer `tilstand.revurdering`, slik at
 * en ny sidevisning (SSR-henting av saken) gir samme tilstand som backenden ville gitt. Request-body
 * for kallene fanges opp, slik at testene kan verifisere dem.
 */
export const lagFalskBackend = (initiellRevurdering: Revurdering | null = null) => {
    const tilstand = {
        revurdering: initiellRevurdering,
        startBodies: [] as StartRevurderingDTO[],
        oppdaterBodies: [] as OppdaterBehandlingDTO[],
        antallSendTilBeslutning: 0,
        taBodies: [] as TaBehandlingBody[],
        antallIverksettinger: 0,
    };

    const finnRevurdering = (behandlingId: unknown) =>
        tilstand.revurdering?.id === behandlingId ? tilstand.revurdering : null;

    const ikkeFunnet = () =>
        HttpResponse.json(
            { melding: 'Fant ikke behandlingen', kode: 'ikke_funnet' },
            { status: 404 },
        );

    const handlere = [
        http.post('*/sak/:sakId/revurdering/start', async ({ request }) => {
            const body = (await request.json()) as StartRevurderingDTO;
            tilstand.startBodies.push(body);
            tilstand.revurdering = lagStartetRevurdering(body);
            return HttpResponse.json(tilstand.revurdering);
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/oppdater', async ({ request, params }) => {
            const gjeldende = finnRevurdering(params.behandlingId);
            if (!gjeldende) return ikkeFunnet();

            const body = (await request.json()) as OppdaterBehandlingDTO;
            tilstand.oppdaterBodies.push(body);
            // sistEndret må endres for at skjemaet skal lastes på nytt fra den lagrede behandlingen
            const sekund = String(tilstand.oppdaterBodies.length).padStart(2, '0');
            tilstand.revurdering = lagreRevurdering(
                gjeldende,
                body,
                tilTidspunkt(`2025-02-01T10:00:${sekund}`),
            );
            return HttpResponse.json(tilstand.revurdering);
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/sendtilbeslutning', ({ params }) => {
            const gjeldende = finnRevurdering(params.behandlingId);
            if (!gjeldende) return ikkeFunnet();

            tilstand.antallSendTilBeslutning += 1;
            tilstand.revurdering = {
                ...gjeldende,
                status: Rammebehandlingsstatus.KLAR_TIL_BESLUTNING,
                gyldigeKommandoer: [],
                sistEndret: tilTidspunkt('2025-02-02T10:00:00'),
            };
            return HttpResponse.json(tilstand.revurdering);
        }),
        http.post('*/behandlinger/ta', async ({ request }) => {
            const body = (await request.json()) as TaBehandlingBody;
            tilstand.taBodies.push(body);

            const gjeldende = finnRevurdering(body.behandlinger.at(0)?.behandlingId);
            if (!gjeldende) return ikkeFunnet();

            tilstand.revurdering = {
                ...gjeldende,
                status: Rammebehandlingsstatus.UNDER_BESLUTNING,
                beslutter: BESLUTTER_IDENT,
                gyldigeKommandoer: [
                    SaksbehandlerBehandlingKommando.Beslutte,
                    SaksbehandlerBehandlingKommando.LeggTilbakeBeslutter,
                ],
                sistEndret: tilTidspunkt('2025-02-03T10:00:00'),
            };
            return HttpResponse.json({
                behandlinger: [{ behandlingId: gjeldende.id, saksnummer: gjeldende.saksnummer }],
                saker: [lagSak(tilstand.revurdering)],
            });
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/iverksett', ({ params }) => {
            const gjeldende = finnRevurdering(params.behandlingId);
            if (!gjeldende) return ikkeFunnet();

            tilstand.antallIverksettinger += 1;
            tilstand.revurdering = {
                ...gjeldende,
                status: Rammebehandlingsstatus.VEDTATT,
                gyldigeKommandoer: [],
                iverksattTidspunkt: tilTidspunkt('2025-02-04T10:00:00'),
                sistEndret: tilTidspunkt('2025-02-04T10:00:00'),
            };
            return HttpResponse.json(tilstand.revurdering);
        }),
        http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSak(tilstand.revurdering))),
    ];

    return { tilstand, handlere };
};

/** En revurdering til stans som saksbehandler har sendt til beslutning, sett fra en beslutter. */
export const lagStansKlarTilBeslutning = () =>
    revurderingStans({
        id: REVURDERING_ID,
        status: Rammebehandlingsstatus.KLAR_TIL_BESLUTNING,
        saksbehandler: SAKSBEHANDLER_IDENT,
        beslutter: null,
        gyldigeKommandoer: [SaksbehandlerBehandlingKommando.TildelBeslutter],
        valgtHjemmelHarIkkeRettighet: [HjemmelForStans.DeltarIkkePåArbeidsmarkedstiltak],
        harValgtStansFraFørsteDagSomGirRett: false,
        vedtaksperiode: periode('2025-03-01', SISTE_DAG_SOM_GIR_RETT),
        begrunnelseVilkårsvurdering: ikkeSladdet('Bruker har sluttet på tiltaket.'),
        fritekstTilVedtaksbrev: ikkeSladdet('Du har sluttet på tiltaket.'),
    });
