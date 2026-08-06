import { Button, Dialog, Select, VStack } from '@navikt/ds-react';
import { formaterMeldeperiode } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { PlusIcon } from '@navikt/aksel-icons';
import { useRef } from 'react';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { brukersMeldekortKjedeStatusTekst } from '~/lib/meldekort/utils/tekster';
import { kanBehandleMeldeperiodekjede } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

type Props = {
    onLeggTil: (kjedeId: MeldeperiodeKjedeId) => void;
};

export const MeldeperiodebehandlingLeggTil = ({ onLeggTil }: Props) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    const { sak } = useSak();

    const { meldeperioder } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    const valgteKjedeIder = new Set<MeldeperiodeKjedeId>(meldeperioder.map((m) => m.kjedeId));

    const tilgjengeligeKjeder = sak.meldeperiodeKjeder.filter(
        (kjede) => kanBehandleMeldeperiodekjede(kjede) && !valgteKjedeIder.has(kjede.id),
    );

    const harTilgjengeligeKjeder = tilgjengeligeKjeder.length > 0;

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
                    <VStack gap={'space-8'}>
                        <Infokort variant={'info'}>
                            {
                                'Du kan legge til en og en valgt meldeperiode, eller alle meldeperioder som har et ubehandlet meldekort fra bruker. '
                            }
                            {
                                'Meldeperioder som allerede er under behandling kan ikke legges til i flere behandlinger.'
                            }
                        </Infokort>

                        <Select
                            label={'Legg til meldeperiode'}
                            hideLabel={true}
                            ref={selectRef}
                            disabled={!harTilgjengeligeKjeder}
                        >
                            {harTilgjengeligeKjeder ? (
                                tilgjengeligeKjeder.toReversed().map((kjede) => {
                                    const { id, brukersMeldekortStatus, periode } = kjede;

                                    return (
                                        <option key={id} value={id}>
                                            {`${formaterMeldeperiode(periode)} - ${brukersMeldekortKjedeStatusTekst[brukersMeldekortStatus]}`}
                                        </option>
                                    );
                                })
                            ) : (
                                <option>{'Ingen tilgjengelige meldeperioder'}</option>
                            )}
                        </Select>
                    </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button
                            variant={'primary'}
                            onClick={leggTil}
                            disabled={!harTilgjengeligeKjeder}
                        >
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
