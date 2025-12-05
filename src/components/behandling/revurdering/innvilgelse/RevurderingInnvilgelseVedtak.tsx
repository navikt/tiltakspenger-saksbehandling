import { Heading } from '@navikt/ds-react';
import { RevurderingInnvilgelseBegrunnelse } from '~/components/behandling/revurdering/innvilgelse/begrunnelse/RevurderingInnvilgelseBegrunnelse';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseSend } from '~/components/behandling/revurdering/innvilgelse/send-og-godkjenn/RevurderingInnvilgelseSend';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';
import { BehandlingDagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';

export const RevurderingInnvilgelseVedtak = () => {
    const { innvilgelse } = useRevurderingInnvilgelseSkjema();

    return (
        <>
            <Heading size={'medium'} level={'1'}>
                {'Revurdering av innvilgelse'}
            </Heading>
            <RevurderingInnvilgelseBegrunnelse />
            <Separator />
            <InnvilgelsesperiodeVelger />
            <Separator />
            {innvilgelse.harValgtPeriode && (
                <>
                    <BehandlingDagerPerMeldeperiode />
                    <Separator />
                    <BehandlingTiltak />
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
