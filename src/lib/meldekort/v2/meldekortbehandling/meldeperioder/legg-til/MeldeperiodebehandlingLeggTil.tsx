import { Button, HStack, Select } from '@navikt/ds-react';
import { formatterMeldeperiode } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import { useState } from 'react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';

type Props = {
    onLeggTil: (kjedeId: MeldeperiodeKjedeId) => void;
};

export const MeldeperiodebehandlingLeggTil = ({ onLeggTil }: Props) => {
    const { sak } = useSak();

    const { meldeperioder } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    const [valgtKjedeId, setValgtKjedeId] = useState<MeldeperiodeKjedeId>();

    const valgteKjedeIder = new Set<MeldeperiodeKjedeId>(meldeperioder.map((m) => m.kjedeId));

    const tilgjengeligeKjeder = sak.meldeperiodeKjederV2.filter(
        (kjede) => !valgteKjedeIder.has(kjede.id),
    );

    const leggTil = () => {
        if (!valgtKjedeId) {
            return;
        }

        dispatch({
            type: 'leggTilMeldeperiode',
            payload: { meldeperiodeKjede: hentMeldeperiodekjede(sak, valgtKjedeId) },
        });

        onLeggTil(valgtKjedeId);

        setValgtKjedeId(undefined);
    };

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.FullBredde>
                <HStack gap={'space-8'} align={'end'}>
                    <Select
                        label={'Legg til meldeperiode'}
                        hideLabel={true}
                        size={'small'}
                        value={valgtKjedeId}
                        onChange={(e) => setValgtKjedeId(e.target.value as MeldeperiodeKjedeId)}
                    >
                        <option value={''}>{'- Velg meldeperiode -'}</option>
                        {tilgjengeligeKjeder.map((kjede) => (
                            <option key={kjede.id} value={kjede.id}>
                                {formatterMeldeperiode(kjede.periode)}
                            </option>
                        ))}
                    </Select>
                    <Button
                        size={'small'}
                        variant={'secondary'}
                        onClick={leggTil}
                        disabled={!valgtKjedeId}
                    >
                        {'Legg til'}
                    </Button>
                </HStack>
            </MeldekortbehandlingSeksjon.FullBredde>
        </MeldekortbehandlingSeksjon>
    );
};
