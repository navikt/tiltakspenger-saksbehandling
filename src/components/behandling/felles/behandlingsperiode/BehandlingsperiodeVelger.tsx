import { Datovelger } from '~/components/datovelger/Datovelger';
import { BehandlingData } from '~/types/BehandlingTypes';
import { dateTilISOTekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { Dispatch } from 'react';
import {
    InnvilgelseActions,
    InnvilgelseState,
} from '~/components/behandling/felles/state/InnvilgelseState';
import {
    TiltaksdeltagelseActions,
    TiltaksdeltagelseState,
} from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

import style from './BehandlingsperiodeVelger.module.css';
import {
    AntallDagerForMeldeperiodeAction,
    AntallDagerForMeldeperiodeState,
} from '../state/AntallDagerState';
import dayjs from 'dayjs';
import { BarnetilleggActions, BarnetilleggState } from '../state/BarnetilleggState';

type Props = {
    behandling: BehandlingData;
    dispatch: Dispatch<
        | TiltaksdeltagelseActions
        | InnvilgelseActions
        | AntallDagerForMeldeperiodeAction
        | BarnetilleggActions
    >;
    context: TiltaksdeltagelseState &
        InnvilgelseState &
        AntallDagerForMeldeperiodeState &
        BarnetilleggState;
    label: string;
    className?: string;
};

export const BehandlingsperiodeVelger = ({
    behandling,
    dispatch,
    context,
    label,
    className,
}: Props) => {
    const {
        behandlingsperiode,
        valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode,
        barnetilleggPerioder,
    } = context;

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={classNames(style.datovelgere, className)}>
            <Datovelger
                label={`${label} fra og med`}
                size={'small'}
                defaultSelected={behandlingsperiode.fraOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    const isoDate = dateTilISOTekst(valgtDato);

                    dispatch({
                        type: 'oppdaterBehandlingsperiode',
                        payload: { periode: { fraOgMed: isoDate } },
                    });

                    //vi ønsker at meldeperiode-perioden skal matche behandlingsperioden dersom den blir snevret inn
                    const oppdatertAntallDagerPerMeldeperiode = antallDagerPerMeldeperiode.map(
                        (m) =>
                            m.periode.fraOgMed && dayjs(isoDate).isAfter(m.periode.fraOgMed)
                                ? { ...m, periode: { ...m.periode, fraOgMed: isoDate } }
                                : m,
                    );

                    dispatch({
                        type: 'oppdaterAntallDagerForMeldeperiode',
                        payload: { antallDager: oppdatertAntallDagerPerMeldeperiode },
                    });

                    //vi ønsker at barnetillegg-perioden skal matche behandlingsperioden dersom den blir snevret inn
                    const oppdaterteBarnetillegg = barnetilleggPerioder.map((b) =>
                        b.periode.fraOgMed && dayjs(isoDate).isAfter(b.periode.fraOgMed)
                            ? { ...b, periode: { ...b.periode, fraOgMed: isoDate } }
                            : b,
                    );

                    dispatch({
                        type: 'oppdaterBarnetillegg',
                        payload: { barnetillegg: oppdaterteBarnetillegg },
                    });

                    /**
                     * Dersom vi kun har 1 tiltak på behandlingen, så viser vi ikke tiltaksperiodene, og saksbehandler har dermed
                     * ikke mulighet til å matche tiltaksperioden med den nye innvilgelsesperioden.
                     *
                     * Derfor oppdaterer vi tiltaksperioden til å matche innvilgelsesperioden.
                     */
                    if (valgteTiltaksdeltakelser.length === 1) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { index: 0, periode: { fraOgMed: isoDate } },
                        });
                    }
                }}
            />
            <Datovelger
                label={`${label} til og med`}
                size={'small'}
                defaultSelected={behandlingsperiode.tilOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    const isoDate = dateTilISOTekst(valgtDato);

                    dispatch({
                        type: 'oppdaterBehandlingsperiode',
                        payload: { periode: { tilOgMed: isoDate } },
                    });

                    //vi ønsker at meldeperiode-perioden skal matche behandlingsperioden dersom den blir snevret inn
                    const oppdatertAntallDagerPerMeldeperiode = antallDagerPerMeldeperiode.map(
                        (m) =>
                            m.periode.tilOgMed && dayjs(isoDate).isBefore(m.periode.tilOgMed)
                                ? { ...m, periode: { ...m.periode, tilOgMed: isoDate } }
                                : m,
                    );

                    dispatch({
                        type: 'oppdaterAntallDagerForMeldeperiode',
                        payload: { antallDager: oppdatertAntallDagerPerMeldeperiode },
                    });

                    //vi ønsker at barnetillegg-perioden skal matche behandlingsperioden dersom den blir snevret inn
                    const oppdaterteBarnetillegg = barnetilleggPerioder.map((b) =>
                        b.periode.tilOgMed && dayjs(isoDate).isBefore(b.periode.tilOgMed)
                            ? { ...b, periode: { ...b.periode, tilOgMed: isoDate } }
                            : b,
                    );
                    dispatch({
                        type: 'oppdaterBarnetillegg',
                        payload: { barnetillegg: oppdaterteBarnetillegg },
                    });

                    if (valgteTiltaksdeltakelser.length === 1) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { index: 0, periode: { tilOgMed: isoDate } },
                        });
                    }
                }}
            />
        </div>
    );
};
