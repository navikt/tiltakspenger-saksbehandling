import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { useRef } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    behandlingId: RammebehandlingId;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (nyBehandling: Søknadsbehandling) => void;
};

export const RammebehandlingGjenopprett = ({
    behandlingId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        Søknadsbehandling,
        { begrunnelse: Nullable<string> }
    >(`/sak/${sakId}/behandling/${behandlingId}/gjenopprett`, 'POST');

    const gjenopprett = () => {
        const begrunnelse = begrunnelseRef.current?.value.trim();

        trigger({ begrunnelse: begrunnelse || null }).then((nyBehandling) => {
            if (nyBehandling) {
                onSuccess(nyBehandling);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Gjenopprett behandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {
                        'Søknaden tas opp igjen, og det opprettes en ny søknadsbehandling. Den avsluttede behandlingen blir stående.'
                    }

                    <Textarea
                        label={'Hvorfor gjenopprettes behandlingen? (valgfritt)'}
                        maxLength={200}
                        ref={begrunnelseRef}
                    />

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved gjenoppretting'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<ArrowCirclepathIcon aria-hidden />}
                        loading={isMutating}
                        onClick={gjenopprett}
                    >
                        {'Gjenopprett'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
