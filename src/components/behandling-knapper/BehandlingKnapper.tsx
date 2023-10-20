import { Button, HStack } from '@navikt/ds-react';
import styles from './BehandlingSkjema.module.css';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';

interface behandlingKnapperProps {
    behandlingid: string;
    tilstand: string;
}

export const BehandlingKnapper = ({ behandlingid, tilstand }: behandlingKnapperProps) => {
    const mutator = useSWRConfig().mutate;

    const håndterSendTilBeslutter = () => {
        const res = fetch(`/api/behandling/beslutter/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling sendt til beslutter');
            });
        });
    };

    const håndterSendTilbake = () => {
        const res = fetch(`/api/behandling/sendtilbake/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling sendt tilbake til saksbehandler');
            });
        });
    };

    return (
        <HStack justify="end" gap="3" align="end" className={styles.behandlingSkjema}>
            <>
                {tilstand == 'tilBeslutter' ? (
                    <>
                        <Button
                            type="submit"
                            size="small"
                            variant="secondary"
                            onClick={() => håndterSendTilbake()}
                        >
                            Send tilbake
                        </Button>
                        <Button type="submit" size="small" onClick={() => console.log('Godkjenner vedtak')}>
                            Godkjenn vedtaket
                        </Button>
                    </>
                ) : (
                    <Button type="submit" size="small" onClick={() => håndterSendTilBeslutter()}>
                        Send til beslutter{' '}
                    </Button>
                )}
            </>
        </HStack>
    );
};
