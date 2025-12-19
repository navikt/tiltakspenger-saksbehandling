import {
    useBehandlingInnvilgelseSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { useSak } from '~/context/sak/SakContext';
import { Periode } from '~/types/Periode';
import { dateTilISOTekst, datoMin } from '~/utils/date';
import { PeriodeVelger } from '~/components/periode/PeriodeVelger';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

type Props = {
    periode: Partial<Periode>;
    tiltaksdeltakelsesperiode: Periode;
    index: number;
};

export const InnvilgelsesperiodeDatovelgere = ({
    periode,
    tiltaksdeltakelsesperiode,
    index,
}: Props) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { erReadonly } = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const defaultDato = datoMin(new Date(), tiltaksdeltakelsesperiode.tilOgMed);

    return (
        <PeriodeVelger
            fraOgMed={{
                label: 'Fra og med',
                defaultSelected: periode.fraOgMed,
                minDate: tiltaksdeltakelsesperiode.fraOgMed,
                maxDate: periode.tilOgMed ?? tiltaksdeltakelsesperiode.tilOgMed,
                defaultMonth: defaultDato,
                error: !periode.fraOgMed && 'Velg dato',
                onDateChange: (valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterInnvilgelsesperiode',
                        payload: {
                            periode: { fraOgMed: dateTilISOTekst(valgtDato) },
                            index,
                            behandling,
                            sak,
                        },
                    });
                },
            }}
            tilOgMed={{
                label: 'Til og med',
                defaultSelected: periode.tilOgMed,
                minDate: periode.fraOgMed ?? tiltaksdeltakelsesperiode.fraOgMed,
                maxDate: tiltaksdeltakelsesperiode.tilOgMed,
                defaultMonth: defaultDato,
                error: !periode.tilOgMed && 'Velg dato',
                onDateChange: (valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterInnvilgelsesperiode',
                        payload: {
                            periode: { tilOgMed: dateTilISOTekst(valgtDato) },
                            index,
                            behandling,
                            sak,
                        },
                    });
                },
            }}
            readOnly={erReadonly}
        />
    );
};
