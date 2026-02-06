import { Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import {
    useOmgjøringSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { OmgjøringResultat, RevurderingResultat } from '~/types/Revurdering';
import { useSak } from '~/context/sak/SakContext';

import style from './OmgjøringResultatVelger.module.css';

export const OmgjøringResultatVelger = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const { resultat, erReadonly } = useOmgjøringSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

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
                    onChange={(valgtResultat: OmgjøringResultat) => {
                        dispatch({
                            type: 'setResultat',
                            payload: { resultat: valgtResultat, behandling, sak },
                        });
                    }}
                >
                    <Radio value={RevurderingResultat.OMGJØRING}>{'Innvilgelse'}</Radio>
                    <Radio value={RevurderingResultat.OMGJØRING_OPPHØR}>{'Opphør'}</Radio>
                    {resultat !== RevurderingResultat.OMGJØRING_IKKE_VALGT && !erReadonly && (
                        <Button
                            size={'xsmall'}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => {
                                dispatch({
                                    type: 'setResultat',
                                    payload: {
                                        resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
                                        behandling,
                                        sak,
                                    },
                                });
                            }}
                        >
                            {'Nullstill'}
                        </Button>
                    )}
                </RadioGroup>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
