import { Button, HStack } from '@navikt/ds-react';
import styles from './BehandlingSkjema.module.css';
import { FormEvent } from 'react';

interface behandlingSkjemaProps {
    behandlingid: string;
}

export const BehandlingSkjema = ({ behandlingid }: behandlingSkjemaProps) => {
    const håndterSendTilBeslutter = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const res = fetch(`/api/behandling/beslutter/${behandlingid}`, {
            method: 'POST',
            body: JSON.stringify({
                saksbehandler: 'Z994572',
            }),
        });

        console.log('res', res);
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
