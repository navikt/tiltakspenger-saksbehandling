import { Heading } from '@navikt/ds-react';
import { RevurderingStansSend } from './4-send/RevurderingStansSend';

import { RevurderingStansResultat } from './1-resultat/RevurderingStansResultat';
import { RevurderingStansBegrunnelse } from './2-begrunnelse/RevurderingStansBegrunnelse';
import { RevurderingStansBrev } from './3-brev/RevurderingStansBrev';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';

import style from './RevurderingStansVedtak.module.css';
import Divider from '~/components/divider/Divider';

export const RevurderingStansVedtak = () => {
    return (
        <>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering til stans av tiltakspenger'}
            </Heading>
            <RevurderingStansResultat />
            <RevurderingStansBegrunnelse />
            <Divider color="black" margin="1.25rem 0" />
            <RevurderingStansBrev />
            <Divider color="black" margin="1.25rem 0" />
            <BehandlingBeregningOgSimulering />
            <RevurderingStansSend />
        </>
    );
};
