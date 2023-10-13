import { Button, HStack } from '@navikt/ds-react';
import styles from './BehandlingSkjema.module.css';
import { FormEvent } from 'react';

export const BehandlingSkjema = () => {
    const håndterSendTilBeslutter = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('utfall');
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
