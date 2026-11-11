import { describe, expect, test } from '@jest/globals';
import {
    hentBarnetilleggKandidater,
    hentBarnFraSøknader,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import {
    barnetilleggBarn,
    barnetilleggV2,
    innvilgelsesperiode,
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sakMedInnvilgetVedtak,
    søknad,
    søknadBarn,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { tilTidspunkt } from '~/types/DatoTid';
import { InnvilgbarSøknad, SøknadBarn, SøknadId } from '~/lib/søknad/søknadTyper';
import {
    RammebehandlingId,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';

const førsteHalvår = periode('2025-01-01', '2025-06-30');
const innvilgelsesperioder = [innvilgelsesperiode(førsteHalvår)];

const søknadFor = (
    id: SøknadId,
    internDeltakelseId: string,
    mottatt: string,
    barn: SøknadBarn[],
): InnvilgbarSøknad => {
    const standard = søknad(barn);

    return {
        ...standard,
        id,
        mottatt: tilTidspunkt(mottatt),
        tiltak: { ...standard.tiltak, internDeltakelseId },
    };
};

const barnMedFnr = (navn: string): SøknadBarn => ({
    ...søknadBarn('2020-01-01'),
    fornavn: ikkeSladdet(navn),
    fnr: ikkeSladdet('01012012345'),
});

const eldreSøknad = søknadFor('soknad_eldre', 'deltakelse_1', '2025-01-01T09:00:00', [
    søknadBarn('2015-03-01'),
    barnMedFnr('Gammelt'),
]);

const nyereSøknad = søknadFor('soknad_nyere', 'deltakelse_1', '2025-02-01T09:00:00', [
    barnMedFnr('Nytt'),
    søknadBarn('2015-03-01'),
]);

const søknadForAnnetTiltak = søknadFor('soknad_annet', 'deltakelse_2', '2025-03-01T09:00:00', [
    søknadBarn('2018-01-01'),
]);

const barnFraVedtaket = barnetilleggBarn('2016-01-01', {
    fornavn: ikkeSladdet('Vedtak'),
    søknadId: 'soknad_vedtak',
});

// Nyere søknad for samme tiltak som ikke er innvilget ennå, og som ikke skal brukes
const ikkeInnvilgetSøknad = søknadFor(
    'soknad_ikke_innvilget',
    'deltakelse_1',
    '2025-04-01T09:00:00',
    [søknadBarn('2019-01-01')],
);

const vedtattSøknadsbehandling = (
    id: RammebehandlingId,
    søknad: InnvilgbarSøknad,
    iverksatt: string,
    internDeltakelseId: string,
) =>
    søknadsbehandlingInnvilgelse({
        id,
        status: Rammebehandlingsstatus.VEDTATT,
        søknad,
        iverksattTidspunkt: tilTidspunkt(iverksatt),
        vedtaksperiode: førsteHalvår,
        innvilgelsesperioder: [innvilgelsesperiode(førsteHalvår, { internDeltakelseId })],
    });

const behandlingEldre = vedtattSøknadsbehandling(
    'beh_eldre',
    eldreSøknad,
    '2025-01-05T09:00:00',
    'deltakelse_1',
);
const behandlingNyere = vedtattSøknadsbehandling(
    'beh_nyere',
    nyereSøknad,
    '2025-02-05T09:00:00',
    'deltakelse_1',
);
const behandlingAnnetTiltak = vedtattSøknadsbehandling(
    'beh_annet',
    søknadForAnnetTiltak,
    '2025-03-05T09:00:00',
    'deltakelse_2',
);

const sakMedVedtakForNyesteSøknad = sakMedInnvilgetVedtak(førsteHalvår, {
    søknadsbehandling: behandlingNyere,
    vedtak: {
        barnetillegg: barnetilleggV2(
            [
                // Barnet finnes også i søknadene, og skal bare vises én gang
                barnetilleggBarn('2015-03-01', {
                    søknadId: 'soknad_eldre',
                    periode: periode('2025-01-01', '2025-01-31'),
                }),
                barnFraVedtaket,
            ],
            [førsteHalvår],
        ),
    },
});

const sak = {
    ...sakMedVedtakForNyesteSøknad,
    søknader: [eldreSøknad, søknadForAnnetTiltak, nyereSøknad, ikkeInnvilgetSøknad],
    rammebehandlinger: [behandlingEldre, behandlingAnnetTiltak, behandlingNyere],
    alleRammevedtak: [
        rammevedtak('vedtak_eldre', førsteHalvår, { behandlingId: behandlingEldre.id }),
        rammevedtak('vedtak_annet', førsteHalvår, { behandlingId: behandlingAnnetTiltak.id }),
        ...sakMedVedtakForNyesteSøknad.alleRammevedtak,
    ],
};

describe('hentBarnFraSøknader', () => {
    test('henter barna fra de innvilgede søknadene for tiltaksdeltakelsene det innvilges for, én gang per barn fra den nyeste', () => {
        const barn = hentBarnFraSøknader(revurderingInnvilgelse(), innvilgelsesperioder, sak).map(
            (it) => it.barn,
        );

        expect(barn).toEqual([
            expect.objectContaining({
                fornavn: ikkeSladdet('Nytt'),
                fnr: ikkeSladdet('01012012345'),
                søknadId: 'soknad_nyere',
            }),
            expect.objectContaining({
                fødselsdato: ikkeSladdet('2015-03-01'),
                søknadId: 'soknad_nyere',
            }),
        ]);
    });

    test('bruker ikke søknader som ikke er innvilget', () => {
        const barn = hentBarnFraSøknader(revurderingInnvilgelse(), innvilgelsesperioder, sak);

        expect(barn.map((it) => it.barn.søknadId)).not.toContain('soknad_ikke_innvilget');
    });

    test('gir ingen barn når ingen innvilget søknad gjelder tiltaksdeltakelsen det innvilges for', () => {
        expect(
            hentBarnFraSøknader(
                revurderingInnvilgelse(),
                [innvilgelsesperiode(førsteHalvår, { internDeltakelseId: 'deltakelse_3' })],
                sak,
            ),
        ).toEqual([]);
    });
});

describe('hentBarnetilleggKandidater', () => {
    test('viser lagrede barn, barn fra søknadene, fra gjeldende vedtak og lagt til av saksbehandler, uten duplikater, med eldste først', () => {
        const lagretBarn = barnetilleggBarn('2017-01-01', { fornavn: ikkeSladdet('Lagret') });
        const lagretBarnMedSladdetFødselsdato = barnetilleggBarn('2010-01-01', {
            fornavn: ikkeSladdet('Sladdet'),
            fødselsdato: sladdet,
        });

        const manueltBarn = skjemaBarn('2024-01-01', {
            fornavn: ikkeSladdet('Manuelt'),
            kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
            søknadId: null,
        });

        const valgtBarnFraSøknad = {
            ...skjemaBarn('2015-03-01', { søknadId: 'soknad_nyere' }),
            periode: periode('2025-02-01', '2025-03-31'),
        };

        const behandling = revurderingInnvilgelse({
            innvilgelsesperioder,
            barnetillegg: barnetilleggV2(
                [lagretBarnMedSladdetFødselsdato, lagretBarn],
                [førsteHalvår],
            ),
        });

        const kandidater = hentBarnetilleggKandidater(
            behandling,
            {
                innvilgelsesperioder,
                valgteBarn: [valgtBarnFraSøknad, manueltBarn],
                manueltLagtTilBarn: [manueltBarn],
            },
            sak,
        );

        expect(
            kandidater.map(({ barn, erValgt, kanFjernes, søknadsopplysninger }) => ({
                fornavn: barn.fornavn.verdi,
                periode: barn.periode,
                erValgt,
                kanFjernes,
                fraSøknad: søknadsopplysninger !== null,
            })),
        ).toEqual([
            {
                fornavn: 'Barn',
                periode: periode('2025-02-01', '2025-03-31'),
                erValgt: true,
                kanFjernes: false,
                fraSøknad: true,
            },
            {
                fornavn: 'Vedtak',
                periode: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
            {
                fornavn: 'Lagret',
                periode: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
            { fornavn: 'Nytt', periode: null, erValgt: false, kanFjernes: false, fraSøknad: true },
            {
                fornavn: 'Manuelt',
                periode: null,
                erValgt: true,
                kanFjernes: true,
                fraSøknad: false,
            },
            {
                fornavn: 'Sladdet',
                periode: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
        ]);
    });
});
