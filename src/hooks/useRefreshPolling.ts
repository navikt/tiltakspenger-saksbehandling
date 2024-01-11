import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 300 * 1000; // 5 minutter
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
  const [oppdatertDataTilgjengelig, setOppdatertDataTilgjengelig] =
    useState(false);
  const [tickDelay, setTickDelay] = useState(options.initialDelay);

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
        setTickDelay(options.delay);
      };
      if (tickDelay) {
        const id = setInterval(tick, tickDelay);
        return () => {
          clearInterval(id);
        };
      }
    }
  }, [tickDelay, søknadId, hash, options.delay]);

  return { oppdatertDataTilgjengelig, setOppdatertDataTilgjengelig };
}

export default useRefreshPolling;
