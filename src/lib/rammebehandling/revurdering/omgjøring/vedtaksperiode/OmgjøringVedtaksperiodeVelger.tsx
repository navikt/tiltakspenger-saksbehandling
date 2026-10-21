import { Datovelger, DatovelgerProps } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';
import {
    useOmgjøringMedValgtResultatSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/lib/rammebehandling/context/BehandlingContext';
import { useSak } from '~/lib/sak/SakContext';
import { nonNullish } from '~/utils/object';
import {
    erFullstendigPeriode,
    finnPerioderHull,
    slåSammenPerioder,
    totalPeriode,
} from '~/utils/periode';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { hentGjeldendeRammevedtakIPeriode } from '~/lib/sak/sakUtils';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { VedtaksperiodevelgerGjeldendePerioder } from '~/lib/rammebehandling/revurdering/omgjøring/vedtaksperiode/gjeldende-perioder/VedtaksperiodevelgerGjeldendePerioder';
import { Omgjøring, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Periode } from '~/types/Periode';

import style from './OmgjøringVedtaksperiodeVelger.module.css';

// TODO: flytt feilhåndering til de separate komponentene for opphør og innvilgelse, ettersom ikke alle feil er relevante for begge deler

export const OmgjøringVedtaksperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const { vedtaksperiode, erReadonly, resultat } = useOmgjøringMedValgtResultatSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const erOpphør = resultat === RevurderingResultat.OMGJØRING_OPPHØR;

    // Opphør må starte og slutte i en gjeldende innvilgelsesperiode, men kan gå over hull.
    // Innvilgelse kan gå både over hull og utenfor gjeldende perioder, så lenge minst ett vedtak omgjøres.
    const perioderSomKanOmgjøres = slåSammenPerioder(
        (erOpphør ? sak.innvilgetTidslinje : sak.tidslinje).elementer.map((it) => it.periode),
    );

    const overlappendeVedtak = erFullstendigPeriode(vedtaksperiode)
        ? hentGjeldendeRammevedtakIPeriode(sak, vedtaksperiode)
        : [];

    const erVedtatt = behandling.status === Rammebehandlingsstatus.VEDTATT;

    const periodeSomMåOmgjøresInnenfor = gyldigTotalOmgjøringsperiode(
        behandling,
        vedtaksperiode,
        perioderSomKanOmgjøres,
    );

    const commonProps: Partial<DatovelgerProps> = {
        readOnly: erReadonly,
        size: 'small',
        dropdownCaption: true,
        disabledPerioder: erOpphør ? finnPerioderHull(perioderSomKanOmgjøres) : [],
    };

    return (
        <VStack gap={'space-8'}>
            <Heading size={'small'} level={'3'}>
                {'Vedtaksperiode'}
            </Heading>

            {!erVedtatt && (
                <VedtaksperiodevelgerGjeldendePerioder
                    perioderSomKanOmgjøres={perioderSomKanOmgjøres}
                    valgtResultat={resultat}
                    className={style.gjeldendePerioder}
                />
            )}

            <HStack gap={'space-6'} align={'end'}>
                <Datovelger
                    {...commonProps}
                    label={'Fra og med'}
                    selected={vedtaksperiode.fraOgMed}
                    value={
                        vedtaksperiode.fraOgMed
                            ? datoTilDatoInputText(vedtaksperiode.fraOgMed)
                            : undefined
                    }
                    error={!vedtaksperiode.fraOgMed && 'Velg dato'}
                    minDate={erOpphør ? perioderSomKanOmgjøres.at(0)?.fraOgMed : undefined}
                    maxDate={periodeSomMåOmgjøresInnenfor.tilOgMed}
                    defaultMonth={vedtaksperiode.fraOgMed ?? vedtaksperiode.tilOgMed}
                    onDateChange={(valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterVedtaksperiode',
                            payload: {
                                periodeOppdatering: {
                                    fraOgMed: dateTilISOTekst(valgtDato),
                                },
                            },
                        });
                    }}
                />
                <Datovelger
                    {...commonProps}
                    label={'Til og med'}
                    selected={vedtaksperiode.tilOgMed}
                    value={
                        vedtaksperiode.tilOgMed
                            ? datoTilDatoInputText(vedtaksperiode.tilOgMed)
                            : undefined
                    }
                    error={!vedtaksperiode.tilOgMed && 'Velg dato'}
                    minDate={periodeSomMåOmgjøresInnenfor.fraOgMed}
                    maxDate={erOpphør ? perioderSomKanOmgjøres.at(-1)?.tilOgMed : undefined}
                    defaultMonth={vedtaksperiode.tilOgMed ?? vedtaksperiode.fraOgMed}
                    onDateChange={(valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterVedtaksperiode',
                            payload: {
                                periodeOppdatering: {
                                    tilOgMed: dateTilISOTekst(valgtDato),
                                },
                            },
                        });
                    }}
                />
            </HStack>

            {overlappendeVedtak.length > 1 && (
                <VedtakHjelpetekst variant={'info'}>
                    {`Den valgte perioden omgjør ${overlappendeVedtak.length} vedtak.`}
                </VedtakHjelpetekst>
            )}
        </VStack>
    );
};

// Perioden det er gyldig å omgjøre innenfor, på tvers av alle gjeldende vedtak.
// Ved innvilgelse kan vi gå utenfor denne perioden, men minst en dag må være innenfor.
const gyldigTotalOmgjøringsperiode = (
    behandling: Omgjøring,
    valgtVedtaksperiode: Partial<Periode>,
    perioderSomKanOmgjøres: Periode[],
): Partial<Periode> => {
    if (behandling.status === Rammebehandlingsstatus.VEDTATT) {
        return nonNullish(behandling.vedtaksperiode);
    }

    if (perioderSomKanOmgjøres.length === 0) {
        return valgtVedtaksperiode;
    }

    return totalPeriode(perioderSomKanOmgjøres);
};
