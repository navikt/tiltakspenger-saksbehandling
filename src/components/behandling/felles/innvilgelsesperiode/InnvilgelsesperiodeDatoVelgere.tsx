import { useBehandlingInnvilgelseSkjemaDispatch } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { useSak } from '~/context/sak/SakContext';
import { Periode } from '~/types/Periode';
import { dateTilISOTekst, datoMin, datoTilDatoInputText } from '~/utils/date';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Datovelger } from '~/components/datovelger/Datovelger';
import React from 'react';

type Props = {
    periode: Partial<Periode>;
    tiltaksdeltakelsesperiode: Periode;
    index: number;
    readOnly: boolean;
};

export const InnvilgelsesperiodeDatovelgere = ({
    periode,
    tiltaksdeltakelsesperiode,
    index,
    readOnly,
}: Props) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const defaultDato = datoMin(new Date(), tiltaksdeltakelsesperiode.tilOgMed);

    return (
        <>
            <Datovelger
                label={'Fra og med'}
                selected={periode.fraOgMed}
                value={periode.fraOgMed ? datoTilDatoInputText(periode.fraOgMed) : undefined}
                minDate={tiltaksdeltakelsesperiode.fraOgMed}
                maxDate={periode.tilOgMed ?? tiltaksdeltakelsesperiode.tilOgMed}
                defaultMonth={defaultDato}
                error={!periode.fraOgMed && 'Velg dato'}
                readOnly={readOnly}
                size={'small'}
                onDateChange={(valgtDato) => {
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
                }}
            />

            <Datovelger
                label={'Til og med'}
                selected={periode.tilOgMed}
                value={periode.tilOgMed ? datoTilDatoInputText(periode.tilOgMed) : undefined}
                minDate={periode.fraOgMed ?? tiltaksdeltakelsesperiode.fraOgMed}
                maxDate={tiltaksdeltakelsesperiode.tilOgMed}
                defaultMonth={defaultDato}
                error={!periode.tilOgMed && 'Velg dato'}
                readOnly={readOnly}
                size={'small'}
                onDateChange={(valgtDato) => {
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
                }}
            />
        </>
    );
};
