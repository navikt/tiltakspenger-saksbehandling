import { HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortHelgToggle } from '~/lib/personoversikt/helg-toggle/MeldekortHelgToggle';
import { MeldeperiodeKjederTabellV2 } from './MeldeperiodeKjederTabellV2';
import { MeldekortbehandlingerTabellV2 } from './MeldekortbehandlingerTabellV2';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';

enum OversiktVisning {
    Meldeperiodekjeder = 'meldeperiodekjeder',
    Meldekortbehandlinger = 'meldekortbehandlinger',
}

export const MeldekortOversiktV2 = () => {
    const { sak } = useSak();
    const { saksnummer, meldeperiodeKjederV2 } = sak;

    const [visning, setVisning] = useState<OversiktVisning>(OversiktVisning.Meldeperiodekjeder);

    const meldekortbehandlinger = Object.values(
        sak.meldekortbehandlinger,
    ) as MeldekortbehandlingPropsV2[];

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
                <MeldeperiodeKjederTabellV2
                    saksnummer={saksnummer}
                    meldeperiodeKjeder={meldeperiodeKjederV2}
                />
            ) : (
                <MeldekortbehandlingerTabellV2
                    saksnummer={saksnummer}
                    meldekortbehandlinger={meldekortbehandlinger}
                />
            )}
        </VStack>
    );
};
