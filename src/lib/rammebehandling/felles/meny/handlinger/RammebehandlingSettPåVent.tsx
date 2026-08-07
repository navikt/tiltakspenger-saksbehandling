import { Button, Dialog, Textarea, VStack } from '@navikt/ds-react';
import { PauseIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandlingId: RammebehandlingId;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const RammebehandlingSettPåVent = ({
    behandlingId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const [frist, setFrist] = useState<Nullable<string>>(null);
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        SakProps,
        { begrunnelse: string; frist: Nullable<string> }
    >(`/sak/${sakId}/behandling/${behandlingId}/pause`, 'POST');

    const settPåVent = () => {
        const begrunnelseTrimmet = begrunnelseRef?.current?.value.trim();
        if (!begrunnelseTrimmet) {
            setValideringsfeil('Du må fylle ut en begrunnelse');
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmet, frist }).then((oppdatertSak) => {
            if (oppdatertSak) {
                onSuccess(oppdatertSak);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Sett behandlingen på vent?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    <VStack gap={'space-16'}>
                        <Textarea
                            label={'Hvorfor settes behandlingen på vent? (obligatorisk)'}
                            ref={begrunnelseRef}
                            onChange={() => {
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
                    </VStack>
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
