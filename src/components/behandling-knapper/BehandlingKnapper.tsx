import { Button, HStack } from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { RefObject } from 'react';

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
  const mutator = useSWRConfig().mutate;
  const router = useRouter();

  const håndterRefreshSaksopplysninger = () => {
    fetch(`/api/behandling/oppdater/${behandlingid}`, {
      method: 'POST',
    }).then(() => {
      mutator(`/api/behandling/${behandlingid}`).then(() => {
        router.push(`/behandling/${behandlingid}/inngangsvilkar`);
      });
    });
  };

  const håndterSendTilBeslutter = () => {
    fetch(`/api/behandling/beslutter/${behandlingid}`, {
      method: 'POST',
    }).then(() => {
      mutator(`/api/behandling/${behandlingid}`);
    });
  };

  const håndterGodkjenn = () => {
    fetch(`/api/behandling/godkjenn/${behandlingid}`, {
      method: 'POST',
    }).then(() => {
      mutator(`/api/behandling/${behandlingid}`);
    });
  };

  const åpneSendTilbakeModal = () => {
    modalRef.current?.showModal();
  };

  return (
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
          onClick={() => håndterGodkjenn()}
          disabled={!lesevisning.knappGodkjennTillatt}
        >
          Godkjenn vedtaket
        </Button>
      )}
      {lesevisning.knappOppdater && (
        <Button
          type="submit"
          size="small"
          onClick={() => håndterRefreshSaksopplysninger()}
        >
          Oppdater saksopplysninger
        </Button>
      )}
      {lesevisning.knappSendTilBeslutter && (
        <Button
          type="submit"
          size="small"
          onClick={() => håndterSendTilBeslutter()}
          disabled={lesevisning.kanIkkeGodkjennes}
        >
          Send til beslutter
        </Button>
      )}
    </HStack>
  );
};
