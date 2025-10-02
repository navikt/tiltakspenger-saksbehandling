import { Heading } from '@navikt/ds-react';
import { RevurderingInnvilgelseBegrunnelse } from '~/components/behandling/revurdering/innvilgelse/1-begrunnelse/RevurderingInnvilgelseBegrunnelse';
import { RevurderingInnvilgelsesperiodeVelger } from '~/components/behandling/revurdering/innvilgelse/2-innvilgelsesperiode/RevurderingInnvilgelsesperiodeVelger';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/6-brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseSend } from '~/components/behandling/revurdering/innvilgelse/7-send-og-godkjenn/RevurderingInnvilgelseSend';
import { RevurderingInnvilgelseBarnetillegg } from '~/components/behandling/revurdering/innvilgelse/5-barn/RevurderingInnvilgelseBarnetillegg';
import { RevurderingDagerPerMeldeperiode } from './3-dager-per-meldeperiode/RevurderingDagerPerMeldeperiode';
import { BehandlingUtbetaling } from '~/components/behandling/felles/utbetaling/BehandlingUtbetaling';
import { RevurderingInnvilgelseTiltak } from '~/components/behandling/revurdering/innvilgelse/4-tiltak/RevurderingInnvilgelseTiltak';
import { BehandlingBeregningOgSimulering } from '~/components/simulering/BehandlingBeregningOgSimulering';

export const RevurderingInnvilgelseVedtak = () => {
    return (
        <>
            <Heading size={'medium'} level={'1'}>
                {'Revurdering av innvilgelse'}
            </Heading>
            <RevurderingInnvilgelseBegrunnelse />
            <RevurderingInnvilgelsesperiodeVelger />
            <RevurderingDagerPerMeldeperiode />
            <Separator />
            <RevurderingInnvilgelseTiltak />
            <RevurderingInnvilgelseBarnetillegg />
            <Separator />
            <RevurderingInnvilgelseBrev />
            <Separator />
            <BehandlingBeregningOgSimulering />
            <BehandlingUtbetaling />
            <RevurderingInnvilgelseSend />
        </>
    );
};
