import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingStansVedtak } from '~/components/behandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/components/behandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';
import { Alert } from '@navikt/ds-react';
import { RammebehandlingResultat } from '~/types/Behandling';
import { RevurderingOmgjøringVedtak } from './omgjøring/RevurderingOmgjøringVedtak';

export const RevurderingVedtak = () => {
    const { resultat } = useRevurderingBehandling().behandling;

    switch (resultat) {
        case RammebehandlingResultat.STANS:
            return <RevurderingStansVedtak />;
        case RammebehandlingResultat.REVURDERING_INNVILGELSE:
            return <RevurderingInnvilgelseVedtak />;
        case RammebehandlingResultat.OMGJØRING:
            return <RevurderingOmgjøringVedtak />;
    }

    return (
        <Alert variant={'error'}>{`Ugyldig revurderingstype: ${resultat satisfies never}`}</Alert>
    );
};
