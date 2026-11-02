import { describe, expect, test } from '@jest/globals';
import {
    hentGjeldendeRammevedtak,
    hentGjeldendeRammevedtakIPeriode,
    hentKlagebehandling,
    hentKlagevedtakMedBehandlinger,
    hentMeldekortbehandling,
    hentMeldekortvedtakMedBehandlinger,
    hentMeldeperiodekjede,
    hentRammebehandling,
    hentRammevedtak,
    hentRammevedtakMedBehandlinger,
    hentSøknad,
    hentSøknadsbehandlingerForSøknad,
    hentTilbakekreving,
    hentVedtatteSøknadsbehandlinger,
    hentÅpneMeldekortbehandlinger,
} from '~/lib/sak/sakUtils';
import {
    omgjøringInnvilgelse,
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sak,
    søknad,
    søknadsbehandlingAvslag,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { Periode } from '~/types/Periode';
import { VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { Klagevedtak } from '~/lib/klage/typer/Klagevedtak';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';

// Oppslagene bryr seg bare om id-ene, så resten av feltene utelates for typer uten testdatabyggere
const delvis = <T>(verdi: Partial<T>): T => verdi as T;

const tidslinjeElement = (rammevedtakId: VedtakId, p: Periode) => ({
    rammevedtakId,
    periode: p,
    tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
});

const vedtatt = { status: Rammebehandlingsstatus.VEDTATT };

describe('hentVedtatteSøknadsbehandlinger', () => {
    test('gir innvilgede søknadsbehandlinger med vedtak, nyeste iverksatte først', () => {
        const førsteInnvilgelse = søknadsbehandlingInnvilgelse({
            ...vedtatt,
            id: 'beh_1',
            iverksattTidspunkt: '2025-01-01T10:00:00',
        });
        const avslag = søknadsbehandlingAvslag({
            ...vedtatt,
            id: 'beh_2',
            iverksattTidspunkt: '2025-02-01T10:00:00',
        });
        const revurdering = revurderingInnvilgelse({
            ...vedtatt,
            id: 'beh_3',
            iverksattTidspunkt: '2025-03-01T10:00:00',
        });
        const omgjøring = omgjøringInnvilgelse({
            ...vedtatt,
            id: 'beh_4',
            iverksattTidspunkt: '2025-03-15T10:00:00',
        });
        const andreInnvilgelse = søknadsbehandlingInnvilgelse({
            ...vedtatt,
            id: 'beh_5',
            iverksattTidspunkt: '2025-04-01T10:00:00',
        });
        const innvilgelseUnderBehandling = søknadsbehandlingInnvilgelse({ id: 'beh_6' });

        const p = periode('2025-01-01', '2025-03-31');
        const sakProps = sak({
            rammebehandlinger: [
                førsteInnvilgelse,
                avslag,
                revurdering,
                omgjøring,
                andreInnvilgelse,
                innvilgelseUnderBehandling,
            ],
            alleRammevedtak: [
                rammevedtak('vedtak_1', p, { behandlingId: 'beh_1' }),
                rammevedtak('vedtak_2', p, { behandlingId: 'beh_2' }),
                rammevedtak('vedtak_3', p, { behandlingId: 'beh_3' }),
                rammevedtak('vedtak_4', p, { behandlingId: 'beh_4' }),
                rammevedtak('vedtak_5', p, { behandlingId: 'beh_5' }),
            ],
        });

        expect(hentVedtatteSøknadsbehandlinger(sakProps).map((b) => b.id)).toEqual([
            'beh_5',
            'beh_1',
        ]);
    });

    test('sak uten vedtak gir tom liste', () => {
        expect(hentVedtatteSøknadsbehandlinger(sak())).toEqual([]);
    });
});

describe('gjeldende rammevedtak', () => {
    const vedtak1 = rammevedtak('vedtak_1', periode('2025-01-01', '2025-06-30'));
    const vedtak2 = rammevedtak('vedtak_2', periode('2025-04-01', '2025-04-30'));
    const heltOmgjortVedtak = rammevedtak('vedtak_3', periode('2025-01-01', '2025-06-30'));

    // vedtak_2 deler vedtak_1 i to, og vedtak_3 er helt erstattet og finnes ikke i tidslinjen
    const sakProps = sak({
        alleRammevedtak: [vedtak1, vedtak2, heltOmgjortVedtak],
        tidslinje: {
            elementer: [
                tidslinjeElement('vedtak_1', periode('2025-01-01', '2025-03-31')),
                tidslinjeElement('vedtak_2', periode('2025-04-01', '2025-04-30')),
                tidslinjeElement('vedtak_1', periode('2025-05-01', '2025-06-30')),
            ],
        },
    });

    test('et vedtak er gjeldende bare om det finnes i tidslinjen', () => {
        expect(hentGjeldendeRammevedtak(sakProps, 'vedtak_2')).toBe(vedtak2);
        expect(hentGjeldendeRammevedtak(sakProps, 'vedtak_3')).toBeUndefined();
        expect(hentGjeldendeRammevedtak(sakProps, 'vedtak_ukjent')).toBeUndefined();
    });

    test('vedtakene som gjelder i en periode tas med én gang hver, i tidslinjens rekkefølge', () => {
        expect(
            hentGjeldendeRammevedtakIPeriode(sakProps, periode('2025-03-15', '2025-05-15')),
        ).toEqual([vedtak1, vedtak2]);
    });

    test('perioden overlapper når den bare deler én dag med tidslinjen', () => {
        expect(
            hentGjeldendeRammevedtakIPeriode(sakProps, periode('2025-04-30', '2025-04-30')),
        ).toEqual([vedtak2]);
        expect(
            hentGjeldendeRammevedtakIPeriode(sakProps, periode('2024-12-01', '2025-01-01')),
        ).toEqual([vedtak1]);
    });

    test('periode utenfor tidslinjen gir ingen vedtak', () => {
        expect(
            hentGjeldendeRammevedtakIPeriode(sakProps, periode('2025-07-01', '2025-12-31')),
        ).toEqual([]);
    });
});

describe('hentSøknadsbehandlingerForSøknad', () => {
    test('gir søknadsbehandlingene på søknaden, eldst først', () => {
        const nyesteBehandling = søknadsbehandlingAvslag({
            id: 'beh_ny',
            opprettet: '2025-03-01T10:00:00',
        });
        const eldsteBehandling = søknadsbehandlingInnvilgelse({
            id: 'beh_gammel',
            opprettet: '2025-01-01T10:00:00',
        });
        const annenSøknad = søknadsbehandlingInnvilgelse({
            id: 'beh_annen',
            søknad: { ...søknad(), id: 'soknad_2' },
        });
        const revurdering = revurderingInnvilgelse({ id: 'beh_revurdering' });

        const sakProps = sak({
            rammebehandlinger: [nyesteBehandling, annenSøknad, revurdering, eldsteBehandling],
        });

        expect(hentSøknadsbehandlingerForSøknad(sakProps, 'soknad_1').map((b) => b.id)).toEqual([
            'beh_gammel',
            'beh_ny',
        ]);
        expect(hentSøknadsbehandlingerForSøknad(sakProps, 'soknad_ukjent')).toEqual([]);
    });
});

describe('vedtak med behandlinger', () => {
    test('rammevedtakene kobles til behandlingene sine', () => {
        const behandling = søknadsbehandlingInnvilgelse({ id: 'beh_1' });
        const vedtak = rammevedtak('vedtak_1', periode('2025-01-01', '2025-03-31'), {
            behandlingId: 'beh_1',
        });

        expect(
            hentRammevedtakMedBehandlinger(
                sak({ rammebehandlinger: [behandling], alleRammevedtak: [vedtak] }),
            ),
        ).toEqual([{ ...vedtak, vedtakType: VedtakType.Rammebehandling, behandling }]);
    });

    test('kaster når et rammevedtak peker på en behandling som ikke finnes på saken', () => {
        const vedtak = rammevedtak('vedtak_1', periode('2025-01-01', '2025-03-31'), {
            behandlingId: 'beh_mangler',
        });

        expect(() => hentRammevedtakMedBehandlinger(sak({ alleRammevedtak: [vedtak] }))).toThrow(
            'Fant ikke rammebehandling med id beh_mangler',
        );
    });

    test('meldekortvedtakene kobles til meldekortbehandlingene sine', () => {
        const meldekortId = 'meldekort_1' as MeldekortbehandlingId;
        const behandling = delvis<MeldekortbehandlingProps>({ id: meldekortId });
        const vedtak = delvis<Meldekortvedtak>({ id: 'vedtak_mk', meldekortId });

        expect(
            hentMeldekortvedtakMedBehandlinger(
                sak({
                    meldekortvedtak: [vedtak],
                    meldekortbehandlinger: { [meldekortId]: behandling },
                }),
            ),
        ).toEqual([{ ...vedtak, vedtakType: VedtakType.Meldekort, behandling }]);
    });

    test('klagevedtakene kobles til klagebehandlingene sine', () => {
        const behandling = delvis<Klagebehandling>({ id: 'klage_1' });
        const vedtak = delvis<Klagevedtak>({ klagebehandlingId: 'klage_1' });

        expect(
            hentKlagevedtakMedBehandlinger(
                sak({ klagebehandlinger: [behandling], alleKlagevedtak: [vedtak] }),
            ),
        ).toEqual([{ ...vedtak, vedtakType: VedtakType.Klage, behandling }]);
    });
});

describe('hentÅpneMeldekortbehandlinger', () => {
    test('gir bare de åpne behandlingene som er meldekortbehandlinger', () => {
        const åpen = delvis<MeldekortbehandlingProps>({
            id: 'meldekort_1' as MeldekortbehandlingId,
        });
        const ferdig = delvis<MeldekortbehandlingProps>({
            id: 'meldekort_2' as MeldekortbehandlingId,
        });

        const sakProps = sak({
            meldekortbehandlinger: { [åpen.id]: åpen, [ferdig.id]: ferdig },
            åpneBehandlinger: [
                { type: ÅpenBehandlingType.SØKNADSBEHANDLING, id: 'beh_1' },
                { type: ÅpenBehandlingType.MELDEKORT, id: åpen.id },
                { type: ÅpenBehandlingType.KLAGE, id: 'klage_1' },
            ],
        });

        expect(hentÅpneMeldekortbehandlinger(sakProps)).toEqual([åpen]);
    });
});

describe('oppslag på id', () => {
    test('finner elementet med riktig id', () => {
        const behandling = søknadsbehandlingInnvilgelse({ id: 'beh_2' });
        const vedtak = rammevedtak('vedtak_2', periode('2025-01-01', '2025-03-31'));
        const klage = delvis<Klagebehandling>({ id: 'klage_2' });

        const sakProps = sak({
            rammebehandlinger: [søknadsbehandlingInnvilgelse({ id: 'beh_1' }), behandling],
            alleRammevedtak: [rammevedtak('vedtak_1', vedtak.opprinneligVedtaksperiode), vedtak],
            klagebehandlinger: [delvis<Klagebehandling>({ id: 'klage_1' }), klage],
        });

        expect(hentRammebehandling(sakProps, 'beh_2')).toBe(behandling);
        expect(hentRammevedtak(sakProps, 'vedtak_2')).toBe(vedtak);
        expect(hentKlagebehandling(sakProps, 'klage_2')).toBe(klage);
    });

    test('kaster med forklarende melding når elementet ikke finnes på saken', () => {
        const tomSak = sak();

        expect(() => hentRammebehandling(tomSak, 'beh_x')).toThrow(
            'Fant ikke rammebehandling med id beh_x',
        );
        expect(() => hentRammevedtak(tomSak, 'vedtak_x')).toThrow(
            'Fant ikke rammevedtak med id vedtak_x',
        );
        expect(() => hentSøknad(tomSak, 'soknad_x')).toThrow('Fant ikke søknad med id soknad_x');
        expect(() => hentTilbakekreving(tomSak, 'tilbakekreving_x')).toThrow(
            'Fant ikke tilbakekreving med id tilbakekreving_x',
        );
        expect(() => hentMeldeperiodekjede(tomSak, '2025-01-06/2025-01-19')).toThrow(
            'Fant ikke meldeperiodekjede med id 2025-01-06/2025-01-19',
        );
        expect(() =>
            hentMeldekortbehandling(tomSak, 'meldekort_x' as MeldekortbehandlingId),
        ).toThrow('Fant ikke meldekortbehandling med id meldekort_x');
        expect(() => hentKlagebehandling(tomSak, 'klage_x')).toThrow(
            'Fant ikke klagebehandling med id klage_x',
        );
    });
});
