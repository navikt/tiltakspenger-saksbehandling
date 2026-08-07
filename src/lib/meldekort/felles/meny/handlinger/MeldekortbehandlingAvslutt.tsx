import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId, SakProps } from '~/lib/sak/SakTyper';

import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    meldekortId: MeldekortbehandlingId;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const MeldekortbehandlingAvslutt = ({
    meldekortId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps, { begrunnelse: string }>(
        `/sak/${sakId}/meldekort/${meldekortId}/avbryt`,
        'POST',
    );

    const avslutt = () => {
        const begrunnelseTrimmet = begrunnelseRef?.current?.value.trim();
        if (!begrunnelseTrimmet) {
            setValideringsfeil('Du må fylle ut en begrunnelse');
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmet }).then((oppdatertSak) => {
            if (oppdatertSak) {
                onSuccess(oppdatertSak);
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
