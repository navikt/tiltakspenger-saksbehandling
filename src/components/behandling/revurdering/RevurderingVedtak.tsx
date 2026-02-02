import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingStansVedtak } from '~/components/behandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/components/behandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';
import { Alert } from '@navikt/ds-react';
import { RevurderingOmgjøringVedtak } from './omgjøring/RevurderingOmgjøringVedtak';
import { RevurderingResultat } from '~/types/Revurdering';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';

export const RevurderingVedtak = (props: { klage: Nullable<Klagebehandling> }) => {
    const { resultat } = useRevurderingBehandling().behandling;

    switch (resultat) {
        case RevurderingResultat.STANS:
            return <RevurderingStansVedtak />;
        case RevurderingResultat.INNVILGELSE:
            return <RevurderingInnvilgelseVedtak klage={props.klage} />;
        case RevurderingResultat.OMGJØRING:
            return <RevurderingOmgjøringVedtak klage={props.klage} />;
    }

    return (
        <Alert variant={'error'}>{`Ugyldig revurderingstype: ${resultat satisfies never}`}</Alert>
    );
};
