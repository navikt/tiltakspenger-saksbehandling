import { Heading } from '@navikt/ds-react';
import { Separator } from '~/lib/_felles/separator/Separator';
import { BehandlingBeregningOgSimulering } from '~/lib/rammebehandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { BegrunnelseVilkårsvurdering } from '~/lib/rammebehandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { BehandlingPrioritering } from '~/lib/rammebehandling/felles/prioritering/BehandlingPrioritering';
import { useRevurderingForlengelseSkjema } from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { ForlengelsePeriodeVelger } from '~/lib/rammebehandling/revurdering/forlengelse/periode/ForlengelsePeriodeVelger';
import { ForlengelseBarnetillegg } from '~/lib/rammebehandling/revurdering/forlengelse/barnetillegg/ForlengelseBarnetillegg';
import { RevurderingForlengelseBrev } from '~/lib/rammebehandling/revurdering/forlengelse/brev/RevurderingForlengelseBrev';
import { RevurderingForlengelseHandlinger } from '~/lib/rammebehandling/revurdering/forlengelse/handlinger/RevurderingForlengelseHandlinger';

export const RevurderingForlengelseVedtak = () => {
    const { innvilgelse } = useRevurderingForlengelseSkjema();

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {'Forlengelse av innvilgelse'}
            </Heading>
            <ForlengelsePeriodeVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            {innvilgelse.harValgtPeriode && (
                <>
                    <Separator />
                    <ForlengelseBarnetillegg />
                    <Separator />
                    <RevurderingForlengelseBrev />
                    <BehandlingBeregningOgSimulering />
                </>
            )}
            <Separator />
            <BehandlingPrioritering />
            <Separator />
            <RevurderingForlengelseHandlinger />
        </>
    );
};
