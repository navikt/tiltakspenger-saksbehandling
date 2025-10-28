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
import { RammebehandlingResultatType } from '~/types/Behandling';

import style from './SøknadsbehandlingResultatVelger.module.css';

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
                    onChange={(valgtResultat: RammebehandlingResultatType) => {
                        dispatch({ type: 'setResultat', payload: { resultat: valgtResultat } });
                    }}
                >
                    <Radio
                        value={RammebehandlingResultatType.INNVILGELSE}
                        disabled={kanIkkeInnvilge}
                    >
                        Innvilgelse
                    </Radio>
                    <Radio value={RammebehandlingResultatType.AVSLAG}>Avslag</Radio>
                    {resultat !== RammebehandlingResultatType.IKKE_VALGT && (
                        <Button
                            size={'xsmall'}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => {
                                dispatch({
                                    type: 'setResultat',
                                    payload: { resultat: RammebehandlingResultatType.IKKE_VALGT },
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
                        resultat !== RammebehandlingResultatType.INNVILGELSE && style.skjult,
                    )}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
