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
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';

import style from './MeldeperiodebehandlingLeggTil.module.css';

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

    const ubehandledeKjeder = tilgjengeligeKjeder.filter(
        (kjede) =>
            kjede.brukersMeldekortStatus === BrukersMeldekortKjedeStatus.VENTER_BEHANDLING ||
            kjede.brukersMeldekortStatus ===
                BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING,
    );

    const leggTil = () => {
        const valgtKjedeId = selectRef.current!.value as MeldeperiodeKjedeId;

        dispatch({
            type: 'leggTilMeldeperioder',
            payload: { meldeperiodeKjeder: [hentMeldeperiodekjede(sak, valgtKjedeId)] },
        });

        onLeggTil(valgtKjedeId);
    };

    const leggTilAlleUbehandlede = () => {
        if (ubehandledeKjeder.length === 0) {
            return;
        }

        dispatch({
            type: 'leggTilMeldeperioder',
            payload: { meldeperiodeKjeder: ubehandledeKjeder },
        });

        onLeggTil(ubehandledeKjeder.at(0)!.id);
    };

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button size={'small'} variant={'tertiary'} icon={<PlusIcon />}>
                    {'Legg til meldeperioder'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Legg til meldeperioder'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    <Select
                        className={style.select}
                        label={'Legg til meldeperiode'}
                        hideLabel={true}
                        ref={selectRef}
                    >
                        {tilgjengeligeKjeder.map((kjede) => {
                            const { id, brukersMeldekortStatus, periode } = kjede;

                            return (
                                <option key={id} value={id}>
                                    {`${formaterMeldeperiode(periode)} - ${brukersMeldekortStatusTekst[brukersMeldekortStatus]}`}
                                </option>
                            );
                        })}
                    </Select>
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant={'primary'} onClick={leggTil}>
                            {'Legg til valgt'}
                        </Button>
                    </Dialog.CloseTrigger>

                    <Dialog.CloseTrigger>
                        <Button
                            variant={'primary'}
                            onClick={leggTilAlleUbehandlede}
                            disabled={ubehandledeKjeder.length === 0}
                        >
                            {`Legg til alle ubehandlede (${ubehandledeKjeder.length})`}
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

const brukersMeldekortStatusTekst: Record<BrukersMeldekortKjedeStatus, string> = {
    IKKE_MOTTATT: 'Ikke mottatt',
    VENTER_BEHANDLING: 'Mottatt, ikke behandlet',
    BEHANDLET: 'Behandlet',
    KORRIGERING_VENTER_BEHANDLING: 'Mottatt, ikke behandlet (korrigering)',
    KORRIGERING_BEHANDLET: 'Behandlet (korrigering)',
};
