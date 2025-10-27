import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';

import { RevurderingStansVedtak } from '~/components/behandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/components/behandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';
import { Alert } from '@navikt/ds-react';
import React from 'react';
import { BehandlingResultat } from '~/types/Behandling';
import RevurderingOmgjøringVedtak from './omgjøring/RevurderingOmgjøringVedtak';

export const RevurderingVedtak = () => {
    const { behandling } = useRevurderingBehandling();
    const { resultat } = behandling;

    return resultat === BehandlingResultat.STANS ? (
        <RevurderingStansVedtak />
    ) : resultat === BehandlingResultat.REVURDERING_INNVILGELSE ? (
        <RevurderingInnvilgelseVedtak />
    ) : resultat === BehandlingResultat.OMGJØRING ? (
        <RevurderingOmgjøringVedtak />
    ) : (
        <Alert variant={'error'}>{`Revurderingstypen er ikke implementert: ${resultat}`}</Alert>
    );
};
