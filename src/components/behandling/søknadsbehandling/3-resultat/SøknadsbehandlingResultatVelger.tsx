import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { BehandlingsperiodeVelger } from '~/components/behandling/felles/behandlingsperiode/BehandlingsperiodeVelger';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './SøknadsbehandlingResultatVelger.module.css';
import { BehandlingResultat } from '~/types/Behandling';

export const SøknadsbehandlingResultatVelger = () => {
    const { rolleForBehandling, behandling } = useSøknadsbehandling();

    const skjemaContext = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const { resultat } = skjemaContext;

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;
    const kanIkkeInnvilge = behandling.saksopplysninger?.tiltaksdeltagelse.length === 0;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <RadioGroup
                    legend={'Resultat'}
                    size={'small'}
                    className={style.radioGroup}
                    value={resultat}
                    readOnly={erIkkeSaksbehandler}
                    onChange={(valgtResultat: BehandlingResultat) => {
                        dispatch({ type: 'setResultat', payload: { resultat: valgtResultat } });
                    }}
                >
                    <Radio value={BehandlingResultat.INNVILGELSE} disabled={kanIkkeInnvilge}>
                        Innvilgelse
                    </Radio>
                    <Radio value={BehandlingResultat.AVSLAG}>Avslag</Radio>
                    {resultat && (
                        <Button
                            size={'xsmall'}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => {
                                dispatch({
                                    type: 'setResultat',
                                    payload: { resultat: BehandlingResultat.IKKE_VALGT },
                                });
                            }}
                        >
                            {'Nullstill'}
                        </Button>
                    )}
                </RadioGroup>
                <BehandlingsperiodeVelger
                    behandling={behandling}
                    label={'Innvilges'}
                    className={classNames(
                        style.datovelgere,
                        resultat !== BehandlingResultat.INNVILGELSE && style.skjult,
                    )}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
