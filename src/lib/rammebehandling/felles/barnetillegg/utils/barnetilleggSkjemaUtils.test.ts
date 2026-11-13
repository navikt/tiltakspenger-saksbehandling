import { describe, expect, test } from '@jest/globals';
import {
    hentBarnetilleggKandidater,
    hentBarnFraSøknader,
    lagBarnetilleggSkjemaState,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import {
    barnetilleggBarn,
    barnetilleggKandidat,
    barnetilleggV2,
    innvilgelsesperiode,
    periode,
    revurderingInnvilgelse,
    søknad,
    søknadBarn,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import { nonNullish } from '~/utils/object';

const førsteHalvår = periode('2025-01-01', '2025-06-30');
const innvilgelsesperioder = [innvilgelsesperiode(førsteHalvår)];

// Kandidatene backend gir for en revurdering der det tidligere er innvilget for to tiltaksdeltakelser
const kandidatFraSøknad = barnetilleggKandidat('2015-03-01', {
    søknadId: 'soknad_nyere',
    internDeltakelseIder: ['deltakelse_1'],
});
const kandidatFraSøknadForAnnetTiltak = barnetilleggKandidat('2018-01-01', {
    fornavn: ikkeSladdet('Annet tiltak'),
    søknadId: 'soknad_annet',
    internDeltakelseIder: ['deltakelse_2'],
});
const kandidatFraVedtaket = barnetilleggKandidat('2016-01-01', {
    fornavn: ikkeSladdet('Vedtak'),
    søknadId: 'soknad_vedtak',
    søknadsopplysninger: null,
    fraGjeldendeVedtak: true,
});
const kandidatSomErLagret = barnetilleggKandidat('2017-01-01', {
    fornavn: ikkeSladdet('Lagret'),
    søknadsopplysninger: null,
});
const kandidatMedSladdetFødselsdato = barnetilleggKandidat('2010-01-01', {
    fornavn: ikkeSladdet('Sladdet'),
    fødselsdato: sladdet,
    søknadsopplysninger: null,
});

const alleKandidater = [
    kandidatMedSladdetFødselsdato,
    kandidatFraSøknad,
    kandidatFraVedtaket,
    kandidatSomErLagret,
    kandidatFraSøknadForAnnetTiltak,
];

describe('hentBarnFraSøknader', () => {
    test('gir kandidatene fra søknadene som er aktuelle for tiltaksdeltakelsene det innvilges for', () => {
        const barn = hentBarnFraSøknader(
            revurderingInnvilgelse({ barnetilleggKandidater: alleKandidater }),
            innvilgelsesperioder,
        );

        expect(barn).toEqual([
            {
                barn: expect.objectContaining({
                    fødselsdato: ikkeSladdet('2015-03-01'),
                    søknadId: 'soknad_nyere',
                    perioder: null,
                }),
                opplysninger: kandidatFraSøknad.søknadsopplysninger,
            },
        ]);
    });

    test('gir kandidater uten tiltaksdeltakelser uansett hva det innvilges for', () => {
        const kandidat = barnetilleggKandidat('2015-03-01');

        expect(
            hentBarnFraSøknader(revurderingInnvilgelse({ barnetilleggKandidater: [kandidat] }), [
                innvilgelsesperiode(førsteHalvår, { internDeltakelseId: 'deltakelse_3' }),
            ]),
        ).toHaveLength(1);
    });
});

describe('hentBarnetilleggKandidater', () => {
    test('viser de aktuelle kandidatene og barn lagt til av saksbehandler, uten duplikater, med eldste først', () => {
        const manueltBarn = skjemaBarn('2024-01-01', {
            fornavn: ikkeSladdet('Manuelt'),
            kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
            søknadId: null,
        });

        const valgtBarnFraSøknad = {
            ...skjemaBarn('2015-03-01', { søknadId: 'soknad_nyere' }),
            perioder: [periode('2025-02-01', '2025-03-31')],
        };

        const behandling = revurderingInnvilgelse({
            innvilgelsesperioder,
            barnetilleggKandidater: alleKandidater,
        });

        const kandidater = hentBarnetilleggKandidater(behandling, {
            innvilgelsesperioder,
            valgteBarn: [valgtBarnFraSøknad, manueltBarn],
            manueltLagtTilBarn: [manueltBarn],
        });

        expect(
            kandidater.map(({ barn, erValgt, kanFjernes, søknadsopplysninger }) => ({
                fornavn: barn.fornavn.verdi,
                perioder: barn.perioder,
                erValgt,
                kanFjernes,
                fraSøknad: søknadsopplysninger !== null,
            })),
        ).toEqual([
            {
                fornavn: 'Barn',
                perioder: [periode('2025-02-01', '2025-03-31')],
                erValgt: true,
                kanFjernes: false,
                fraSøknad: true,
            },
            {
                fornavn: 'Vedtak',
                perioder: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
            {
                fornavn: 'Lagret',
                perioder: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
            {
                fornavn: 'Manuelt',
                perioder: null,
                erValgt: true,
                kanFjernes: true,
                fraSøknad: false,
            },
            {
                fornavn: 'Sladdet',
                perioder: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
        ]);
    });

    test('viser samme barn én gang når det er valgt med fnr og finnes uten fnr i søknaden', () => {
        const søknadsbehandling = søknadsbehandlingInnvilgelse({
            innvilgelsesperioder,
            søknad: søknad([søknadBarn('2015-03-01')]),
        });
        const valgtMedFnr = skjemaBarn('2015-03-01', {
            fnr: ikkeSladdet('01031512345'),
            kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
            søknadId: null,
        });

        const kandidater = hentBarnetilleggKandidater(søknadsbehandling, {
            innvilgelsesperioder,
            valgteBarn: [valgtMedFnr],
            manueltLagtTilBarn: [],
        });

        expect(kandidater).toHaveLength(1);
        expect(kandidater[0]).toMatchObject({ barn: valgtMedFnr, erValgt: true });
        expect(kandidater[0].søknadsopplysninger).not.toBeNull();
    });

    test('viser bare de valgte barna når behandlingen er avsluttet', () => {
        const valgtBarn = barnetilleggBarn('2015-03-01', { søknadId: 'soknad_nyere' });
        const behandling = revurderingInnvilgelse({
            status: Rammebehandlingsstatus.VEDTATT,
            innvilgelsesperioder,
            barnetillegg: barnetilleggV2([valgtBarn], [førsteHalvår]),
        });
        const state = lagBarnetilleggSkjemaState(behandling, innvilgelsesperioder);

        const kandidater = hentBarnetilleggKandidater(behandling, {
            innvilgelsesperioder,
            ...state,
        });

        expect(kandidater).toEqual([
            expect.objectContaining({
                barn: expect.objectContaining({ fødselsdato: ikkeSladdet('2015-03-01') }),
                erValgt: true,
            }),
        ]);
    });
});

describe('lagrede barn lagt til av saksbehandler', () => {
    const lagtTilAvSaksbehandler = barnetilleggBarn('2023-01-01', {
        fornavn: ikkeSladdet('Lagt til'),
        kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
        søknadId: null,
    });
    // Samme barn som i gjeldende vedtak, og vil vises derfra selv om det fjernes
    const ogsåIVedtaket = barnetilleggBarn('2016-01-01', {
        fornavn: ikkeSladdet('Vedtak'),
        kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
        søknadId: null,
    });

    // Backend gir ikke lagrede barn lagt til av saksbehandler som kandidater, men gir barna fra gjeldende vedtak
    const behandling = revurderingInnvilgelse({
        innvilgelsesperioder,
        barnetillegg: barnetilleggV2([lagtTilAvSaksbehandler, ogsåIVedtaket], [førsteHalvår]),
        barnetilleggKandidater: [
            barnetilleggKandidat('2016-01-01', {
                fornavn: ikkeSladdet('Vedtak'),
                kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
                søknadId: null,
                søknadsopplysninger: null,
                fraGjeldendeVedtak: true,
            }),
        ],
    });

    const state = lagBarnetilleggSkjemaState(behandling, innvilgelsesperioder);
    const kandidater = () =>
        hentBarnetilleggKandidater(behandling, { innvilgelsesperioder, ...state });

    test('kan fjernes, med mindre barnet også finnes i søknadene eller gjeldende vedtak', () => {
        expect(
            kandidater()
                .filter((it) => it.erValgt)
                .map((it) => ({ fornavn: it.barn.fornavn.verdi, kanFjernes: it.kanFjernes })),
        ).toEqual([
            { fornavn: 'Vedtak', kanFjernes: false },
            { fornavn: 'Lagt til', kanFjernes: true },
        ]);
    });

    test('vises ikke når det er fjernet', () => {
        const fjernet = nonNullish(
            kandidater().find((it) => it.barn.fornavn.verdi === 'Lagt til'),
        ).barn;
        const etterFjerning = hentBarnetilleggKandidater(behandling, {
            innvilgelsesperioder,
            valgteBarn: state.valgteBarn.filter((it) => it.key !== fjernet.key),
            manueltLagtTilBarn: state.manueltLagtTilBarn.filter((it) => it.key !== fjernet.key),
        });

        expect(etterFjerning.map((it) => it.barn.fornavn.verdi)).not.toContain('Lagt til');
        expect(etterFjerning.map((it) => it.barn.fornavn.verdi)).toContain('Vedtak');
    });
});
