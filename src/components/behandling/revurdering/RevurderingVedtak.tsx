import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingStansVedtak } from '~/components/behandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/components/behandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';
import { Alert } from '@navikt/ds-react';
import { RevurderingOmgjøringVedtak } from './omgjøring/RevurderingOmgjøringVedtak';
import { RevurderingResultat } from '~/types/Revurdering';

export const RevurderingVedtak = () => {
    const { resultat } = useRevurderingBehandling().behandling;

    switch (resultat) {
        case RevurderingResultat.STANS:
            return <RevurderingStansVedtak />;
        case RevurderingResultat.INNVILGELSE:
            return <RevurderingInnvilgelseVedtak />;
        case RevurderingResultat.OMGJØRING:
            return <RevurderingOmgjøringVedtak />;
    }

    return (
        <Alert variant={'error'}>{`Ugyldig revurderingstype: ${resultat satisfies never}`}</Alert>
    );
};
