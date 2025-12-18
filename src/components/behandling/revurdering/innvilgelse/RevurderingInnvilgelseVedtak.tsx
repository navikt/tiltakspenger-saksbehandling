import { Heading } from '@navikt/ds-react';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseSend } from '~/components/behandling/revurdering/innvilgelse/send-og-godkjenn/RevurderingInnvilgelseSend';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';

export const RevurderingInnvilgelseVedtak = () => {
    const { innvilgelse } = useRevurderingInnvilgelseSkjema();

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {'Revurdering av innvilgelse'}
            </Heading>
            <InnvilgelsesperiodeVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            {innvilgelse.harValgtPeriode && (
                <>
                    <BehandlingBarnetillegg />
                    <Separator />
                    <RevurderingInnvilgelseBrev />
                    <Separator />
                    <BehandlingBeregningOgSimulering />
                </>
            )}
            <RevurderingInnvilgelseSend />
        </>
    );
};
