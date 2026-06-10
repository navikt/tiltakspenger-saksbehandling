import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { PauseIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { dateTilISOTekst } from '~/utils/date';

type Props = {
    åpen: boolean;
    onClose: () => void;
};

export const MeldekortbehandlingSettPåVent = ({ åpen, onClose }: Props) => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const [begrunnelse, setBegrunnelse] = useState('');
    const [frist, setFrist] = useState<Nullable<string>>(null);
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        SakProps,
        { begrunnelse: string; frist: Nullable<string> }
    >(`/sak/${sak.sakId}/meldekort/${id}/vent`, 'PATCH');

    const settPåVent = () => {
        const begrunnelseTrimmet = begrunnelse.trim();
        if (begrunnelseTrimmet === '') {
            setValideringsfeil('Du må fylle ut en begrunnelse');
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmet, frist }).then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortbehandlingen er satt på vent',
                );
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Sett meldekortbehandlingen på vent?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    <Textarea
                        label={'Hvorfor settes behandlingen på vent? (obligatorisk)'}
                        value={begrunnelse}
                        onChange={(event) => {
                            setBegrunnelse(event.target.value);
                            if (valideringsfeil) {
                                setValideringsfeil(null);
                            }
                        }}
                        error={valideringsfeil ?? undefined}
                    />

                    <Datovelger
                        label={'Når burde behandlingen gjenopptas? (valgfritt)'}
                        minDate={new Date()}
                        onDateChange={(dato) => setFrist(dato ? dateTilISOTekst(dato) : null)}
                    />

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved å sette på vent'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<PauseIcon aria-hidden />}
                        loading={isMutating}
                        onClick={settPåVent}
                    >
                        {'Sett behandling på vent'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
