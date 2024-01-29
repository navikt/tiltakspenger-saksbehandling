import { FileTextIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { useRouter } from 'next/router';

interface SaksbehandlingTabsProps {
  behandlingId: string;
  meldekortId?: string;
  utbetalingId?: string;
}

export const SaksbehandlingTabs = ({
  behandlingId,
  meldekortId,
  utbetalingId,
}: SaksbehandlingTabsProps) => {
  const router = useRouter();
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab
          key={'Inngangsvilkår'}
          value={'Inngangsvilkår'}
          label={'Inngangsvilkår'}
          icon={<FileTextIcon />}
          onClick={() => {
            router.push(`/behandling/${behandlingId}`);
          }}
        />
        <Tabs.Tab
          key={'Meldekort'}
          value={'Meldekort'}
          label={'Meldekort'}
          icon={<FileTextIcon />}
          onClick={() => {
            router.push(`/behandling/${behandlingId}/meldekort/${meldekortId}`);
          }}
        />
        <Tabs.Tab
          key={'Utbetaling'}
          value={'Utbetaling'}
          label={'Utbetaling'}
          icon={<FileTextIcon />}
          onClick={() => {
            router.push(
              `/behandling/${behandlingId}/utbetaling/${utbetalingId}`
            );
          }}
        />
      </Tabs.List>
    </Tabs>
  );
};
