import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { RevurderingStansVedtak } from '~/lib/rammebehandling/revurdering/stans/RevurderingStansVedtak';
import { RevurderingInnvilgelseVedtak } from '~/lib/rammebehandling/revurdering/innvilgelse/RevurderingInnvilgelseVedtak';

import { RevurderingOmgjøringVedtak } from './omgjøring/RevurderingOmgjøringVedtak';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

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
        <Infokort
            variant={'feil'}
        >{`Ugyldig revurderingstype: ${resultat satisfies never}`}</Infokort>
    );
};
