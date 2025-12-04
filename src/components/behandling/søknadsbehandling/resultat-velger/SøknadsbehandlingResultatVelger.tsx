import { Alert, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

import style from './SøknadsbehandlingResultatVelger.module.css';

export const SøknadsbehandlingResultatVelger = () => {
    const { rolleForBehandling, behandling } = useSøknadsbehandling();
    const { kanInnvilges, status } = behandling;

    const { resultat } = useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;
    const erUnderBehandling = status === Rammebehandlingsstatus.UNDER_BEHANDLING;

    const erReadonly = erIkkeSaksbehandler || !erUnderBehandling;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Resultat'}
                </Heading>
                <RadioGroup
                    legend={'Resultat'}
                    hideLegend={true}
                    size={'small'}
                    className={style.radioGroup}
                    value={resultat}
                    readOnly={erReadonly}
                    onChange={(valgtResultat: SøknadsbehandlingResultat) => {
                        dispatch({
                            type: 'setResultat',
                            payload: { resultat: valgtResultat, behandling },
                        });
                    }}
                >
                    <Radio value={SøknadsbehandlingResultat.INNVILGELSE} disabled={!kanInnvilges}>
                        {'Innvilgelse'}
                    </Radio>
                    <Radio value={SøknadsbehandlingResultat.AVSLAG}>Avslag</Radio>
                    {resultat !== SøknadsbehandlingResultat.IKKE_VALGT && !erReadonly && (
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
