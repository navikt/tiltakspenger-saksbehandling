import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

type Props = {
    åpen: boolean;
    onClose: () => void;
};

export const MeldekortbehandlingAvslutt = ({ åpen, onClose }: Props) => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        MeldekortbehandlingProps,
        { begrunnelse: string }
    >(`/sak/${sak.sakId}/meldekort/${id}/avbryt`, 'POST');

    const avslutt = () => {
        const begrunnelseTrimmet = begrunnelseRef?.current?.value.trim();
        if (!begrunnelseTrimmet) {
            setValideringsfeil('Du må fylle ut en begrunnelse');
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmet }).then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortbehandlingen er avsluttet',
                );
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Avslutt meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {
                        'Hvis du avslutter meldekortbehandlingen må behandlingen startes på nytt for å behandle meldekortet manuelt.'
                    }

                    <Textarea
                        label={'Hvorfor avsluttes behandlingen? (obligatorisk)'}
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
