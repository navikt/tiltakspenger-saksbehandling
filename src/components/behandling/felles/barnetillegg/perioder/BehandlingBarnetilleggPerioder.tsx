import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { VedtakBarnetilleggPeriode } from '~/types/VedtakTyper';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';
import { Behandlingstype } from '~/types/BehandlingTypes';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

import style from './BehandlingBarnetilleggPerioder.module.css';

const BATCH_MED_BARN = 10;

export const BehandlingBarnetilleggPerioder = () => {
    const { behandling, rolleForBehandling } = useBehandling();
    const { barnetilleggPerioder, behandlingsperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const erSøknadsbehandling = behandling.type === Behandlingstype.SØKNADSBEHANDLING;
    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    const antallBarn = erSøknadsbehandling ? behandling.søknad.barnetillegg.length : 1;

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                {barnetilleggPerioder.map((periode, index) => (
                    <BarnetilleggPeriode
                        periode={periode}
                        index={index}
                        erSaksbehandler={erSaksbehandler}
                        key={`${periode.periode.fraOgMed}-${index}`}
                    />
                ))}
                {erSaksbehandler && (
                    <div className={style.perioderKnapper}>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'addBarnetilleggPeriode',
                                    payload: {
                                        innvilgelsesPeriode: behandlingsperiode,
                                        antallBarnFraSøknad: antallBarn,
                                    },
                                });
                            }}
                        >
                            {'Ny periode'}
                        </Button>
                        {antallBarn > 0 && erSøknadsbehandling && (
                            <Button
                                variant={'secondary'}
                                size={'small'}
                                onClick={() => {
                                    dispatch({
                                        type: 'nullstillBarnetilleggPerioder',
                                        payload: {
                                            innvilgelsesPeriode: behandlingsperiode,
                                            søknad: behandling.søknad,
                                        },
                                    });
                                }}
                            >
                                {'Sett perioder fra søknaden'}
                            </Button>
                        )}
                    </div>
                )}
            </VedtakSeksjon.Venstre>
        </>
    );
};

type PeriodeProps = {
    periode: VedtakBarnetilleggPeriode;
    index: number;
    erSaksbehandler: boolean;
};

const BarnetilleggPeriode = ({ periode, index, erSaksbehandler }: PeriodeProps) => {
    const { behandlingsperiode: innvilgelsesPeriode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    // Støtter uendelig mange barn!
    const maksAntall = (Math.floor(periode.antallBarn / BATCH_MED_BARN) + 1) * BATCH_MED_BARN;

    // Normalt skal det ikke være mulig å sette en 0-periode, men dersom det skulle skje må det vises til saksbehandler
    const erPeriodeMed0Barn = periode.antallBarn === 0;

    return (
        <div className={style.periode}>
            <Datovelger
                selected={periode.periode.fraOgMed}
                value={
                    periode.periode.fraOgMed
                        ? datoTilDatoInputText(periode.periode.fraOgMed)
                        : undefined
                }
                minDate={innvilgelsesPeriode.fraOgMed}
                maxDate={innvilgelsesPeriode.tilOgMed}
                label={'Fra og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (!value) {
                        return;
                    }

                    const nyFraOgMed = dateTilISOTekst(value);
                    if (nyFraOgMed !== periode.periode.fraOgMed) {
                        dispatch({
                            type: 'oppdaterBarnetilleggPeriode',
                            payload: { periode: { fraOgMed: nyFraOgMed }, index },
                        });
                    }
                }}
            />
            <Datovelger
                selected={periode.periode.tilOgMed}
                minDate={innvilgelsesPeriode.fraOgMed}
                maxDate={innvilgelsesPeriode.tilOgMed}
                value={
                    periode.periode.tilOgMed
                        ? datoTilDatoInputText(periode.periode.tilOgMed)
                        : undefined
                }
                label={'Til og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (!value) {
                        return;
                    }

                    const nyTilOgMed = dateTilISOTekst(value);
                    if (nyTilOgMed !== periode.periode.tilOgMed) {
                        dispatch({
                            type: 'oppdaterBarnetilleggPeriode',
                            payload: { periode: { tilOgMed: nyTilOgMed }, index },
                        });
                    }
                }}
            />
            <Select
                label={'Antall barn'}
                size={'small'}
                className={style.antall}
                value={periode.antallBarn}
                readOnly={!erSaksbehandler}
                error={erPeriodeMed0Barn && 'Perioden må ha minst ett barn'}
                onChange={(event) => {
                    dispatch({
                        type: 'oppdaterBarnetilleggAntall',
                        payload: { antall: Number(event.target.value), index },
                    });
                }}
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
                            {verdi}
                        </option>
                    );
                })}
            </Select>

            {erSaksbehandler && (
                <Button
                    variant={'tertiary'}
                    size={'small'}
                    onClick={() => {
                        dispatch({
                            type: 'fjernBarnetilleggPeriode',
                            payload: {
                                fjernIndex: index,
                            },
                        });
                    }}
                >
                    {'Fjern periode'}
                </Button>
            )}
        </div>
    );
};
