import { FileTextIcon, TasklistIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentMeldekortListe } from '../../hooks/useHentMeldekortListe';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useHentUtbetalingListe } from '../../hooks/useHentUtbetalingListe';
import { BehandlingTilstand } from '../../types/BehandlingTypes';
import { useState } from 'react';

interface SaksbehandlingTabsProps {
  behandlingId: string;
}

export const SaksbehandlingTabs = ({
  behandlingId,
}: SaksbehandlingTabsProps) => {
  const router = useRouter();
  const aktivTab = router.route.split('/')[3];

  const { valgtBehandling } = useHentBehandling(behandlingId);
  const tilBeslutter =
    valgtBehandling?.behandlingTilstand === BehandlingTilstand.TIL_BESLUTTER;
  const iverksatt =
    valgtBehandling?.behandlingTilstand === BehandlingTilstand.IVERKSATT;

  const { meldekortliste } = useHentMeldekortListe(iverksatt, behandlingId);
  const { utbetalingliste } = useHentUtbetalingListe(iverksatt, behandlingId);

  const [value, setValue] = useState(aktivTab);

  return (
    <Tabs value={value} onChange={setValue}>
      <Tabs.List>
        {(!tilBeslutter || !iverksatt) && (
          <Tabs.Tab
            value={'inngangsvilkar'}
            label={'Inngangsvilkår'}
            id="inngangsvilkår-tab"
            aria-controls="inngangsvilkår-panel"
            icon={<FileTextIcon />}
            onClick={() => {
              router.push(
                `/behandling/${behandlingId}/inngangsvilkar/kravfrist`,
              );
            }}
          />
        )}
        <Tabs.Tab
          value={'oppsummering'}
          label={'Oppsummering'}
          id="oppsummering-tab"
          aria-controls="oppsummering-panel"
          icon={<TasklistIcon />}
          onClick={() => {
            router.push(`/behandling/${behandlingId}/oppsummering`);
          }}
        />
        {iverksatt && (
          <>
            <Tabs.Tab
              value={'meldekort'}
              label={'Meldekort'}
              id="meldekort-tab"
              aria-controls="meldekort-panel"
              icon={<FileTextIcon />}
              onClick={() => {
                meldekortliste &&
                  router.push(
                    `/behandling/${behandlingId}/meldekort/${meldekortliste[0].id}`,
                  );
              }}
            />
            <Tabs.Tab
              value={'utbetaling'}
              label={'Utbetaling'}
              id="utbetaling-tab"
              aria-controls="utbetaling-panel"
              icon={<FileTextIcon />}
              onClick={() => {
                router.push(
                  `/behandling/${behandlingId}/utbetaling/${utbetalingliste[0].id}`,
                );
              }}
            />
          </>
        )}
      </Tabs.List>
    </Tabs>
  );
};
