import { Heading } from '@navikt/ds-react';
import { RevurderingStansSend } from './4-send/RevurderingStansSend';
import { Separator } from '~/lib/_felles/separator/Separator';
import { RevurderingStansResultat } from './1-resultat/RevurderingStansResultat';
import { RevurderingStansBegrunnelse } from './2-begrunnelse/RevurderingStansBegrunnelse';
import { RevurderingStansBrev } from './3-brev/RevurderingStansBrev';
import { BehandlingBeregningOgSimulering } from '~/lib/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { RevurderingAutomatiskOpprettetGrunn } from '~/lib/behandling/revurdering/felles/automatisk-opprettet-grunn/RevurderingAutomatiskOpprettetGrunn';
import { useRevurderingBehandling } from '~/lib/behandling/context/BehandlingContext';

import style from './RevurderingStansVedtak.module.css';

export const RevurderingStansVedtak = () => {
    const { automatiskOpprettetGrunn } = useRevurderingBehandling().behandling;

    return (
        <>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering til stans av tiltakspenger'}
            </Heading>
            {automatiskOpprettetGrunn && (
                <>
                    <RevurderingAutomatiskOpprettetGrunn
                        automatiskOpprettetGrunn={automatiskOpprettetGrunn}
                    />
                    <Separator />
                </>
            )}
            <RevurderingStansResultat />
            <RevurderingStansBegrunnelse />
            <Separator />
            <RevurderingStansBrev />
            <Separator />
            <BehandlingBeregningOgSimulering />
            <RevurderingStansSend />
        </>
    );
};
