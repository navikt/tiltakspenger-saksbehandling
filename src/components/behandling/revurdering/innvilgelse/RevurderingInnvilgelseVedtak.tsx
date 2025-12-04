import { Heading } from '@navikt/ds-react';
import { RevurderingInnvilgelseBegrunnelse } from '~/components/behandling/revurdering/innvilgelse/begrunnelse/RevurderingInnvilgelseBegrunnelse';

import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseSend } from '~/components/behandling/revurdering/innvilgelse/send-og-godkjenn/RevurderingInnvilgelseSend';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';
import { BehandlingDagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import Divider from '~/components/divider/Divider';

export const RevurderingInnvilgelseVedtak = () => {
    const { innvilgelse } = useRevurderingInnvilgelseSkjema();

    return (
        <>
            <Heading size={'medium'} level={'1'}>
                {'Revurdering av innvilgelse'}
            </Heading>
            <RevurderingInnvilgelseBegrunnelse />
            <Divider color="black" margin="1.25rem 0" />
            <InnvilgelsesperiodeVelger />
            <Divider color="black" margin="1.25rem 0" />
            {innvilgelse.harValgtPeriode && (
                <>
                    <BehandlingDagerPerMeldeperiode />
                    <Divider color="black" margin="1.25rem 0" />
                    <BehandlingTiltak />
                    <BehandlingBarnetillegg />
                    <Divider color="black" margin="1.25rem 0" />
                    <RevurderingInnvilgelseBrev />
                    <Divider color="black" margin="1.25rem 0" />
                    <BehandlingBeregningOgSimulering />
                </>
            )}
            <RevurderingInnvilgelseSend />
        </>
    );
};
