import { Button, HStack, Select } from '@navikt/ds-react';
import styles from './BehandlingSkjema.module.css';
import { FormEvent, useState } from 'react';

export const BehandlingSkjema = () => {
    const [utfall, settUtfall] = useState<string>('');

    const håndterSendTilBeslutter = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(utfall);
    };
    return (
        <form onSubmit={håndterSendTilBeslutter} className={styles.behandlingSkjema}>
            <HStack justify="end" gap="3" align="end">
                <Select size="small" label="Utfall" onChange={(e) => settUtfall(e.target.value)}>
                    <option value=""></option>
                    <option value="Innvilget">Innvilget</option>
                </Select>
                <Button type="submit" size="small">
                    Send til beslutter
                </Button>
            </HStack>
        </form>
    );
};
