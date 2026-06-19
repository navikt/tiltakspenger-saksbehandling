import { Button, Dialog } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakProps } from '~/lib/sak/SakTyper';

type Props = {
    åpen: boolean;
    onClose: () => void;
};

export const MeldekortbehandlingTildelMeg = ({ åpen, onClose }: Props) => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sak.sakId}/meldekort/${id}/ta`,
        'POST',
    );

    const tildelMeg = () => {
        trigger().then((oppdatertSak) => {
            if (oppdatertSak) {
                setSak(oppdatertSak);
                onClose();
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Tildel deg meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Er du sikker på at du vil tildele deg meldekortbehandlingen?'}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved tildeling'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<PersonIcon aria-hidden />}
                        loading={isMutating}
                        onClick={tildelMeg}
                    >
                        {'Tildel meg'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
