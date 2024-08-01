import { Loader, Tabs } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useHentUtbetalingListe } from '../../hooks/useHentUtbetalingListe';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { useContext, useState } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { useHentMeldekortListe } from '../../hooks/useHentMeldekortListe';

export const SaksbehandlingTabs = () => {
  const aktivTab = router.route.split('/')[3];

  const { behandlingId, meldekortId, utbetalingId } =
    useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  const tilBeslutter =
    valgtBehandling.behandlingTilstand === BehandlingStatus.KLAR_TIL_BESLUTNING;
  const iverksatt =
    valgtBehandling.behandlingTilstand === BehandlingStatus.INNVILGET;

  const { meldekortliste } = useHentMeldekortListe(iverksatt, behandlingId);
  const { utbetalingliste } = useHentUtbetalingListe(iverksatt, behandlingId);

  const [value, setValue] = useState(aktivTab);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <Tabs value={value} onChange={setValue}>
      <Tabs.List>
        {(!tilBeslutter || !iverksatt) && (
          <Tabs.Tab
            value={'inngangsvilkar'}
            label={'Inngangsvilkår'}
            id="inngangsvilkår-tab"
            aria-controls="inngangsvilkår-panel"
            onClick={() =>
              router.push(
                `/behandling/${behandlingId}/inngangsvilkar/kravfrist`,
              )
            }
          />
        )}
        <Tabs.Tab
          value={'oppsummering'}
          label={'Oppsummering'}
          id="oppsummering-tab"
          aria-controls="oppsummering-panel"
          onClick={() =>
            router.push(`/behandling/${behandlingId}/oppsummering`)
          }
        />
        {iverksatt && (
          <>
            <Tabs.Tab
              value={'meldekort'}
              label={'Meldekort'}
              id="meldekort-tab"
              aria-controls="meldekort-panel"
              onClick={() =>
                router.push(
                  `/behandling/${behandlingId}/meldekort/${meldekortId}`,
                )
              }
            />
            <Tabs.Tab
              value={'utbetaling'}
              label={'Utbetaling'}
              id="utbetaling-tab"
              aria-controls="utbetaling-panel"
              onClick={() => {
                router.push(
                  `/behandling/${behandlingId}/utbetaling/${utbetalingId}`,
                );
              }}
            />
          </>
        )}
      </Tabs.List>
    </Tabs>
  );
};
