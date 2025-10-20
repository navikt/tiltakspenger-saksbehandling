import { Datovelger } from '~/components/datovelger/Datovelger';
import { BehandlingData } from '~/types/BehandlingTypes';
import { dateTilISOTekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import dayjs from 'dayjs';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BehandlingsperiodeVelger.module.css';

type Props = {
    behandling: BehandlingData;
    label: string;
    className?: string;
};

export const BehandlingsperiodeVelger = ({ behandling, label, className }: Props) => {
    const { behandlingsperiode, antallDagerPerMeldeperiode, barnetilleggPerioder } =
        useBehandlingSkjema();

    const dispatch = useBehandlingSkjemaDispatch();

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

                    // TODO: flytt all logikken under inn i reducer action'en for oppdaterBehandlingsperiode
                    //vi ønsker at meldeperiode-perioden skal matche behandlingsperioden dersom den blir snevret inn
                    const oppdatertAntallDagerPerMeldeperiode = antallDagerPerMeldeperiode.map(
                        (m) =>
                            m.periode.fraOgMed && dayjs(isoDate).isAfter(m.periode.fraOgMed)
                                ? { ...m, periode: { ...m.periode, fraOgMed: isoDate } }
                                : m,
                    );

                    dispatch({
                        type: 'oppdaterAntallDagerPerioder',
                        payload: { perioder: oppdatertAntallDagerPerMeldeperiode },
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
                        type: 'oppdaterAntallDagerPerioder',
                        payload: { perioder: oppdatertAntallDagerPerMeldeperiode },
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
                }}
            />
        </div>
    );
};
