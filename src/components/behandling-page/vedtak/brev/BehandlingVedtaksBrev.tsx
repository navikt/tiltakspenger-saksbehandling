import { Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';

export const BehandlingVedtaksBrev = () => {
    const { setBrevTekst, behandling } = useBehandling();
    const { fritekstTilVedtaksbrev } = behandling;

    return (
        <Textarea
            label={'Tekst til vedtaksbrev'}
            description={'Teksten vises i vedtaksbrevet til bruker.'}
            size={'small'}
            minRows={10}
            resize={'vertical'}
            defaultValue={fritekstTilVedtaksbrev ?? ''}
            onChange={(event) => {
                setBrevTekst(event.target.value);
            }}
        />
    );
};
