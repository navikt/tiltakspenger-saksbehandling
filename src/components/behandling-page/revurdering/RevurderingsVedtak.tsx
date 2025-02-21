import { useBehandling } from '../context/BehandlingContext';
import { Behandlingstype } from '../../../types/BehandlingTypes';
import { Heading } from '@navikt/ds-react';
import { RevurderingContextState, RevurderingProvider } from './RevurderingContext';
import { RevurderingStansSkjema } from './stans-skjema/RevurderingStansSkjema';

import style from './RevurderingsVedtak.module.css';

export const RevurderingsVedtak = () => {
    const behandlingContext = useBehandling();

    if (behandlingContext.behandling.type !== Behandlingstype.REVURDERING) {
        return null;
    }

    return (
        <RevurderingProvider behandlingContext={behandlingContext as RevurderingContextState}>
            <div className={style.wrapper}>
                <Heading size={'medium'} level={'1'} className={style.heading}>
                    {'Revurdering (stans)'}
                </Heading>
                <RevurderingStansSkjema />
            </div>
        </RevurderingProvider>
    );
};
