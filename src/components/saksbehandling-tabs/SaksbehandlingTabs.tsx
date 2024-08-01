import { Loader, Tabs } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { useContext, useState } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

export const SaksbehandlingTabs = () => {
  const aktivTab = router.route.split('/')[3];

  const { behandlingId, meldekortId, utbetalingId } =
    useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const [value, setValue] = useState(aktivTab);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const tilBeslutter =
    valgtBehandling.behandlingTilstand === BehandlingStatus.KLAR_TIL_BESLUTNING;
  const iverksatt =
    valgtBehandling.behandlingTilstand === BehandlingStatus.INNVILGET;

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
