import { Button, HStack, Loader } from '@navikt/ds-react';
import useSWRMutation from 'swr/mutation';
import { RefObject, useContext } from 'react';
import { useSWRConfig } from 'swr';
import { SaksbehandlerContext } from '../../pages/_app';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import {
  kanBeslutteForBehandling,
  kanSaksbehandleForBehandling,
} from '../../utils/tilganger';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

interface BehandlingKnapperProps {
  modalRef: RefObject<HTMLDialogElement>;
}

export const BehandlingKnapper = ({ modalRef }: BehandlingKnapperProps) => {
  const mutator = useSWRConfig().mutate;
  const { behandlingId } = useContext(BehandlingContext);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  const kanBeslutte = kanBeslutteForBehandling(
    valgtBehandling.beslutter,
    innloggetSaksbehandler,
    valgtBehandling.behandlingTilstand,
  );

  const kanSaksbehandle = kanSaksbehandleForBehandling(
    valgtBehandling.saksbehandler,
    innloggetSaksbehandler,
    valgtBehandling.behandlingTilstand,
  );

  async function oppdaterBehandling(url: string, { arg }: { arg?: string }) {
    await fetch(url, {
      method: 'POST',
    }).then(() => mutator(`/api/behandling/${behandlingId}`));
  }

  const { trigger: sendTilBeslutter, isMutating: oppdatererBeslutter } =
    useSWRMutation(
      `/api/behandling/beslutter/${behandlingId}`,
      oppdaterBehandling,
    );

  const { trigger: godkjennBehandling, isMutating: godkjennerBehandling } =
    useSWRMutation(
      `/api/behandling/godkjenn/${behandlingId}`,
      oppdaterBehandling,
    );

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const åpneSendTilbakeModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <HStack justify="start" gap="3" align="end">
        {kanBeslutte && (
          <Button
            type="submit"
            size="small"
            variant="secondary"
            onClick={() => åpneSendTilbakeModal()}
          >
            Send tilbake
          </Button>
        )}
        {kanBeslutte && (
          <Button
            type="submit"
            size="small"
            loading={godkjennerBehandling}
            onClick={() => {
              godkjennBehandling();
            }}
          >
            Godkjenn vedtaket
          </Button>
        )}
        {kanSaksbehandle && (
          <Button
            type="submit"
            size="small"
            loading={oppdatererBeslutter}
            onClick={() => {
              sendTilBeslutter();
            }}
          >
            Send til beslutter
          </Button>
        )}
      </HStack>
    </>
  );
};
