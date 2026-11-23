import { Heading } from '@navikt/ds-react';
import { RevurderingStansHandlinger } from './4-handlinger/RevurderingStansHandlinger';
import { Separator } from '~/lib/_felles/separator/Separator';
import { RevurderingStansResultat } from './1-resultat/RevurderingStansResultat';
import { RevurderingStansBegrunnelse } from './2-begrunnelse/RevurderingStansBegrunnelse';
import { RevurderingStansBrev } from './3-brev/RevurderingStansBrev';
import { BehandlingBeregningOgSimulering } from '~/lib/rammebehandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { RevurderingAutomatiskOpprettetGrunn } from '~/lib/rammebehandling/revurdering/felles/automatisk-opprettet-grunn/RevurderingAutomatiskOpprettetGrunn';
import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';

import style from './RevurderingStansVedtak.module.css';
import { BehandlingPrioritering } from '~/lib/rammebehandling/felles/prioritering/BehandlingPrioritering';

export const RevurderingStansVedtak = () => {
    const { automatiskOpprettedeGrunner, manueltBehandlesGrunner } =
        useRevurderingBehandling().behandling;

    return (
        <>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering til stans av tiltakspenger'}
            </Heading>
            {automatiskOpprettedeGrunner.length > 0 && (
                <>
                    <RevurderingAutomatiskOpprettetGrunn
                        automatiskOpprettedeGrunner={automatiskOpprettedeGrunner}
                        manueltBehandlesGrunner={manueltBehandlesGrunner}
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
            <Separator />
            <BehandlingPrioritering />
            <RevurderingStansHandlinger />
        </>
    );
};
