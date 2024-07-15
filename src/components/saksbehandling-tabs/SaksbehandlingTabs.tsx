import { FileTextIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentMeldekortListe } from '../../hooks/useHentMeldekortListe';
import { useHentBehandling } from '../../hooks/useHentBehandling';

interface SaksbehandlingTabsProps {
  behandlingId: string;
  utbetalingId?: string;
}

export const SaksbehandlingTabs = ({
  behandlingId,
  utbetalingId,
}: SaksbehandlingTabsProps) => {
  const router = useRouter();
  const { valgtBehandling } = useHentBehandling(behandlingId);
  const iverksatt = valgtBehandling?.behandlingsteg === 'iverksatt';
  const { meldekortliste } = useHentMeldekortListe(iverksatt, behandlingId);

  return (
    <Tabs defaultValue="Inngangsvilkår">
      <Tabs.List>
        <Tabs.Tab
          key={'Inngangsvilkår'}
          value={'Inngangsvilkår'}
          label={'Inngangsvilkår'}
          icon={<FileTextIcon />}
          onClick={() => {
            router.push(`/behandling/${behandlingId}/inngangsvilkar/kravfrist`);
          }}
        />
        {/*
        <Tabs.Tab
          key={'Barnetillegg'}
          value={'Barnetillegg'}
          label={'Barnetillegg'}
          icon={<FileTextIcon />}
          onClick={() => {
            router.push(`/behandling/${behandlingId}/barnetillegg`);
          }}
        />*/}
        {iverksatt && (
          <>
            <Tabs.Tab
              key={'Meldekort'}
              value={'Meldekort'}
              label={'Meldekort'}
              icon={<FileTextIcon />}
              onClick={() => {
                meldekortliste &&
                  router.push(
                    `/behandling/${behandlingId}/meldekort/${meldekortliste[0].id}`,
                  );
              }}
            />
            <Tabs.Tab
              key={'Utbetaling'}
              value={'Utbetaling'}
              label={'Utbetaling'}
              icon={<FileTextIcon />}
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
