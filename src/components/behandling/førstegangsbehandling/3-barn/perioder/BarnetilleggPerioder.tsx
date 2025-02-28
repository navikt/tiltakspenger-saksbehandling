import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../../vedtak/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakDispatch,
    useFørstegangsVedtakSkjema,
} from '../../context/FørstegangsbehandlingContext';
import { hentTiltaksPeriode } from '../../../../../utils/behandling';
import { VedtakBarnetilleggPeriode } from '../../../../../types/VedtakTyper';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { dateTilISOTekst } from '../../../../../utils/date';

import style from './BarnetilleggPerioder.module.css';

const MAKS_ANTALL_BARN = 20;

export const BarnetilleggPerioder = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { barnetilleggPerioder } = useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakDispatch();

    const tiltaksperiode = hentTiltaksPeriode(behandling);

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
                    <Button
                        variant={'secondary'}
                        size={'small'}
                        className={style.ny}
                        onClick={() => {
                            dispatch({
                                type: 'addBarnetilleggPeriode',
                                payload: { tiltaksperiode },
                            });
                        }}
                    >
                        {'Ny periode for barnetillegg'}
                    </Button>
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
    const dispatch = useFørstegangsVedtakDispatch();

    const erSaksbehandler = rolle === SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={style.periode}>
            <Select
                label={'Antall barn'}
                size={'small'}
                className={style.antall}
                defaultValue={periode.antallBarn}
                readOnly={!erSaksbehandler}
                onChange={(event) => {
                    dispatch({
                        type: 'oppdaterBarnetilleggAntall',
                        payload: { antall: Number(event.target.value), index },
                    });
                }}
            >
                {Array.from({ length: MAKS_ANTALL_BARN + 1 }).map((_, index) => (
                    <option value={index} key={index}>
                        {index}
                    </option>
                ))}
            </Select>
            <Datovelger
                defaultSelected={periode.periode.fraOgMed}
                label={'Fra og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (value) {
                        dispatch({
                            type: 'oppdaterBarnetilleggPeriode',
                            payload: { periode: { fraOgMed: dateTilISOTekst(value) }, index },
                        });
                    }
                }}
            />
            <Datovelger
                defaultSelected={periode.periode.tilOgMed}
                label={'Til og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (value) {
                        dispatch({
                            type: 'oppdaterBarnetilleggPeriode',
                            payload: { periode: { tilOgMed: dateTilISOTekst(value) }, index },
                        });
                    }
                }}
            />

            {erSaksbehandler && (
                <Button
                    variant={'tertiary'}
                    size={'small'}
                    className={style.fjern}
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
