import { Alert, Button, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { BehandlingsperiodeVelger } from '~/components/behandling/felles/behandlingsperiode/BehandlingsperiodeVelger';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';

import style from './SøknadsbehandlingResultatVelger.module.css';

export const SøknadsbehandlingResultatVelger = () => {
    const { rolleForBehandling, behandling } = useSøknadsbehandling();
    const { kanInnvilges } = behandling;

    const skjemaContext = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const { resultat } = skjemaContext;

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <RadioGroup
                    legend={'Resultat'}
                    size={'small'}
                    className={style.radioGroup}
                    value={resultat}
                    readOnly={erIkkeSaksbehandler}
                    onChange={(valgtResultat: SøknadsbehandlingResultat) => {
                        dispatch({ type: 'setResultat', payload: { resultat: valgtResultat } });
                    }}
                >
                    <Radio value={SøknadsbehandlingResultat.INNVILGELSE} disabled={!kanInnvilges}>
                        Innvilgelse
                    </Radio>
                    <Radio value={SøknadsbehandlingResultat.AVSLAG}>Avslag</Radio>
                    {resultat !== SøknadsbehandlingResultat.IKKE_VALGT && (
                        <Button
                            size={'xsmall'}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => {
                                dispatch({
                                    type: 'setResultat',
                                    payload: { resultat: SøknadsbehandlingResultat.IKKE_VALGT },
                                });
                            }}
                        >
                            {'Nullstill'}
                        </Button>
                    )}
                </RadioGroup>
                {resultat === SøknadsbehandlingResultat.INNVILGELSE && (
                    <BehandlingsperiodeVelger
                        behandling={behandling}
                        label={'Innvilges'}
                        className={style.datovelgere}
                    />
                )}
                {!kanInnvilges && (
                    <Alert
                        variant={'warning'}
                        size={'small'}
                        className={style.ikkeInnvilgbarVarsel}
                    >
                        {'Søknaden kan ikke innvilges'}
                    </Alert>
                )}
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
