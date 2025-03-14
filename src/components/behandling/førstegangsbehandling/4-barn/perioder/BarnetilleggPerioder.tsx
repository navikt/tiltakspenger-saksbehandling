import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import {
    useFørstegangsVedtakSkjemaDispatch,
    useFørstegangsVedtakSkjema,
} from '../../context/FørstegangsVedtakContext';
import { VedtakBarnetilleggPeriode } from '../../../../../types/VedtakTyper';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { dateTilISOTekst } from '../../../../../utils/date';
import { useFørstegangsbehandling } from '../../../BehandlingContext';

import style from './BarnetilleggPerioder.module.css';

const BATCH_MED_BARN = 10;

export const BarnetilleggPerioder = () => {
    const { rolleForBehandling, behandling } = useFørstegangsbehandling();
    const { barnetilleggPerioder, innvilgelsesPeriode } = useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakSkjemaDispatch();

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                {barnetilleggPerioder?.map((periode, index) => {
                    return (
                        <BarnetilleggPeriode
                            periode={periode}
                            index={index}
                            rolle={rolleForBehandling}
                            key={`${periode.periode.fraOgMed}-${index}`}
                        />
                    );
                })}
                {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <div className={style.perioderKnapper}>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'addBarnetilleggPeriode',
                                    payload: { innvilgelsesPeriode },
                                });
                            }}
                        >
                            {'Ny periode for barnetillegg'}
                        </Button>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'nullstillBarnetilleggPerioder',
                                    payload: { innvilgelsesPeriode, søknad: behandling.søknad },
                                });
                            }}
                        >
                            {'Sett perioder fra søknaden'}
                        </Button>
                    </div>
                )}
            </VedtakSeksjon.Venstre>
        </>
    );
};

type PeriodeProps = {
    periode: VedtakBarnetilleggPeriode;
    index: number;
    rolle: SaksbehandlerRolle | null;
};

const BarnetilleggPeriode = ({ periode, index, rolle }: PeriodeProps) => {
    const dispatch = useFørstegangsVedtakSkjemaDispatch();
    const { innvilgelsesPeriode } = useFørstegangsVedtakSkjema();

    // Støtter uendelig mange barn!
    const maksAntall = (Math.floor(periode.antallBarn / BATCH_MED_BARN) + 1) * BATCH_MED_BARN;
    const erSaksbehandler = rolle === SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={style.periode}>
            <Datovelger
                selected={periode.periode.fraOgMed}
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
                onChange={(event) => {
                    dispatch({
                        type: 'oppdaterBarnetilleggAntall',
                        payload: { antall: Number(event.target.value), index },
                    });
                }}
            >
                {Array.from({ length: maksAntall + 1 }).map((_, index) => (
                    <option value={index} key={index}>
                        {index}
                    </option>
                ))}
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
