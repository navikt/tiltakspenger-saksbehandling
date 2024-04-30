import { Button, HStack } from '@navikt/ds-react';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { RefObject } from 'react';
import { useSWRConfig } from 'swr';
import Varsel from '../varsel/Varsel';

interface BehandlingKnapperProps {
  behandlingid: string;
  status: string;
  lesevisning: Lesevisning;
  modalRef: RefObject<HTMLDialogElement>;
}

async function oppdaterBehandling(url: string, { arg }: { arg?: string }) {
  await fetch(url, {
    method: 'POST',
  });
}

export const BehandlingKnapper = ({
  behandlingid,
  lesevisning,
  modalRef,
}: BehandlingKnapperProps) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const { trigger: sendTilBeslutter, isMutating: oppdatererBeslutter } =
    useSWRMutation(
      `/api/behandling/beslutter/${behandlingid}`,
      oppdaterBehandling,
    );
  const {
    trigger: oppdaterSaksopplysninger,
    isMutating: oppdatererSaksopplysninger,
  } = useSWRMutation(
    `/api/behandling/oppdater/${behandlingid}`,
    oppdaterBehandling,
  );

  const { trigger: godkjennBehandling, isMutating: godkjennerBehandling } =
    useSWRMutation(
      `/api/behandling/godkjenn/${behandlingid}`,
      oppdaterBehandling,
    );

  const åpneSendTilbakeModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <HStack justify="start" gap="3" align="end">
        {lesevisning.knappSendTilbake && (
          <Button
            type="submit"
            size="small"
            variant="secondary"
            onClick={() => åpneSendTilbakeModal()}
          >
            Send tilbake
          </Button>
        )}
        {lesevisning.knappGodkjennVis && (
          <Button
            type="submit"
            size="small"
            loading={godkjennerBehandling}
            onClick={() => {
              godkjennBehandling();
              mutate(`/api/behandling/${behandlingid}`);
            }}
            disabled={!lesevisning.knappGodkjennTillatt}
          >
            Godkjenn vedtaket
          </Button>
        )}
        {lesevisning.knappOppdater && (
          <Button
            type="submit"
            size="small"
            loading={oppdatererSaksopplysninger}
            onClick={() => {
              oppdaterSaksopplysninger();
              router.push(`/behandling/${behandlingid}`);
            }}
          >
            Oppdater saksopplysninger
          </Button>
        )}
        {lesevisning.knappSendTilBeslutter && (
          <Button
            type="submit"
            size="small"
            loading={oppdatererBeslutter}
            onClick={() => {
              sendTilBeslutter();
              mutate(`/api/behandling/${behandlingid}`);
            }}
            disabled={lesevisning.kanIkkeGodkjennes}
          >
            Send til beslutter
          </Button>
        )}
        <Varsel variant="success" melding="Behandlingen er oppdatert" />
      </HStack>
    </>
  );
};
