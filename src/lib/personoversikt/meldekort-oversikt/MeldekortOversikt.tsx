import { HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortHelgToggle } from '~/lib/personoversikt/helg-toggle/MeldekortHelgToggle';
import { MeldeperiodeKjederOversikt } from './MeldeperiodeKjederOversikt';
import { MeldekortbehandlingerOversikt } from './MeldekortbehandlingerOversikt';
import { nonNullishPredicate } from '~/utils/array';

enum OversiktVisning {
    Meldeperiodekjeder = 'meldeperiodekjeder',
    Meldekortbehandlinger = 'meldekortbehandlinger',
}

export const MeldekortOversikt = () => {
    const { sak } = useSak();
    const { saksnummer, meldeperiodeKjederV2 } = sak;

    const [visning, setVisning] = useState<OversiktVisning>(OversiktVisning.Meldeperiodekjeder);

    const meldekortbehandlinger = Object.values(sak.meldekortbehandlinger).filter(
        nonNullishPredicate,
    );

    return (
        <VStack gap={'space-16'}>
            <HStack justify={'space-between'} align={'center'} gap={'space-16'}>
                <ToggleGroup
                    value={visning}
                    onChange={(value) => setVisning(value as OversiktVisning)}
                >
                    <ToggleGroup.Item value={OversiktVisning.Meldeperiodekjeder}>
                        {`Meldeperioder (${meldeperiodeKjederV2.length})`}
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={OversiktVisning.Meldekortbehandlinger}>
                        {`Meldekortbehandlinger (${meldekortbehandlinger.length})`}
                    </ToggleGroup.Item>
                </ToggleGroup>
                <MeldekortHelgToggle />
            </HStack>

            {visning === OversiktVisning.Meldeperiodekjeder ? (
                <MeldeperiodeKjederOversikt
                    saksnummer={saksnummer}
                    meldeperiodeKjeder={meldeperiodeKjederV2}
                />
            ) : (
                <MeldekortbehandlingerOversikt
                    saksnummer={saksnummer}
                    meldekortbehandlinger={meldekortbehandlinger}
                />
            )}
        </VStack>
    );
};
