import { Alert, Button, HStack, Select, VStack } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Rammebehandlingstype } from '~/types/Rammebehandling';
import { periodiserBarnetilleggFraSøknad } from '../utils/periodiserBarnetilleggFraSøknad';
import { hentBarnetilleggForhåndsutfyltForRevurdering } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { useSak } from '~/context/sak/SakContext';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import {
    finnPeriodiseringHull,
    perioderOverlapper,
    periodiseringTotalPeriode,
} from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { XMarkIcon } from '@navikt/aksel-icons';
import {
    Datovelger,
    DatovelgerProps,
    generateMatcherProps,
} from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';
import { classNames } from '~/utils/classNames';

import style from './BehandlingBarnetilleggPerioder.module.css';

const BATCH_MED_BARN = 10;

export const BehandlingBarnetilleggPerioder = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();
    const { barnetilleggPerioder, innvilgelsesperioder } = innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const erSøknadsbehandling = behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING;

    const antallBarnFraSøknad = erSøknadsbehandling ? behandling.søknad.barnetillegg.length : 0;

    const antallBarnForNyPeriode =
        barnetilleggPerioder.at(-1)?.antallBarn || antallBarnFraSøknad || 1;

    return (
        <VedtakSeksjon.FullBredde className={style.wrapper}>
            <VStack gap={'space-12'} align={'start'}>
                {barnetilleggPerioder.map((bt, index) => (
                    <PeriodeVelger
                        btPeriode={bt}
                        index={index}
                        readOnly={erReadonly}
                        key={`${bt.periode.fraOgMed}-${bt.periode.tilOgMed}`}
                    />
                ))}

                {!erReadonly && (
                    <HStack gap={'space-12'}>
                        <Button
                            type={'button'}
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'addBarnetilleggPeriode',
                                    payload: { antallBarn: antallBarnForNyPeriode },
                                });
                            }}
                        >
                            {'Ny periode'}
                        </Button>

                        {erSøknadsbehandling ? (
                            <Button
                                variant={'secondary'}
                                size={'small'}
                                onClick={() =>
                                    dispatch({
                                        type: 'settBarnetilleggPerioder',
                                        payload: {
                                            barnetilleggPerioder: periodiserBarnetilleggFraSøknad(
                                                behandling.søknad.barnetillegg,
                                                innvilgelsesperioder,
                                            ),
                                        },
                                    })
                                }
                            >
                                {'Periodiser fra søknaden'}
                            </Button>
                        ) : (
                            <Button
                                variant={'secondary'}
                                size={'small'}
                                onClick={() => {
                                    dispatch({
                                        type: 'settBarnetilleggPerioder',
                                        payload: {
                                            barnetilleggPerioder:
                                                hentBarnetilleggForhåndsutfyltForRevurdering(
                                                    sak.tidslinje,
                                                    innvilgelsesperioder,
                                                ),
                                        },
                                    });
                                }}
                            >
                                {'Periodiser fra gjeldende vedtak'}
                            </Button>
                        )}
                    </HStack>
                )}
            </VStack>
        </VedtakSeksjon.FullBredde>
    );
};

type PeriodeVelgerProps = {
    btPeriode: BarnetilleggPeriode;
    index: number;
    readOnly: boolean;
};

const PeriodeVelger = ({ btPeriode, index, readOnly }: PeriodeVelgerProps) => {
    const { periode, antallBarn } = btPeriode;

    const { innvilgelse } = useBehandlingInnvilgelseMedPerioderSkjema();

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    // Støtter uendelig mange barn!
    const maksAntall = (Math.floor(antallBarn / BATCH_MED_BARN) + 1) * BATCH_MED_BARN;

    // Normalt skal det ikke være mulig å sette en 0-periode, men dersom det skulle skje må det vises til saksbehandler
    const erPeriodeMed0Barn = antallBarn === 0;

    const innvilgelseTotalPeriode = periodiseringTotalPeriode(innvilgelse.innvilgelsesperioder);

    const innvilgelseHull = finnPeriodiseringHull(innvilgelse.innvilgelsesperioder);

    const disabledDager = generateMatcherProps(innvilgelseHull);

    const erIkkeInnvilgetPeriode = innvilgelseHull.some((p) => perioderOverlapper(p, periode));

    const commonProps: Partial<DatovelgerProps> = {
        minDate: innvilgelseTotalPeriode.fraOgMed,
        maxDate: innvilgelseTotalPeriode.tilOgMed,
        readOnly,
        size: 'small',
        dropdownCaption: true,
        disabledMatcher: disabledDager,
    };

    return (
        <HStack
            gap={'space-12'}
            align={'end'}
            className={classNames(erIkkeInnvilgetPeriode && style.feilPeriode)}
        >
            <Datovelger
                {...commonProps}
                label={'Fra og med'}
                selected={periode.fraOgMed}
                value={datoTilDatoInputText(periode.fraOgMed)}
                error={!periode.fraOgMed && 'Velg dato'}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterBarnetilleggPeriode',
                        payload: {
                            periodeOppdatering: { fraOgMed: dateTilISOTekst(valgtDato) },
                            index,
                        },
                    });
                }}
            />
            <Datovelger
                {...commonProps}
                label={'Til og med'}
                selected={periode.tilOgMed}
                value={datoTilDatoInputText(periode.tilOgMed)}
                error={!periode.tilOgMed && 'Velg dato'}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterBarnetilleggPeriode',
                        payload: {
                            periodeOppdatering: { tilOgMed: dateTilISOTekst(valgtDato) },
                            index,
                        },
                    });
                }}
            />
            <Select
                label={'Antall barn'}
                size={'small'}
                className={style.antall}
                value={antallBarn}
                readOnly={readOnly}
                error={erPeriodeMed0Barn && 'Perioden må ha minst ett barn'}
                onChange={(event) =>
                    dispatch({
                        type: 'oppdaterBarnetilleggAntall',
                        payload: { antall: Number(event.target.value), index },
                    })
                }
            >
                {erPeriodeMed0Barn && (
                    <option value={0} disabled={true}>
                        {0}
                    </option>
                )}
                {Array.from({ length: maksAntall }).map((_, index) => {
                    const verdi = index + 1;
                    return (
                        <option value={verdi} key={verdi}>
                            {verdi === maksAntall ? `${verdi}+` : verdi}
                        </option>
                    );
                })}
            </Select>
            {!readOnly && (
                <Button
                    type={'button'}
                    variant={'tertiary'}
                    size={'small'}
                    icon={<XMarkIcon />}
                    onClick={() => {
                        dispatch({
                            type: 'fjernBarnetilleggPeriode',
                            payload: { index },
                        });
                    }}
                >
                    {'Fjern'}
                </Button>
            )}
            {erIkkeInnvilgetPeriode && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {'Perioden inneholder dager som ikke er innvilget'}
                </Alert>
            )}
        </HStack>
    );
};
