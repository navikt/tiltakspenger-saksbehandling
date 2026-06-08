import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const MeldekortbehandlingUnderkjenn = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const [begrunnelse, setBegrunnelse] = useState('');
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        MeldeperiodeKjedeProps,
        { begrunnelse: string }
    >(`/sak/${sak.sakId}/meldekort/${id}/underkjenn`, 'POST');

    const underkjenn = () => {
        if (begrunnelse === '') {
            setValideringsfeil('Begrunnelse er påkrevd');
            return;
        }

        trigger({ begrunnelse }).then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortet er underkjent',
                );
            }
        });
    };

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button variant={'secondary'} icon={<XMarkIcon />}>
                    {'Underkjenn'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Underkjenn meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    <Textarea
                        label={'Begrunnelse'}
                        value={begrunnelse}
                        onChange={(event) => {
                            setBegrunnelse(event.target.value.trim());
                            if (valideringsfeil) {
                                setValideringsfeil(null);
                            }
                        }}
                        error={valideringsfeil ?? undefined}
                    />

                    {error && (
                        <InfokortEnkel
                            variant={'feil'}
                            header={'Feil ved underkjenning'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</InfokortEnkel>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<XMarkIcon />}
                        loading={isMutating}
                        onClick={underkjenn}
                    >
                        {'Underkjenn'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
