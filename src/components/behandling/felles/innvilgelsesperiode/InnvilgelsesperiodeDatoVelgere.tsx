import { useBehandlingInnvilgelseSkjemaDispatch } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { useSak } from '~/context/sak/SakContext';
import { Periode } from '~/types/Periode';
import { dateTilISOTekst, datoMin, datoTilDatoInputText } from '~/utils/date';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Datovelger, DatovelgerProps } from '~/components/datovelger/Datovelger';
import { TiltaksdeltakelseMedPeriode } from '~/types/TiltakDeltakelse';
import { periodiseringTotalPeriode } from '~/utils/periode';

type Props = {
    periode: Partial<Periode>;
    tiltaksdeltakelser: TiltaksdeltakelseMedPeriode[];
    index: number;
    readOnly: boolean;
};

export const InnvilgelsesperiodeDatovelgere = ({
    periode,
    tiltaksdeltakelser,
    index,
    readOnly,
}: Props) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const tiltaksdeltakelsesperiode = periodiseringTotalPeriode(tiltaksdeltakelser);

    const defaultDato = datoMin(new Date(), tiltaksdeltakelsesperiode.tilOgMed);

    const commonProps: Partial<DatovelgerProps> = {
        minDate: tiltaksdeltakelsesperiode.fraOgMed,
        maxDate: tiltaksdeltakelsesperiode.tilOgMed,
        defaultMonth: defaultDato,
        readOnly,
        size: 'small',
        dropdownCaption: true,
    };

    return (
        <>
            <Datovelger
                {...commonProps}
                label={'Fra og med'}
                selected={periode.fraOgMed}
                value={periode.fraOgMed ? datoTilDatoInputText(periode.fraOgMed) : undefined}
                error={!periode.fraOgMed && 'Velg dato'}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterInnvilgelsesperiode',
                        payload: {
                            periodeOppdatering: { fraOgMed: dateTilISOTekst(valgtDato) },
                            index,
                            behandling,
                            sak,
                        },
                    });
                }}
            />

            <Datovelger
                {...commonProps}
                label={'Til og med'}
                selected={periode.tilOgMed}
                value={periode.tilOgMed ? datoTilDatoInputText(periode.tilOgMed) : undefined}
                error={!periode.tilOgMed && 'Velg dato'}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterInnvilgelsesperiode',
                        payload: {
                            periodeOppdatering: { tilOgMed: dateTilISOTekst(valgtDato) },
                            index,
                            behandling,
                            sak,
                        },
                    });
                }}
            />
        </>
    );
};
