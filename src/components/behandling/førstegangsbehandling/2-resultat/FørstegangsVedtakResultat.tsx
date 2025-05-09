import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../datovelger/Datovelger';
import { classNames } from '../../../../utils/classNames';
import { dateTilISOTekst } from '../../../../utils/date';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import {
    useFørstegangsVedtakSkjema,
    useFørstegangsVedtakSkjemaDispatch,
} from '../context/FørstegangsVedtakContext';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { useFørstegangsbehandling } from '../../BehandlingContext';

import style from './FørstegangsVedtakResultat.module.css';
import { Behandlingsutfall } from '../../../../types/BehandlingTypes';
import { useFeatureToggles } from '../../../../context/feature-toggles/FeatureTogglesContext';

export const FørstegangsVedtakResultat = () => {
    const { rolleForBehandling } = useFørstegangsbehandling();
    const { valgteTiltaksdeltakelser, utfall, behandlingsperiode } = useFørstegangsVedtakSkjema();
    const { avslagToggle } = useFeatureToggles();
    const dispatch = useFørstegangsVedtakSkjemaDispatch();
    console.log('avslagToggle', avslagToggle);
    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <RadioGroup
                    legend={'Resultat'}
                    size={'small'}
                    className={style.radioGroup}
                    defaultValue={utfall}
                    readOnly={erIkkeSaksbehandler}
                    onChange={(valgtUtfall: Behandlingsutfall) => {
                        dispatch({
                            type: 'setResultat',
                            payload: {
                                utfall: valgtUtfall,
                            },
                        });
                    }}
                >
                    <Radio value={Behandlingsutfall.INNVILGELSE}>Innvilgelse</Radio>
                    <Radio value={Behandlingsutfall.AVSLAG} disabled={avslagToggle}>
                        Avslag {avslagToggle && '(støttes ikke ennå)'}
                    </Radio>
                </RadioGroup>
                <div className={classNames(style.datovelgere, !utfall && style.skjult)}>
                    <Datovelger
                        label={`${utfall === Behandlingsutfall.INNVILGELSE ? 'Innvilges' : 'Avslag'} f.o.m`}
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
                        label={`${utfall === Behandlingsutfall.INNVILGELSE ? 'Innvilges' : 'Avslag'} t.o.m`}
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
