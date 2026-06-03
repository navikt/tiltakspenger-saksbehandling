import { Button, Dialog } from '@navikt/ds-react';
import { formaterMeldeperiode } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { useMeldekortbehandlingSkjemaDispatch } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { TrashIcon } from '@navikt/aksel-icons';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldeperiodebehandlingFjern = ({ kjedeId }: Props) => {
    const { sak } = useSak();

    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    const { periode } = hentMeldeperiodekjede(sak, kjedeId);

    const fjern = () => {
        dispatch({ type: 'fjernMeldeperiode', payload: { kjedeId } });
    };

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button size={'small'} variant={'tertiary'} icon={<TrashIcon />}>
                    {'Fjern valgt'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Fjern meldeperiode fra behandlingen'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {`Er du sikker på at du vil fjerne meldeperioden ${formaterMeldeperiode(periode)} fra behandlingen?`}
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant={'danger'} onClick={fjern}>
                            {'Fjern'}
                        </Button>
                    </Dialog.CloseTrigger>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
