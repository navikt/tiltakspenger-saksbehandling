import { Alert, Button, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

import style from './SøknadsbehandlingResultatVelger.module.css';

export const SøknadsbehandlingResultatVelger = () => {
    const { rolleForBehandling, behandling } = useSøknadsbehandling();
    const { kanInnvilges } = behandling;

    const { resultat } = useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

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
                        dispatch({
                            type: 'setResultat',
                            payload: { resultat: valgtResultat, behandling },
                        });
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
                                    payload: {
                                        resultat: SøknadsbehandlingResultat.IKKE_VALGT,
                                        behandling,
                                    },
                                });
                            }}
                        >
                            {'Nullstill'}
                        </Button>
                    )}
                </RadioGroup>
                {resultat === SøknadsbehandlingResultat.INNVILGELSE && (
                    <InnvilgelsesperiodeVelger behandling={behandling} label={'Innvilges'} />
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
