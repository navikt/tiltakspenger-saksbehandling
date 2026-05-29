import { Button, HStack, Select } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import { useState } from 'react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';

export const MeldeperiodebehandlingLeggTil = () => {
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

        setValgtKjedeId(undefined);
    };

    return (
        <HStack gap={'space-8'} align={'end'}>
            <Select
                label={'Legg til meldeperiode'}
                size={'small'}
                value={valgtKjedeId}
                onChange={(e) => setValgtKjedeId(e.target.value as MeldeperiodeKjedeId)}
            >
                <option value={''}>{'- Velg meldeperiode -'}</option>
                {tilgjengeligeKjeder.map((kjede) => (
                    <option key={kjede.id} value={kjede.id}>
                        {periodeTilFormatertDatotekst(kjede.periode)}
                    </option>
                ))}
            </Select>
            <Button size={'small'} variant={'secondary'} onClick={leggTil} disabled={!valgtKjedeId}>
                {'Legg til'}
            </Button>
        </HStack>
    );
};
