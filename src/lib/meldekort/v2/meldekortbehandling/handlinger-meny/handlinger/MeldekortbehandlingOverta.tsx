import { Button, Dialog } from '@navikt/ds-react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { useRouter } from 'next/router';
import { SakProps } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingStatus } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    åpen: boolean;
    onClose: () => void;
};

export const MeldekortbehandlingOverta = ({ åpen, onClose }: Props) => {
    const { sak, setSak } = useSak();
    const meldekortbehandling = useMeldekortbehandling();

    const router = useRouter();

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps, { overtarFra: string }>(
        `/sak/${sak.sakId}/meldekort/${meldekortbehandling.id}/overta`,
        'PATCH',
    );

    const overtarFra =
        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING
            ? (meldekortbehandling.saksbehandler ?? 'Ukjent saksbehandler')
            : meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BESLUTNING
              ? (meldekortbehandling.beslutter ?? 'Ukjent beslutter')
              : 'Ukjent saksbehandler/beslutter';

    const overta = () => {
        trigger({ overtarFra }).then((response) => {
            if (response) {
                setSak(response);
                router.push(meldekortbehandlingUrl(sak.saksnummer, meldekortbehandling.id));
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Overta meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {`Er du sikker på at du vil ta over meldekortbehandlingen fra ${overtarFra}?`}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved overtaking'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<ArrowsSquarepathIcon aria-hidden />}
                        loading={isMutating}
                        onClick={overta}
                    >
                        {'Overta behandling'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
