import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../datovelger/Datovelger';
import { classNames } from '../../../../utils/classNames';
import { dateTilISOTekst } from '../../../../utils/date';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../BehandlingContext';

import style from './SøknadsbehandlingResultat.module.css';
import { BehandlingResultat } from '../../../../types/BehandlingTypes';

export const SøknadsbehandlingResultat = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { valgteTiltaksdeltakelser, resultat, behandlingsperiode } = useSøknadsbehandlingSkjema();

    const dispatch = useSøknadsbehandlingSkjemaDispatch();
    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <RadioGroup
                    legend={'Resultat'}
                    size={'small'}
                    className={style.radioGroup}
                    defaultValue={resultat}
                    readOnly={erIkkeSaksbehandler}
                    onChange={(valgtResultat: BehandlingResultat) => {
                        dispatch({
                            type: 'setResultat',
                            payload: {
                                resultat: valgtResultat,
                            },
                        });
                    }}
                >
                    <Radio value={BehandlingResultat.INNVILGELSE}>Innvilgelse</Radio>
                    <Radio value={BehandlingResultat.AVSLAG}>Avslag</Radio>
                </RadioGroup>
                <div className={classNames(style.datovelgere, !resultat && style.skjult)}>
                    <Datovelger
                        label={`${resultat === BehandlingResultat.INNVILGELSE ? 'Innvilges' : 'Avslag'} f.o.m`}
                        size={'small'}
                        defaultSelected={behandlingsperiode.fraOgMed}
                        readOnly={erIkkeSaksbehandler}
                        onDateChange={(valgtDato) => {
                            if (valgtDato) {
                                const isoDate = dateTilISOTekst(valgtDato);
                                dispatch({
                                    type: 'oppdaterBehandlingsperiode',
                                    payload: { periode: { fraOgMed: isoDate } },
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
                            }
                        }}
                    />
                    <Datovelger
                        label={`${resultat === BehandlingResultat.INNVILGELSE ? 'Innvilges' : 'Avslag'} t.o.m`}
                        size={'small'}
                        defaultSelected={behandlingsperiode.tilOgMed}
                        readOnly={erIkkeSaksbehandler}
                        onDateChange={(valgtDato) => {
                            if (valgtDato) {
                                const isoDate = dateTilISOTekst(valgtDato);
                                dispatch({
                                    type: 'oppdaterBehandlingsperiode',
                                    payload: { periode: { tilOgMed: isoDate } },
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
                                        payload: { index: 0, periode: { tilOgMed: isoDate } },
                                    });
                                }
                            }
                        }}
                    />
                </div>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
