import { Button, Dialog, Select } from '@navikt/ds-react';
import { formaterMeldeperiode } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { PlusIcon } from '@navikt/aksel-icons';
import { useRef } from 'react';

type Props = {
    onLeggTil: (kjedeId: MeldeperiodeKjedeId) => void;
};

export const MeldeperiodebehandlingLeggTil = ({ onLeggTil }: Props) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    const { sak } = useSak();

    const { meldeperioder } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    const valgteKjedeIder = new Set<MeldeperiodeKjedeId>(meldeperioder.map((m) => m.kjedeId));

    const tilgjengeligeKjeder = sak.meldeperiodeKjederV2.filter(
        (kjede) => !valgteKjedeIder.has(kjede.id),
    );

    const leggTil = (valgtKjedeId: MeldeperiodeKjedeId) => {
        dispatch({
            type: 'leggTilMeldeperiode',
            payload: { meldeperiodeKjede: hentMeldeperiodekjede(sak, valgtKjedeId) },
        });

        onLeggTil(valgtKjedeId);
    };

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button size={'small'} variant={'tertiary'} icon={<PlusIcon />}>
                    {'Legg til ny'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Legg til meldeperiode i behandlingen'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    <Select
                        label={'Legg til meldeperiode'}
                        hideLabel={true}
                        size={'small'}
                        ref={selectRef}
                    >
                        {tilgjengeligeKjeder.map((kjede) => (
                            <option key={kjede.id} value={kjede.id}>
                                {formaterMeldeperiode(kjede.periode)}
                            </option>
                        ))}
                    </Select>
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button
                            size={'small'}
                            variant={'primary'}
                            onClick={() => leggTil(selectRef.current!.value as MeldeperiodeKjedeId)}
                        >
                            {'Legg til'}
                        </Button>
                    </Dialog.CloseTrigger>

                    <Dialog.CloseTrigger>
                        <Button size={'small'} variant={'secondary'}>
                            {'Lukk'}
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
