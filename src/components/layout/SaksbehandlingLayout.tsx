import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../header/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { Loader } from '@navikt/ds-react';
import { createContext, useEffect, useState } from 'react';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { useHentMeldekortListe } from '../../hooks/meldekort/useHentMeldekortListe';
import { useHentUtbetalingListe } from '../../hooks/utbetaling/useHentUtbetalingListe';

interface BehandlingContextType {
  behandlingId: string;
  meldekortId: string;
  utbetalingId: string;
  sakId: string;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  behandlingId: undefined,
  meldekortId: undefined,
  utbetalingId: undefined,
  sakId: undefined,
});

export const SaksbehandlingLayout = ({ children }: React.PropsWithChildren) => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  const [behId, settBehId] = useState<string>(undefined);
  const [meldekortId, settMeldekortId] = useState<string>(undefined);
  //const [utbetalingId, settUtbetalingId] = useState<string>(undefined);
  const [sakenId, settSakenId] = useState<string>(undefined);

  const iverksatt = valgtBehandling?.status === BehandlingStatus.INNVILGET;

  const { meldekortliste } = useHentMeldekortListe(iverksatt, sakenId);
  //const { utbetalingliste } = useHentUtbetalingListe(iverksatt, behandlingId);

  useEffect(() => {
    if (valgtBehandling) {
      settBehId(valgtBehandling.id);
      settSakenId(valgtBehandling.sakId);
    }
    if (iverksatt && meldekortliste) {
      settMeldekortId(meldekortliste[0].meldekortId);
    }
  }, [iverksatt, meldekortliste, valgtBehandling]);

  if (isLoading || !valgtBehandling || !behId) {
    return <Loader />;
  }
  return (
    <BehandlingContext.Provider
      value={{
        behandlingId: behId,
        meldekortId: meldekortId,
        utbetalingId: undefined,
        sakId: sakenId,
      }}
    >
      <PersonaliaHeader />
      <Saksbehandlingstabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
