import { Button, Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';

import style from './BehandlingVedtaksBrev.module.css';

export const BehandlingVedtaksBrev = () => {
    const { setBrevTekst, behandling } = useBehandling();
    const { fritekstTilVedtaksbrev } = behandling;

    return (
        <div className={style.wrapper}>
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
            <Button
                size={'small'}
                variant={'secondary'}
                icon={<EnvelopeOpenIcon />}
                className={style.knapp}
            >
                {'Forhåndsvis brev'}
            </Button>
        </div>
    );
};
