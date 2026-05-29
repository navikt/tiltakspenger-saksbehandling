import { VStack } from '@navikt/ds-react';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandling } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/Meldeperiodebehandling';
import { MeldeperiodebehandlingLeggTil } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/legg-til/MeldeperiodebehandlingLeggTil';

export const Meldeperiodebehandlinger = () => {
    const { meldeperioder, erReadonly } = useMeldekortbehandlingSkjema();

    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <VStack gap={'space-24'}>
            {!erReadonly && <MeldeperiodebehandlingLeggTil />}

            {meldeperioder.map((meldeperiode, index) => {
                return (
                    <Meldeperiodebehandling
                        meldeperiodeSkjema={meldeperiode}
                        onFjern={() => dispatch({ type: 'fjernMeldeperiode', payload: { index } })}
                        key={meldeperiode.kjedeId}
                    />
                );
            })}
        </VStack>
    );
};
