import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../datovelger/Datovelger';
import { classNames } from '../../../../utils/classNames';
import { VedtakResultat } from '../../../../types/VedtakTyper';
import { hentTiltaksPeriode } from '../../../../utils/tiltak';
import { dateTilISOTekst } from '../../../../utils/date';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { useFørstegangsbehandling } from '../context/FørstegangsbehandlingContext';
import { VedtakSeksjon } from '../../vedtak/seksjon/VedtakSeksjon';

import style from './FørstegangsbehandlingResultat.module.css';

export const FørstegangsbehandlingResultat = () => {
    const { behandling, vedtak, dispatch, rolleForBehandling } = useFørstegangsbehandling();

    const initiellTiltaksPeriode = hentTiltaksPeriode(behandling);

    const { resultat, innvilgelsesPeriode } = vedtak;

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <RadioGroup
                    legend={'Resultat'}
                    size={'small'}
                    className={style.radioGroup}
                    defaultValue={vedtak.resultat}
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
                        defaultSelected={initiellTiltaksPeriode.fraOgMed}
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
                        defaultSelected={initiellTiltaksPeriode.tilOgMed}
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
