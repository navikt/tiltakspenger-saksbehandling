import { HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortHelgToggle } from '~/lib/personoversikt/helg-toggle/MeldekortHelgToggle';
import { MeldeperiodeKjederOversikt } from './MeldeperiodeKjederOversikt';
import { MeldekortbehandlingerOversikt } from './MeldekortbehandlingerOversikt';
import { nonNullishPredicate } from '~/utils/array';
import { ApenMeldekortbehandlingOppsummering } from '~/lib/personoversikt/meldekort-oversikt/åpen-behandling/ApenMeldekortbehandlingOppsummering';
import { UbehandledeMeldekortVarsel } from '~/lib/meldekort/felles/ubehandlede-meldekort/UbehandledeMeldekortVarsel';

import style from './MeldekortOversikt.module.css';

enum OversiktVisning {
    Meldeperiodekjeder = 'meldeperiodekjeder',
    Meldekortbehandlinger = 'meldekortbehandlinger',
}

export const MeldekortOversikt = () => {
    const { sak } = useSak();
    const { saksnummer, meldeperiodeKjeder } = sak;

    const [visning, setVisning] = useState<OversiktVisning>(OversiktVisning.Meldeperiodekjeder);

    const meldekortbehandlinger = Object.values(sak.meldekortbehandlinger).filter(
        nonNullishPredicate,
    );

    return (
        <VStack gap={'space-16'}>
            <VStack gap={'space-16'} className={style.toppSeksjon}>
                <UbehandledeMeldekortVarsel meldeperiodekjeder={meldeperiodeKjeder} />

                <ApenMeldekortbehandlingOppsummering />
            </VStack>

            <HStack justify={'space-between'} align={'center'} gap={'space-16'}>
                <ToggleGroup
                    value={visning}
                    onChange={(value) => setVisning(value as OversiktVisning)}
                >
                    <ToggleGroup.Item value={OversiktVisning.Meldeperiodekjeder}>
                        {`Meldeperioder (${meldeperiodeKjeder.length})`}
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
                    meldeperiodeKjeder={meldeperiodeKjeder}
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
