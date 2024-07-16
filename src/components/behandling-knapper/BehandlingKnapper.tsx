import { Button, HStack } from '@navikt/ds-react';
import useSWRMutation from 'swr/mutation';
import { RefObject, useContext } from 'react';
import { useSWRConfig } from 'swr';
import { SaksbehandlerContext } from '../../pages/_app';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import {
  kanBeslutteForBehandling,
  kanSaksbehandleForBehandling,
} from '../../utils/tilganger';

interface BehandlingKnapperProps {
  behandlingid: string;
  status: string;
  modalRef: RefObject<HTMLDialogElement>;
}

export const BehandlingKnapper = ({
  behandlingid,
  modalRef,
}: BehandlingKnapperProps) => {
  const mutator = useSWRConfig().mutate;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { valgtBehandling } = useHentBehandling(behandlingid);

  const kanBeslutte = kanBeslutteForBehandling(
    valgtBehandling.beslutter,
    innloggetSaksbehandler,
    valgtBehandling.behandlingsteg,
  );

  const kanSaksbehandle = kanSaksbehandleForBehandling(
    valgtBehandling.saksbehandler,
    innloggetSaksbehandler,
    valgtBehandling.behandlingsteg,
  );

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
