import { Alert, Button, Heading } from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import useRefreshPolling from '../../hooks/useRefreshPolling';
import styles from './OppdatertDataTilgjengeligMelding.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface OppdatertDataTilgjengeligMeldingProps {
    søknadId: string;
    hash: string;
    søkerId: string;
}

function OppdatertDataTilgjengeligMelding({ søknadId, hash, søkerId }: OppdatertDataTilgjengeligMeldingProps) {
    const { mutate } = useSWRConfig();
    const { oppdatertDataTilgjengelig, setOppdatertDataTilgjengelig } = useRefreshPolling(søknadId, hash, {
        delay: 10000,
    });

    const handleOppdater = async () => {
        await mutate(`/api/person/soknader/${søkerId}`).then(() => setOppdatertDataTilgjengelig(false));
    };

    return (
        <AnimatePresence>
            {oppdatertDataTilgjengelig ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ ease: 'easeOut', duration: 0.25 }}
                >
                    <Alert className={styles.oppdatertData} variant="info">
                        <Heading size="medium">Utdatert vilkårsvurderinger</Heading>
                        <p>
                            Vilkårsvurderingene har endret seg siden sist. Trykk på oppdater for å laste inn det nyeste.
                        </p>
                        <Button onClick={handleOppdater}>Oppdater</Button>
                    </Alert>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

export default OppdatertDataTilgjengeligMelding;
