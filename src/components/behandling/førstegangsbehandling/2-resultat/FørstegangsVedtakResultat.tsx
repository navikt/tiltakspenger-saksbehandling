import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../datovelger/Datovelger';
import { classNames } from '../../../../utils/classNames';
import { VedtakResultat } from '../../../../types/VedtakTyper';
import { dateTilISOTekst } from '../../../../utils/date';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import {
    useFørstegangsVedtakSkjema,
    useFørstegangsVedtakSkjemaDispatch,
} from '../context/FørstegangsVedtakContext';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useFørstegangsbehandling } from '../../BehandlingContext';

import style from './FørstegangsVedtakResultat.module.css';

export const FørstegangsVedtakResultat = () => {
    const { rolleForBehandling } = useFørstegangsbehandling();
    const { valgteTiltaksdeltakelser, resultat, innvilgelsesPeriode } =
        useFørstegangsVedtakSkjema();

    const dispatch = useFørstegangsVedtakSkjemaDispatch();

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
                    onChange={(valgtResultat: VedtakResultat) => {
                        dispatch({
                            type: 'setResultat',
                            payload: { resultat: { resultat: valgtResultat, innvilgelsesPeriode } },
                        });
                    }}
                >
                    <Radio value={'innvilget' satisfies VedtakResultat}>{'Innvilgelse'}</Radio>
                    <Radio value={'avslag' satisfies VedtakResultat} disabled={true}>
                        {'Avslag (støttes ikke ennå)'}
                    </Radio>
                </RadioGroup>
                <div
                    className={classNames(
                        style.datovelgere,
                        resultat !== 'innvilget' && style.skjult,
                    )}
                >
                    <Datovelger
                        label={'Innvilges f.o.m'}
                        size={'small'}
                        defaultSelected={innvilgelsesPeriode.fraOgMed}
                        readOnly={erIkkeSaksbehandler}
                        onDateChange={(valgtDato) => {
                            if (valgtDato) {
                                const isoDate = dateTilISOTekst(valgtDato);
                                dispatch({
                                    type: 'oppdaterInnvilgetPeriode',
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
                        label={'Innvilges t.o.m'}
                        size={'small'}
                        defaultSelected={innvilgelsesPeriode.tilOgMed}
                        readOnly={erIkkeSaksbehandler}
                        onDateChange={(valgtDato) => {
                            if (valgtDato) {
                                const isoDate = dateTilISOTekst(valgtDato);
                                dispatch({
                                    type: 'oppdaterInnvilgetPeriode',
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
