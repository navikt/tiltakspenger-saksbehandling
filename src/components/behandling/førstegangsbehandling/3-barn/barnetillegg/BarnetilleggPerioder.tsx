import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../../vedtak/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { useFørstegangsbehandling } from '../../context/FørstegangsbehandlingContext';
import { hentTiltaksPeriode } from '../../../../../utils/tiltak';

import style from './BarnetilleggPerioder.module.css';

const MAKS_ANTALL_BARN = 20;

type Props = {};

export const BarnetilleggPerioder = ({}: Props) => {
    const { behandling } = useFørstegangsbehandling();

    const initiellTiltaksPeriode = hentTiltaksPeriode(behandling);

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                <div className={style.input}>
                    <Select label={'Antall barn'} size={'small'} className={style.antall}>
                        {Array.from({ length: MAKS_ANTALL_BARN + 1 }).map((_, index) => (
                            <option value={index} key={index}>
                                {index}
                            </option>
                        ))}
                    </Select>
                    <Datovelger
                        onDateChange={console.log}
                        defaultSelected={initiellTiltaksPeriode.fraOgMed}
                        label={'Fra og med'}
                        size={'small'}
                    />
                    <Datovelger
                        onDateChange={console.log}
                        defaultSelected={initiellTiltaksPeriode.tilOgMed}
                        label={'Til og med'}
                        size={'small'}
                    />
                </div>
                <Button variant={'tertiary'} size={'small'} className={style.fjern}>
                    {'Fjern periode'}
                </Button>
            </VedtakSeksjon.Venstre>
        </>
    );
};
