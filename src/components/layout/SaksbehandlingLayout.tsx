import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../header/PersonaliaHeader';
import { SaksbehandlingTabs } from '../saksbehandling-tabs/SaksbehandlingTabs';
import { Loader } from '@navikt/ds-react';
import { createContext, useEffect, useState } from 'react';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { useHentUtbetalingListe } from '../../hooks/useHentUtbetalingListe';
import { useHentMeldekortListe } from '../../hooks/meldekort/useHentMeldekortListe';

interface BehandlingContextType {
  behandlingId: string;
  meldekortId: string;
  utbetalingId: string;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  behandlingId: null,
  meldekortId: null,
  utbetalingId: null,
});

export const SaksbehandlingLayout = ({ children }: React.PropsWithChildren) => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  const [behId, settBehId] = useState<string>(null);
  const [meldekortId, settMeldekortId] = useState<string>(null);
  const [utbetalingId, settUtbetalingId] = useState<string>(null);

  const iverksatt =
    valgtBehandling?.behandlingTilstand === BehandlingStatus.INNVILGET;

  const { meldekortliste } = useHentMeldekortListe(iverksatt, behandlingId);
  const { utbetalingliste } = useHentUtbetalingListe(iverksatt, behandlingId);

  useEffect(() => {
    if (valgtBehandling) {
      settBehId(valgtBehandling.behandlingId);
    }
    if (iverksatt && meldekortliste && utbetalingliste) {
      settMeldekortId(meldekortliste[0].id);
      settUtbetalingId(utbetalingliste[0].id);
    }
  }, [iverksatt, meldekortliste, utbetalingliste, valgtBehandling]);

  if (isLoading || !valgtBehandling || !behId) {
    return <Loader />;
  }
  return (
    <BehandlingContext.Provider
      value={{
        behandlingId: behId,
        meldekortId: meldekortId,
        utbetalingId: utbetalingId,
      }}
    >
      <PersonaliaHeader />
      <SaksbehandlingTabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
