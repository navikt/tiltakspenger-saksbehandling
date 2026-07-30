import { HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortHelgToggle } from '~/lib/personoversikt/helg-toggle/MeldekortHelgToggle';
import { MeldeperiodeKjederOversikt } from './MeldeperiodeKjederOversikt';
import { MeldekortbehandlingerOversikt } from './MeldekortbehandlingerOversikt';
import { nonNullishPredicate } from '~/utils/array';
import { MeldekortOversiktIkkeKlar } from '~/lib/personoversikt/meldekort-oversikt/ikke-klar/MeldekortOversiktIkkeKlar';
import { ApenMeldekortbehandlingOppsummering } from '~/lib/personoversikt/meldekort-oversikt/åpen-behandling/ApenMeldekortbehandlingOppsummering';
import { UbehandledeMeldekortVarsel } from '~/lib/meldekort/felles/ubehandlede-meldekort/UbehandledeMeldekortVarsel';

import style from './MeldekortOversikt.module.css';

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
            <VStack gap={'space-16'} className={style.toppSeksjon}>
                <UbehandledeMeldekortVarsel meldeperiodekjeder={meldeperiodeKjederV2} />

                <ApenMeldekortbehandlingOppsummering />
            </VStack>

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

                <HStack gap={'space-16'} align={'center'}>
                    <MeldekortOversiktIkkeKlar meldeperiodekjeder={meldeperiodeKjederV2} />
                    <MeldekortHelgToggle />
                </HStack>
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
