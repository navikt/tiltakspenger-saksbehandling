import { Button, HStack } from '@navikt/ds-react';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { RefObject } from 'react';
import { useSWRConfig } from 'swr';

interface BehandlingKnapperProps {
  behandlingid: string;
  status: string;
  lesevisning: Lesevisning;
  modalRef: RefObject<HTMLDialogElement>;
}

export const BehandlingKnapper = ({
  behandlingid,
  lesevisning,
  modalRef,
}: BehandlingKnapperProps) => {
  const router = useRouter();
  const mutator = useSWRConfig().mutate;

  async function oppdaterBehandling(url: string, { arg }: { arg?: string }) {
    await fetch(url, {
      method: 'POST',
    }).then(() => mutator(`/api/behandling/${behandlingid}`));
  }

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
            }}
            disabled={lesevisning.kanIkkeGodkjennes}
          >
            Send til beslutter
          </Button>
        )}
      </HStack>
    </>
  );
};
