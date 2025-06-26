import { Radio, RadioGroup } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingsperiodeVelger } from '~/components/behandling/felles/behandlingsperiode/BehandlingsperiodeVelger';

import style from './SøknadsbehandlingResultatVelger.module.css';

export const SøknadsbehandlingResultatVelger = () => {
    const { rolleForBehandling, behandling } = useSøknadsbehandling();

    const skjemaContext = useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

    const { resultat } = skjemaContext;

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;
    const kanIkkeInnvilge = behandling.saksopplysninger.tiltaksdeltagelse.length === 0;

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
                        dispatch({ type: 'setResultat', payload: { resultat: valgtResultat } });
                    }}
                >
                    <Radio value={SøknadsbehandlingResultat.INNVILGELSE} disabled={kanIkkeInnvilge}>
                        Innvilgelse
                    </Radio>
                    <Radio value={SøknadsbehandlingResultat.AVSLAG}>Avslag</Radio>
                </RadioGroup>
                <BehandlingsperiodeVelger
                    behandling={behandling}
                    context={skjemaContext}
                    dispatch={dispatch}
                    label={
                        resultat === SøknadsbehandlingResultat.INNVILGELSE ? 'Innvilges' : 'Avslag'
                    }
                    className={classNames(style.datovelgere, !resultat && style.skjult)}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
