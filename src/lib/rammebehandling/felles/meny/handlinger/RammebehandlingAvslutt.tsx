import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import {
    Rammebehandling,
    RammebehandlingId,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    åpen: boolean;
    onClose: () => void;
};

export const RammebehandlingAvslutt = ({ behandling, åpen, onClose }: Props) => {
    const { sak } = useSak();
    const { id, type } = behandling;
    const { navigateWithNotification } = useNotification();

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        SakProps,
        { begrunnelse: string; behandlingId: RammebehandlingId }
    >(`/sak/${sak.saksnummer}/avbryt-aktiv-behandling`, 'POST');

    const erRevurdering = type === Rammebehandlingstype.REVURDERING;

    const avslutt = () => {
        const begrunnelseTrimmet = begrunnelseRef?.current?.value.trim();
        if (!begrunnelseTrimmet) {
            setValideringsfeil('Du må fylle ut en begrunnelse');
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmet, behandlingId: id }).then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.AvsluttedeBehandlinger),
                    `${erRevurdering ? 'Revurderingen' : 'Behandlingen'} er avsluttet`,
                );
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>
                        {`Avslutt ${erRevurdering ? 'revurderingen' : 'behandlingen'}?`}
                    </strong>
                </Dialog.Header>

                <Dialog.Body>
                    {erRevurdering
                        ? 'Hvis du avslutter revurderingen må den startes på nytt for å revurdere vedtaket.'
                        : 'Hvis du avslutter behandlingen blir også søknaden avsluttet.'}

                    <Textarea
                        label={`Hvorfor avsluttes ${erRevurdering ? 'revurderingen' : 'behandlingen'}? (obligatorisk)`}
                        maxLength={200}
                        onChange={() => {
                            if (valideringsfeil) {
                                setValideringsfeil(null);
                            }
                        }}
                        error={valideringsfeil ?? undefined}
                        ref={begrunnelseRef}
                    />

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved avslutning'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        data-color={'danger'}
                        icon={<TrashIcon aria-hidden />}
                        loading={isMutating}
                        onClick={avslutt}
                    >
                        {'Avslutt behandling'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Ikke avslutt behandling'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
