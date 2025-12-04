import { Periode } from '~/types/Periode';
import { erFullstendigPeriode, krympPeriodisering, utvidPeriodisering } from '~/utils/periode';
import { InnvilgelseState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { hentForhåndsutfyltInnvilgelse } from '~/components/behandling/context/behandlingSkjemaUtils';

export type InnvilgelsesperiodeAction = {
    type: 'oppdaterInnvilgelsesperiode';
    payload: { periode: Partial<Periode>; behandling: Rammebehandling; sak: SakProps };
};

export const innvilgelsesperiodeReducer: Reducer<InnvilgelseState, InnvilgelsesperiodeAction> = (
    state,
    action,
) => {
    const { harValgtPeriode } = state;
    const { periode, behandling, sak } = action.payload;

    if (!harValgtPeriode) {
        const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

        if (erFullstendigPeriode(nyInnvilgelsesperiode)) {
            return hentForhåndsutfyltInnvilgelse(behandling, nyInnvilgelsesperiode, sak);
        }

        return {
            ...state,
            innvilgelsesperiode: nyInnvilgelsesperiode,
        };
    }

    const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

    return {
        ...state,
        innvilgelsesperiode: nyInnvilgelsesperiode,

        valgteTiltaksdeltakelser: utvidPeriodisering(
            state.valgteTiltaksdeltakelser,
            nyInnvilgelsesperiode,
        ),

        antallDagerPerMeldeperiode: utvidPeriodisering(
            state.antallDagerPerMeldeperiode,
            nyInnvilgelsesperiode,
        ),

        barnetilleggPerioder: krympPeriodisering(state.barnetilleggPerioder, nyInnvilgelsesperiode),
    };
};
