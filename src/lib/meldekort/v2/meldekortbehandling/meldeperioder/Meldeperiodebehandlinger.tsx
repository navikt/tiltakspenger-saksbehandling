import { VStack } from '@navikt/ds-react';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandling } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiodebehandling/Meldeperiodebehandling';
import { MeldeperiodebehandlingLeggTil } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/legg-til/MeldeperiodebehandlingLeggTil';

import style from './Meldeperiodebehandlinger.module.css';

export const Meldeperiodebehandlinger = () => {
    const { meldeperioder, erReadonly } = useMeldekortbehandlingSkjema();

    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <VStack gap={'space-16'}>
            {!erReadonly && <MeldeperiodebehandlingLeggTil />}

            {meldeperioder.map((meldeperiode, index) => (
                <Meldeperiodebehandling
                    key={meldeperiode.kjedeId}
                    meldeperiodeSkjema={meldeperiode}
                    onFjern={() => dispatch({ type: 'fjernMeldeperiode', payload: { index } })}
                    className={style.meldeperiode}
                />
            ))}
        </VStack>
    );
};
