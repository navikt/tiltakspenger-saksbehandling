import { http, HttpResponse } from '../felles/e2eFelles';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { periode, rammevedtak, sak, søknad } from '~test/rammebehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import type { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import type {
    OppdaterSøknadsbehandlingDTO,
    Søknadsbehandling,
    SøknadsbehandlingAvslag,
    SøknadsbehandlingIkkeValgt,
    SøknadsbehandlingInnvilgelse,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import type { InnvilgbarSøknad, SøknadBarn, Spørsmålsbesvarelser } from '~/lib/søknad/søknadTyper';
import type { SakId, SakProps } from '~/lib/sak/SakTyper';
import type { Periode } from '~/types/Periode';

/**
 * Testdata og en stateful falsk backend for søknadsbehandlingsflyten. Id-ene matcher standardverdiene
 * fra byggerne i `~test/rammebehandling` (sak_1 / beh_1 / 202501011001).
 */

export const SAKSNUMMER = '202501011001';
export const SAK_ID: SakId = 'sak_1';
export const BEHANDLING_ID: RammebehandlingId = 'beh_1';

export const behandlingssideUrl = `/sak/${SAKSNUMMER}/behandling/${BEHANDLING_ID}`;
export const personoversiktUrl = `/sak/${SAKSNUMMER}`;

/** Kommandoene backend gir saksbehandleren som eier en behandling under behandling. */
export const saksbehandlersKommandoer: SaksbehandlerBehandlingKommando[] = [
    SaksbehandlerBehandlingKommando.Saksbehandle,
    SaksbehandlerBehandlingKommando.LeggTilbakeSaksbehandler,
    SaksbehandlerBehandlingKommando.SettPåVent,
    SaksbehandlerBehandlingKommando.Avbryt,
];

/** Kommandoene backend gir beslutteren som er tildelt en behandling under beslutning. */
export const beslutterensKommandoer: SaksbehandlerBehandlingKommando[] = [
    SaksbehandlerBehandlingKommando.Beslutte,
    SaksbehandlerBehandlingKommando.LeggTilbakeBeslutter,
    SaksbehandlerBehandlingKommando.SettPåVent,
];

const lagSvar = (harSøktOmBarnetillegg: boolean): Spørsmålsbesvarelser => {
    const neiPeriode = { svar: 'NEI' as const, periode: null };

    return {
        harSøktPåTiltak: { svar: 'JA' },
        harSøktOmBarnetillegg: { svar: harSøktOmBarnetillegg ? 'JA' : 'NEI' },
        kvp: neiPeriode,
        intro: neiPeriode,
        institusjon: neiPeriode,
        sykepenger: neiPeriode,
        etterlønn: { svar: 'NEI' },
        alderspensjon: { svar: 'NEI', fraOgMed: null },
        gjenlevendepensjon: neiPeriode,
        supplerendeStønadAlder: neiPeriode,
        supplerendeStønadFlyktning: neiPeriode,
        trygdOgPensjon: neiPeriode,
        jobbsjansen: neiPeriode,
    };
};

/** Søknad for 2025-01-01 - 2025-06-30, med utfylte svar slik at oppsummeringen av søknaden kan vises. */
export const lagSøknad = (barn: SøknadBarn[] = []): InnvilgbarSøknad => ({
    ...søknad(barn),
    svar: lagSvar(barn.length > 0),
});

/** Saken slik backend returnerer den, med behandlingen som åpen behandling inntil den er vedtatt. */
export const lagSak = (behandling: Søknadsbehandling): SakProps => {
    if (behandling.status !== Rammebehandlingsstatus.VEDTATT) {
        return sak({
            rammebehandlinger: [behandling],
            åpneBehandlinger: [{ id: behandling.id, type: ÅpenBehandlingType.SØKNADSBEHANDLING }],
        });
    }

    const vedtaksperiode = behandling.vedtaksperiode ?? periode('2025-01-01', '2025-06-30');
    const erInnvilgelse = behandling.resultat === SøknadsbehandlingResultat.INNVILGELSE;
    const innvilgetPerioder = erInnvilgelse ? [vedtaksperiode] : [];

    const vedtak = rammevedtak('vedtak_1', vedtaksperiode, {
        behandlingId: behandling.id,
        resultat: behandling.resultat,
        saksbehandler: behandling.saksbehandler ?? 'Ukjent',
        beslutter: behandling.beslutter ?? 'Ukjent',
        opprinneligInnvilgetPerioder: innvilgetPerioder,
        gjeldendeInnvilgetPerioder: innvilgetPerioder,
    });

    const tidslinjeElementer = erInnvilgelse
        ? [
              {
                  rammevedtakId: vedtak.id,
                  periode: vedtaksperiode,
                  tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
              },
          ]
        : [];

    return sak({
        rammebehandlinger: [behandling],
        alleRammevedtak: [vedtak],
        tidslinje: { elementer: tidslinjeElementer },
        innvilgetTidslinje: { elementer: tidslinjeElementer },
    });
};

// ISO-datoer kan sammenlignes som tekst. Utils i appen importeres ikke, siden de drar med dayjs-plugins
// som Playwright sin modul-laster ikke finner.
const totalPeriode = (perioder: Periode[]): Periode => ({
    fraOgMed: perioder.map((p) => p.fraOgMed).sort()[0],
    tilOgMed: perioder
        .map((p) => p.tilOgMed)
        .sort()
        .reverse()[0],
});

// Fjerner feltene som hører til et bestemt resultat, slik at de ikke henger igjen når resultatet endres.
const utenResultatfelter = (
    behandling: Søknadsbehandling,
): Omit<SøknadsbehandlingIkkeValgt, 'resultat'> => {
    const kopi: Omit<SøknadsbehandlingIkkeValgt, 'resultat'> &
        Partial<
            Record<
                | 'resultat'
                | keyof Pick<SøknadsbehandlingInnvilgelse, 'innvilgelsesperioder' | 'barnetillegg'>
                | keyof Pick<SøknadsbehandlingAvslag, 'avslagsgrunner'>,
                unknown
            >
        > = { ...behandling };
    delete kopi.resultat;
    delete kopi.innvilgelsesperioder;
    delete kopi.barnetillegg;
    delete kopi.avslagsgrunner;
    return kopi;
};

/** Oppdaterer behandlingen med det saksbehandler lagret, slik backend gjør i `/oppdater`. */
const oppdaterBehandling = (
    behandling: Søknadsbehandling,
    dto: OppdaterSøknadsbehandlingDTO,
    sistEndret: string,
): Søknadsbehandling => {
    const felles = {
        ...utenResultatfelter(behandling),
        begrunnelseVilkårsvurdering: ikkeSladdet(dto.begrunnelseVilkårsvurdering),
        fritekstTilVedtaksbrev: ikkeSladdet(dto.fritekstTilVedtaksbrev),
        skalJournalføreNotat: dto.skalJournalføreNotat,
        prioritering: dto.prioritering
            ? { begrunnelse: ikkeSladdet(dto.prioritering.begrunnelse) }
            : null,
        sistEndret,
    };

    switch (dto.resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE:
            return {
                ...felles,
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                søknad: behandling.søknad as InnvilgbarSøknad,
                vedtaksperiode: totalPeriode(dto.innvilgelsesperioder.map((p) => p.periode)),
                innvilgelsesperioder: dto.innvilgelsesperioder,
                barnetillegg: {
                    perioder: dto.barnetillegg.perioder,
                    begrunnelse: ikkeSladdet(dto.barnetillegg.begrunnelse),
                },
                skalSendeVedtaksbrev: dto.skalSendeVedtaksbrev,
            };
        case SøknadsbehandlingResultat.AVSLAG:
            return {
                ...felles,
                resultat: SøknadsbehandlingResultat.AVSLAG,
                vedtaksperiode: behandling.søknad.tiltaksdeltakelseperiodeDetErSøktOm,
                avslagsgrunner: dto.avslagsgrunner,
                skalSendeVedtaksbrev: dto.skalSendeVedtaksbrev,
            };
        case SøknadsbehandlingResultat.IKKE_VALGT:
            return {
                ...felles,
                resultat: SøknadsbehandlingResultat.IKKE_VALGT,
                vedtaksperiode: null,
            };
    }
};

export type TaBehandlingRequest = {
    behandlinger: Array<{ behandlingId: RammebehandlingId; sakId: SakId }>;
    returnerSaker: boolean;
};

/** Kallene den falske backenden har mottatt, slik at testene kan verifisere request-bodyene. */
export type MottatteKall = {
    oppdater: OppdaterSøknadsbehandlingDTO[];
    sendTilBeslutning: number;
    ta: TaBehandlingRequest[];
    iverksett: number;
    underkjenn: Array<{ begrunnelse: string }>;
};

/**
 * En stateful falsk backend for én søknadsbehandling. Handlerne muterer behandlingen slik backend gjør,
 * og GET-kallet for saken returnerer alltid siste tilstand.
 *
 * @param beslutterIdent navIdent til beslutteren som tar behandlingen via `/behandlinger/ta`
 */
export const lagSøknadsbehandlingBackend = (
    initiellBehandling: Søknadsbehandling,
    beslutterIdent: string,
) => {
    let behandling = initiellBehandling;
    let antallEndringer = 0;

    const kall: MottatteKall = {
        oppdater: [],
        sendTilBeslutning: 0,
        ta: [],
        iverksett: 0,
        underkjenn: [],
    };

    const nyttTidspunkt = () => {
        antallEndringer += 1;
        return `2025-01-02T10:${String(antallEndringer).padStart(2, '0')}:00`;
    };

    const handlere = [
        http.post('*/sak/:sakId/behandling/:behandlingId/oppdater', async ({ request }) => {
            const body = (await request.json()) as OppdaterSøknadsbehandlingDTO;
            kall.oppdater.push(body);

            behandling = oppdaterBehandling(behandling, body, nyttTidspunkt());

            return HttpResponse.json(behandling);
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/sendtilbeslutning', () => {
            kall.sendTilBeslutning += 1;

            behandling = {
                ...behandling,
                status: Rammebehandlingsstatus.KLAR_TIL_BESLUTNING,
                sistEndret: nyttTidspunkt(),
                gyldigeKommandoer: [SaksbehandlerBehandlingKommando.AngreSendTilBeslutning],
            };

            return HttpResponse.json(behandling);
        }),
        http.post('*/behandlinger/ta', async ({ request }) => {
            const body = (await request.json()) as TaBehandlingRequest;
            kall.ta.push(body);

            behandling = {
                ...behandling,
                status: Rammebehandlingsstatus.UNDER_BESLUTNING,
                beslutter: beslutterIdent,
                sistEndret: nyttTidspunkt(),
                gyldigeKommandoer: beslutterensKommandoer,
            };

            return HttpResponse.json({
                behandlinger: [{ behandlingId: behandling.id, saksnummer: behandling.saksnummer }],
                saker: [lagSak(behandling)],
            });
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/iverksett', () => {
            kall.iverksett += 1;

            const tidspunkt = nyttTidspunkt();

            behandling = {
                ...behandling,
                status: Rammebehandlingsstatus.VEDTATT,
                rammevedtakId: 'vedtak_1',
                iverksattTidspunkt: tidspunkt,
                sistEndret: tidspunkt,
                attesteringer: [
                    ...behandling.attesteringer,
                    {
                        status: Attesteringsstatus.GODKJENT,
                        begrunnelse: ikkeSladdet(null),
                        endretAv: beslutterIdent,
                        endretTidspunkt: tidspunkt,
                    },
                ],
                gyldigeKommandoer: [],
            };

            return HttpResponse.json(behandling);
        }),
        http.post('*/sak/:sakId/behandling/:behandlingId/underkjenn', async ({ request }) => {
            const body = (await request.json()) as { begrunnelse: string };
            kall.underkjenn.push(body);

            const tidspunkt = nyttTidspunkt();

            behandling = {
                ...behandling,
                status: Rammebehandlingsstatus.UNDER_BEHANDLING,
                sistEndret: tidspunkt,
                attesteringer: [
                    ...behandling.attesteringer,
                    {
                        status: Attesteringsstatus.SENDT_TILBAKE,
                        begrunnelse: ikkeSladdet(body.begrunnelse),
                        endretAv: beslutterIdent,
                        endretTidspunkt: tidspunkt,
                    },
                ],
                gyldigeKommandoer: [],
            };

            return HttpResponse.json(behandling);
        }),
        http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSak(behandling))),
    ];

    return {
        hentBehandling: () => behandling,
        kall,
        handlere,
    };
};
