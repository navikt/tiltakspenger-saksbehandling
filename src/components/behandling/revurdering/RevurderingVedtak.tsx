import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { RevurderingStansVedtak } from '~/components/behandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/components/behandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';
import { Alert } from '@navikt/ds-react';
import React from 'react';

export const RevurderingVedtak = () => {
    const { behandling } = useRevurderingBehandling();
    const { resultat } = behandling;

    return resultat === RevurderingResultat.STANS ? (
        <RevurderingStansVedtak />
    ) : resultat === RevurderingResultat.REVURDERING_INNVILGELSE ? (
        <RevurderingInnvilgelseVedtak />
    ) : (
        <Alert variant={'error'}>{`Revurderingstypen er ikke implementert: ${resultat}`}</Alert>
    );
};
