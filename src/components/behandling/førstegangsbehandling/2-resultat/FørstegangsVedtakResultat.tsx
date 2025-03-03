import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../datovelger/Datovelger';
import { classNames } from '../../../../utils/classNames';
import { VedtakResultat } from '../../../../types/VedtakTyper';
import { hentTiltaksperiode } from '../../../../utils/behandling';
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
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { resultat, innvilgelsesPeriode } = useFørstegangsVedtakSkjema();

    const dispatch = useFørstegangsVedtakSkjemaDispatch();

    const initiellTiltaksperiode = hentTiltaksperiode(behandling);

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
                        defaultSelected={initiellTiltaksperiode.fraOgMed}
                        readOnly={erIkkeSaksbehandler}
                        onDateChange={(valgtDato) => {
                            if (valgtDato) {
                                dispatch({
                                    type: 'oppdaterInnvilgetPeriode',
                                    payload: {
                                        periode: {
                                            fraOgMed: dateTilISOTekst(valgtDato),
                                        },
                                    },
                                });
                            }
                        }}
                    />
                    <Datovelger
                        label={'Innvilges t.o.m'}
                        size={'small'}
                        defaultSelected={initiellTiltaksperiode.tilOgMed}
                        readOnly={erIkkeSaksbehandler}
                        onDateChange={(valgtDato) => {
                            if (valgtDato) {
                                dispatch({
                                    type: 'oppdaterInnvilgetPeriode',
                                    payload: {
                                        periode: {
                                            tilOgMed: dateTilISOTekst(valgtDato),
                                        },
                                    },
                                });
                            }
                        }}
                    />
                </div>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
