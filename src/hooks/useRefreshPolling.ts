import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 600 * 1000; // 10 minutter
const DEFAULT_INITAL_DELAY = 30 * 1000; // 30 sekunder

interface UseRefreshPollingOptions {
    initialDelay?: number;
    delay?: number;
}

function useRefreshPolling(
    søknadId?: string,
    hash?: string,
    options: UseRefreshPollingOptions = {
        initialDelay: DEFAULT_INITAL_DELAY,
        delay: DEFAULT_DELAY,
    }
) {
    const [oppdatertDataTilgjengelig, setOppdatertDataTilgjengelig] = useState(false);

    useEffect(() => {
        if (søknadId && hash) {
            const tick = async () => {
                const res = await fetch('/api/innsending/hash', {
                    method: 'POST',
                    body: JSON.stringify({ søknadId }),
                }).then((r) => r.json());
                if (hash !== res.hash) {
                    setOppdatertDataTilgjengelig(true);
                }
            };
            if (options.delay) {
                const id = setInterval(tick, options.delay);
                return () => {
                    clearInterval(id);
                };
            }
        }
    }, [options.delay, søknadId, hash]);

    return { oppdatertDataTilgjengelig, setOppdatertDataTilgjengelig };
}

export default useRefreshPolling;
