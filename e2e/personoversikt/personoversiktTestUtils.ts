import { BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import type { Klagebehandling } from '~/lib/klage/typer/Klage';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import type { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiodekjede';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import type { SakProps } from '~/lib/sak/SakTyper';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import {
    TilbakekrevingBehandlingsstatus,
    type TilbakekrevingBehandling,
} from '~/lib/tilbakekreving/typer/Tilbakekreving';
import {
    periode,
    revurderingStans,
    sakMedInnvilgetVedtak,
    søknadsbehandlingIkkeValgt,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { SAKSBEHANDLER_IDENT } from '../felles/e2eFelles';
import { klageTestUtils } from '../klage/klageTestUtils';

export const SAKSNUMMER = tilSaksnummer('202501011001');
export const SAK_ID = 'sak_1';

export const VEDTAKSPERIODE = periode('2025-01-01', '2025-03-31');

/** Åpen søknadsbehandling som innlogget saksbehandler eier, og som kan avsluttes */
export const lagÅpenSøknadsbehandling = () =>
    søknadsbehandlingIkkeValgt({
        id: 'beh_apen',
        saksbehandler: SAKSBEHANDLER_IDENT,
        opprettet: '2025-04-01T10:00:00',
        gyldigeKommandoer: [
            SaksbehandlerBehandlingKommando.Saksbehandle,
            SaksbehandlerBehandlingKommando.Avbryt,
        ],
    });

/** Åpen revurdering som ingen har tatt, og som innlogget kun kan tildele seg */
export const lagÅpenRevurdering = () =>
    revurderingStans({
        id: 'beh_revurdering',
        status: Rammebehandlingsstatus.KLAR_TIL_BEHANDLING,
        saksbehandler: null,
        opprettet: '2025-04-02T10:00:00',
        gyldigeKommandoer: [SaksbehandlerBehandlingKommando.TildelSaksbehandler],
    });

export const lagAvbruttSøknadsbehandling = () =>
    søknadsbehandlingIkkeValgt({
        id: 'beh_avbrutt',
        status: Rammebehandlingsstatus.AVBRUTT,
        saksbehandler: 'Z999999',
        opprettet: '2025-02-01T10:00:00',
        avbrutt: {
            avbruttAv: 'Z999999',
            avbruttTidspunkt: '2025-02-10T12:30:00',
            begrunnelse: ikkeSladdet('Duplikat søknad'),
        },
    });

export const lagKlage = (): Klagebehandling => ({
    ...klageTestUtils.lagInitiellKlage(),
    id: 'klage_apen',
    sakId: SAK_ID,
    saksnummer: SAKSNUMMER,
    opprettet: '2025-04-03T10:00:00',
});

export const lagTilbakekreving = (
    overstyringer: Partial<TilbakekrevingBehandling> = {},
): TilbakekrevingBehandling => ({
    id: 'tilbakekreving_aktiv',
    sakId: SAK_ID,
    utbetalingId: 'utbetaling_1',
    beregningKilde: { id: 'beh_vedtatt', type: BeregningKildeType.RAMMEBEHANDLING },
    tilbakeBehandlingId: 'tilbake_1',
    opprettet: '2025-04-04T10:00:00',
    sistEndret: '2025-04-05T10:00:00',
    status: TilbakekrevingBehandlingsstatus.TIL_BEHANDLING,
    url: null,
    kravgrunnlagTotalPeriode: periode('2025-01-06', '2025-01-19'),
    totaltFeilutbetaltBeløp: 5000,
    varselSendt: null,
    saksbehandler: null,
    beslutter: null,
    gyldigeKommandoer: [],
    venter: null,
    ...overstyringer,
});

export const lagMeldeperiodekjede = (): MeldeperiodekjedeProps => {
    const kjedePeriode = periode('2025-01-06', '2025-01-19');
    const kjedeId = '2025-01-06/2025-01-19' as const;

    return {
        id: kjedeId,
        periode: kjedePeriode,
        tiltaksnavn: ['Arbeidsmarkedsopplæring'],
        sisteMeldeperiode: {
            id: 'meldeperiode_1',
            versjon: 1,
            kjedeId,
            periode: kjedePeriode,
            opprettet: '2025-01-05T10:00:00',
            antallDager: 10,
            girRett: {},
            ingenDagerGirRett: false,
        },
        meldekortbehandlingIder: [],
        meldekortbehandlingStatus: null,
        brukersMeldekort: [],
        brukersMeldekortStatus: BrukersMeldekortKjedeStatus.IKKE_MOTTATT,
        gjeldendeBeregning: null,
        kanIkkeBehandlesGrunn: null,
        åpenBehandlingId: null,
    };
};

/**
 * Sak med litt av alt: et innvilget vedtak, to åpne rammebehandlinger, en avsluttet behandling,
 * en åpen klage, en aktiv og en avsluttet tilbakekreving og en meldeperiodekjede.
 */
export const lagSakMedBlandetInnhold = (): SakProps => {
    const basis = sakMedInnvilgetVedtak(VEDTAKSPERIODE);
    const åpenSøknadsbehandling = lagÅpenSøknadsbehandling();
    const åpenRevurdering = lagÅpenRevurdering();
    const klage = lagKlage();
    const aktivTilbakekreving = lagTilbakekreving();

    return {
        ...basis,
        rammebehandlinger: [
            ...basis.rammebehandlinger,
            åpenSøknadsbehandling,
            åpenRevurdering,
            lagAvbruttSøknadsbehandling(),
        ],
        åpneBehandlinger: [
            { id: åpenSøknadsbehandling.id, type: ÅpenBehandlingType.SØKNADSBEHANDLING },
            { id: åpenRevurdering.id, type: ÅpenBehandlingType.REVURDERING },
            { id: klage.id, type: ÅpenBehandlingType.KLAGE },
            { id: aktivTilbakekreving.id, type: ÅpenBehandlingType.TILBAKEKREVING },
        ],
        klagebehandlinger: [klage],
        tilbakekrevinger: [
            aktivTilbakekreving,
            lagTilbakekreving({
                id: 'tilbakekreving_avsluttet',
                status: TilbakekrevingBehandlingsstatus.AVSLUTTET,
                totaltFeilutbetaltBeløp: 1200,
                saksbehandler: 'Z111111',
                beslutter: 'Z222222',
            }),
        ],
        meldeperiodeKjeder: [lagMeldeperiodekjede()],
    };
};
