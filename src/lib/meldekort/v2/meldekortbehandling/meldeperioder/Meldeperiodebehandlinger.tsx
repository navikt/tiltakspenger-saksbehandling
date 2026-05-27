import { useState } from 'react';
import { Button, HStack, Heading, Select, VStack } from '@navikt/ds-react';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandling } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/Meldeperiodebehandling';
import { useSak } from '~/lib/sak/SakContext';
import { periodeTilFormatertDatotekst } from '~/utils/date';

export const Meldeperiodebehandlinger = () => {
    const { meldeperioder, erReadonly } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();
    const { sak } = useSak();

    const [valgtKjedeId, setValgtKjedeId] = useState<string>('');

    const valgteKjedeIder = new Set<string>(meldeperioder.map((m) => m.kjedeId));
    const tilgjengeligeKjeder = sak.meldeperiodeKjederV2.filter(
        (kjede) => !valgteKjedeIder.has(kjede.id),
    );

    const leggTil = () => {
        const kjede = sak.meldeperiodeKjederV2.find((k) => k.id === valgtKjedeId);
        if (!kjede) return;
        dispatch({
            type: 'leggTilMeldeperiode',
            payload: { meldeperiodeKjede: kjede },
        });
        setValgtKjedeId('');
    };

    return (
        <VStack gap={'space-16'}>
            <Heading size={'medium'} level={'2'}>
                {'Meldeperioder'}
            </Heading>

            {meldeperioder.map((meldeperiode, index) => (
                <Meldeperiodebehandling
                    key={`${meldeperiode.kjedeId}-${index}`}
                    meldeperiode={meldeperiode}
                    index={index}
                    onFjern={() => dispatch({ type: 'fjernMeldeperiode', payload: { index } })}
                />
            ))}

            {!erReadonly && (
                <HStack gap={'space-8'} align={'end'}>
                    <Select
                        label={'Legg til meldeperiode'}
                        size={'small'}
                        value={valgtKjedeId}
                        onChange={(e) => setValgtKjedeId(e.target.value)}
                    >
                        <option value={''}>{'- Velg meldeperiode -'}</option>
                        {tilgjengeligeKjeder.map((kjede) => (
                            <option key={kjede.id} value={kjede.id}>
                                {periodeTilFormatertDatotekst(kjede.periode)}
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
            )}
        </VStack>
    );
};
