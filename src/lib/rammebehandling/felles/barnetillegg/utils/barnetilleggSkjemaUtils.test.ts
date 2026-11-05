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
    revurderingInnvilgelse,
    sakMedInnvilgetVedtak,
    søknad,
    søknadBarn,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { tilTidspunkt } from '~/types/DatoTid';
import { Søknad, SøknadBarn, SøknadId } from '~/lib/søknad/søknadTyper';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';

const førsteHalvår = periode('2025-01-01', '2025-06-30');
const innvilgelsesperioder = [innvilgelsesperiode(førsteHalvår)];

const søknadFor = (
    id: SøknadId,
    internDeltakelseId: string,
    mottatt: string,
    barn: SøknadBarn[],
): Søknad => {
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

const sak = {
    ...sakMedInnvilgetVedtak(førsteHalvår, {
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
    }),
    søknader: [eldreSøknad, søknadForAnnetTiltak, nyereSøknad],
};

describe('hentBarnFraSøknader', () => {
    test('henter barna fra søknadene for tiltaksdeltakelsene det innvilges for, én gang per barn fra den nyeste søknaden', () => {
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

    test('gir ingen barn når ingen søknad gjelder tiltaksdeltakelsen det innvilges for', () => {
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
    test('viser lagrede barn, barn fra søknadene, fra gjeldende vedtak og lagt til av saksbehandler, uten duplikater', () => {
        const lagretBarn = barnetilleggBarn('2017-01-01', { fornavn: ikkeSladdet('Lagret') });

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
            barnetillegg: barnetilleggV2([lagretBarn], [førsteHalvår]),
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
                fornavn: 'Lagret',
                periode: null,
                erValgt: false,
                kanFjernes: false,
                fraSøknad: false,
            },
            { fornavn: 'Nytt', periode: null, erValgt: false, kanFjernes: false, fraSøknad: true },
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
                fornavn: 'Manuelt',
                periode: null,
                erValgt: true,
                kanFjernes: true,
                fraSøknad: false,
            },
        ]);
    });
});
