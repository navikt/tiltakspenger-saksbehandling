import { Button, HStack } from '@navikt/ds-react';
import styles from './BehandlingSkjema.module.css';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';

interface behandlingSkjemaProps {
    behandlingid: string;
}

export const BehandlingSkjema = ({ behandlingid }: behandlingSkjemaProps) => {
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
        <form onSubmit={håndterSendTilBeslutter} className={styles.behandlingSkjema}>
            <HStack justify="end" gap="3" align="end">
                <Button type="submit" size="small">
                    Send til beslutter
                </Button>
            </HStack>
        </form>
    );
};
