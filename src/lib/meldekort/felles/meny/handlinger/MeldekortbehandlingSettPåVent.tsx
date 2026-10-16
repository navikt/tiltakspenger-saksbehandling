import { Button, Dialog, Textarea, VStack } from '@navikt/ds-react';
import { PauseIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { datovalideringsfeil } from '~/lib/_felles/datovelger/datovelgerUtils';
import { dateTilISOTekst } from '~/utils/date';

import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    meldekortId: MeldekortbehandlingId;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const MeldekortbehandlingSettPåVent = ({
    meldekortId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const [frist, setFrist] = useState<Nullable<string>>(null);
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);
    const [fristValideringsfeil, setFristValideringsfeil] = useState<string | undefined>();
    const [visFristValideringsfeil, setVisFristValideringsfeil] = useState(false);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        SakProps,
        { begrunnelse: string; frist: Nullable<string> }
    >(`/sak/${sakId}/meldekort/${meldekortId}/vent`, 'PATCH');

    const settPåVent = () => {
        const begrunnelseTrimmet = begrunnelseRef?.current?.value.trim();
        setValideringsfeil(begrunnelseTrimmet ? null : 'Du må fylle ut en begrunnelse');
        setVisFristValideringsfeil(true);
        if (!begrunnelseTrimmet || fristValideringsfeil) {
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmet, frist }).then((oppdatertSak) => {
            if (oppdatertSak) {
                onSuccess(oppdatertSak);
            }
        });
    };

    return (
        <Dialog
            open={åpen}
            onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}
            onOpenChangeComplete={(erÅpen) => {
                if (!erÅpen) {
                    setFrist(null);
                    setValideringsfeil(null);
                    setFristValideringsfeil(undefined);
                    setVisFristValideringsfeil(false);
                }
            }}
        >
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Sett meldekortbehandlingen på vent?'}</strong>
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
                            onValidate={(validering) =>
                                setFristValideringsfeil(
                                    datovalideringsfeil(
                                        validering,
                                        'Fristen kan ikke være før dagens dato',
                                    ),
                                )
                            }
                            error={visFristValideringsfeil ? fristValideringsfeil : undefined}
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
