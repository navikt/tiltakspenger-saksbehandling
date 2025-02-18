import { Alert, Button } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';
import { useSendVedtakTilBeslutter } from './useSendVedtakTilBeslutter';

import style from './BehandlingVedtakKnapper.module.css';

export const BehandlingVedtakKnapper = () => {
    const { vedtakUnderBehandling } = useBehandling();
    const { sendTilBeslutter, isLoading, error } = useSendVedtakTilBeslutter();

    return (
        <>
            {error && (
                <Alert
                    variant={'error'}
                    className={style.varsel}
                >{`Feil ved send til beslutter: [${error.status}] ${error.info?.melding || error.message}`}</Alert>
            )}
            <div className={style.knapper}>
                <Button size={'small'} variant={'secondary'} icon={<EnvelopeOpenIcon />}>
                    {'Forhåndsvis brev'}
                </Button>
                <Button
                    variant={'primary'}
                    loading={isLoading}
                    onClick={() => {
                        console.log('Sender inn vedtak - ', vedtakUnderBehandling);
                        sendTilBeslutter();
                    }}
                >
                    {'Send til beslutter'}
                </Button>
            </div>
        </>
    );
};
