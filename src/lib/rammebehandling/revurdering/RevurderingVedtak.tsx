import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { RevurderingStansVedtak } from '~/lib/rammebehandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/lib/rammebehandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';
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
        case RevurderingResultat.OMGJØRING_OPPHØR:
        case RevurderingResultat.OMGJØRING_IKKE_VALGT:
            return <RevurderingOmgjøringVedtak />;
    }

    return (
        <Alert variant={'error'}>{`Ugyldig revurderingstype: ${resultat satisfies never}`}</Alert>
    );
};
