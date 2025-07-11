import { Heading } from '@navikt/ds-react';
import React from 'react';
import { RevurderingInnvilgelseBegrunnelse } from '~/components/behandling/revurdering/innvilgelse/1-begrunnelse/RevurderingInnvilgelseBegrunnelse';
import { RevurderingInnvilgelsesperiodeVelger } from '~/components/behandling/revurdering/innvilgelse/2-innvilgelsesperiode/RevurderingInnvilgelsesperiodeVelger';
import { RevurderingInnvilgelseVedtakProvider } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/6-brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseKnapper } from '~/components/behandling/revurdering/innvilgelse/7-send-og-godkjenn/RevurderingInnvilgelseSend';
import { RevurderingInnvilgelseBarnetillegg } from '~/components/behandling/revurdering/innvilgelse/5-barn/RevurderingInnvilgelseBarnetillegg';
import RevurderingDagerPerMeldeperiode from './3-dager-per-meldeperiode/RevurderingDagerPerMeldeperiode';
import { RevurderingInnvilgelseTiltak } from '~/components/behandling/revurdering/innvilgelse/4-tiltak/RevurderingInnvilgelseTiltak';

export const RevurderingInnvilgelseVedtak = () => {
    return (
        <RevurderingInnvilgelseVedtakProvider>
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
            <RevurderingInnvilgelseKnapper />
        </RevurderingInnvilgelseVedtakProvider>
    );
};
