import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../datovelger/Datovelger';
import { classNames } from '~/utils/classNames';
import { dateTilISOTekst } from '~/utils/date';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';

import style from './SøknadsbehandlingResultatVelger.module.css';

export const SøknadsbehandlingResultatVelger = () => {
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
                    onChange={(valgtResultat: SøknadsbehandlingResultat) => {
                        dispatch({
                            type: 'setResultat',
                            payload: {
                                resultat: valgtResultat,
                            },
                        });
                    }}
                >
                    <Radio value={SøknadsbehandlingResultat.INNVILGELSE}>Innvilgelse</Radio>
                    <Radio value={SøknadsbehandlingResultat.AVSLAG}>Avslag</Radio>
                </RadioGroup>
                <div className={classNames(style.datovelgere, !resultat && style.skjult)}>
                    <Datovelger
                        label={`${resultat === SøknadsbehandlingResultat.INNVILGELSE ? 'Innvilges' : 'Avslag'} f.o.m`}
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
                        label={`${resultat === SøknadsbehandlingResultat.INNVILGELSE ? 'Innvilges' : 'Avslag'} t.o.m`}
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
