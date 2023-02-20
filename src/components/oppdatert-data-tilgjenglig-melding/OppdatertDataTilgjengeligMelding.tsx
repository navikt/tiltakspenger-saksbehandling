import { Alert, Button, Heading } from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import useRefreshPolling from '../../hooks/useRefreshPolling';
import { Behandling } from '../../types/Behandling';
import styles from './OppdatertDataTilgjengeligMelding.module.css';

interface OppdatertDataTilgjengeligMeldingProps {
    søknadId: string;
    hash: string;
    søkerId: string;
}

function OppdatertDataTilgjengeligMelding({ søknadId, hash, søkerId }: OppdatertDataTilgjengeligMeldingProps) {
    const { mutate } = useSWRConfig();
    const { oppdatertDataTilgjengelig, setOppdatertDataTilgjengelig } = useRefreshPolling(søknadId, hash);

    const handleOppdater = async () => {
        await mutate(`/api/person/soknader/${søkerId}`).then(() => setOppdatertDataTilgjengelig(false));
    };

    return (
        <>
            {oppdatertDataTilgjengelig ? (
                <Alert className={styles.oppdatertData} variant="info">
                    <Heading size="medium">Utdatert vilkårsvurderinger</Heading>
                    <p>Vilkårsvurderingene har endret seg siden sist. Trykk på oppdater for å laste inn det nyeste.</p>
                    <Button onClick={handleOppdater}>Oppdater</Button>
                </Alert>
            ) : null}
        </>
    );
}

export default OppdatertDataTilgjengeligMelding;
