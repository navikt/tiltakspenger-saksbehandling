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

    const håndterSendTilBeslutter = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = fetch(`/api/behandling/beslutter/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling sendt til beslutter');
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
                            onClick={() => console.log('Send tilbake')}
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
