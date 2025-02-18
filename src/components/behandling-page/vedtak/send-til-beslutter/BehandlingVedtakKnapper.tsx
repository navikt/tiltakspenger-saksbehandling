import { Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';

import style from './BehandlingVedtakKnapper.module.css';

export const BehandlingVedtakKnapper = () => {
    const { vedtakUnderBehandling } = useBehandling();

    return (
        <div className={style.knapper}>
            <Button size={'small'} variant={'secondary'} icon={<EnvelopeOpenIcon />}>
                {'Forhåndsvis brev'}
            </Button>
            <Button
                variant={'primary'}
                onClick={() => {
                    console.log('Sender inn vedtak - ', vedtakUnderBehandling);
                }}
            >
                {'Send til beslutter'}
            </Button>
        </div>
    );
};
