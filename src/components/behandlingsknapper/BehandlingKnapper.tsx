import { Button, HStack, Loader } from '@navikt/ds-react';
import { RefObject, useContext } from 'react';
import { SaksbehandlerContext } from '../../pages/_app';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import {
  kanBeslutteForBehandling,
  kanSaksbehandleForBehandling,
} from '../../utils/tilganger';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { useGodkjennBehandling } from '../../hooks/useGodkjennBehandling';
import { useSendTilBeslutter } from '../../hooks/useSendTilBeslutter';

interface BehandlingKnapperProps {
  modalRef: RefObject<HTMLDialogElement>;
}

export const Behandlingsknapper = ({ modalRef }: BehandlingKnapperProps) => {
  const { behandlingId } = useContext(BehandlingContext);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { godkjennBehandling, godkjennerBehandling, godkjennBehandlingError } =
    useGodkjennBehandling(behandlingId);
  const { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError } =
    useSendTilBeslutter(behandlingId);

  const kanBeslutte = kanBeslutteForBehandling(
    valgtBehandling.status,
    innloggetSaksbehandler,
    valgtBehandling.beslutter,
  );

  const kanSaksbehandle = kanSaksbehandleForBehandling(
    valgtBehandling.status,
    innloggetSaksbehandler,
    valgtBehandling.saksbehandler,
  );

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const åpneSendTilbakeModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      {godkjennBehandlingError ? (
        <Varsel
          variant="error"
          melding={`Kunne ikke godkjenne vedtaket (${godkjennBehandlingError.status} ${godkjennBehandlingError.info})`}
        />
      ) : null}
      {sendTilBeslutterError ? (
        <Varsel
          variant="error"
          melding={`Kunne ikke sende til beslutter (${sendTilBeslutterError.status} ${sendTilBeslutterError.info})`}
        />
      ) : null}
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
            loading={senderTilBeslutter}
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
