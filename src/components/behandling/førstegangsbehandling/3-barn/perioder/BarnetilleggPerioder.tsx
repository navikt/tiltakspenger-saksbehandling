import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../../vedtak/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakDispatch,
    useFørstegangsVedtakSkjema,
} from '../../context/FørstegangsbehandlingContext';
import { hentTiltaksPeriode } from '../../../../../utils/tiltak';
import { VedtakBarnetilleggPeriode } from '../../../../../types/VedtakTyper';

import style from './BarnetilleggPerioder.module.css';

const MAKS_ANTALL_BARN = 20;

export const BarnetilleggPerioder = () => {
    const { behandling } = useFørstegangsbehandling();
    const { barnetillegg } = useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakDispatch();

    const tiltaksperiode = hentTiltaksPeriode(behandling);

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                {barnetillegg?.barnetilleggForPeriode?.map((periode, index) => {
                    return (
                        <BarnetilleggPeriode
                            periode={periode}
                            index={index}
                            key={`${periode.periode.fraOgMed}-${index}`}
                        />
                    );
                })}
                <Button
                    variant={'secondary'}
                    size={'small'}
                    className={style.ny}
                    onClick={() => {
                        dispatch({ type: 'addBarnetilleggPeriode', payload: { tiltaksperiode } });
                    }}
                >
                    {'Ny periode for barnetillegg'}
                </Button>
            </VedtakSeksjon.Venstre>
        </>
    );
};

type PeriodeProps = {
    periode: VedtakBarnetilleggPeriode;
    index: number;
};

const BarnetilleggPeriode = ({ periode, index }: PeriodeProps) => {
    const dispatch = useFørstegangsVedtakDispatch();

    return (
        <div className={style.periode}>
            <Select
                label={'Antall barn'}
                size={'small'}
                className={style.antall}
                defaultValue={periode.antallBarn}
            >
                {Array.from({ length: MAKS_ANTALL_BARN + 1 }).map((_, index) => (
                    <option value={index} key={index}>
                        {index}
                    </option>
                ))}
            </Select>
            <Datovelger
                onDateChange={console.log}
                defaultSelected={periode.periode.fraOgMed}
                label={'Fra og med'}
                size={'small'}
            />
            <Datovelger
                onDateChange={console.log}
                defaultSelected={periode.periode.tilOgMed}
                label={'Til og med'}
                size={'small'}
            />

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
        </div>
    );
};
