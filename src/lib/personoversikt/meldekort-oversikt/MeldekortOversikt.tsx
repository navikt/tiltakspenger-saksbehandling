import { HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortHelgToggle } from '~/lib/personoversikt/helg-toggle/MeldekortHelgToggle';
import { MeldeperiodeKjederOversikt } from './MeldeperiodeKjederOversikt';
import { MeldekortbehandlingerOversikt } from './MeldekortbehandlingerOversikt';
import { ApneMeldekortbehandlingerOversikt } from './ApneMeldekortbehandlingerOversikt';
import { nonNullishPredicate } from '~/utils/array';
import { hentÅpneMeldekortbehandlinger } from '~/lib/sak/sakUtils';
import { UbehandledeMeldekortVarsel } from '~/lib/meldekort/felles/ubehandlede-meldekort/UbehandledeMeldekortVarsel';
import { OpprettMeldekortbehandlingKnapp } from '~/lib/meldekort/felles/opprett/OpprettMeldekortbehandlingKnapp';

import style from './MeldekortOversikt.module.css';

enum OversiktVisning {
    Meldeperiodekjeder = 'meldeperiodekjeder',
    Meldekortbehandlinger = 'meldekortbehandlinger',
}

export const MeldekortOversikt = () => {
    const { sak } = useSak();
    const { saksnummer, meldeperiodeKjeder } = sak;

    const åpneMeldekortbehandlinger = hentÅpneMeldekortbehandlinger(sak);
    const åpneIder = new Set(åpneMeldekortbehandlinger.map((behandling) => behandling.id));

    const øvrigeMeldekortbehandlinger = Object.values(sak.meldekortbehandlinger)
        .filter(nonNullishPredicate)
        .filter((behandling) => !åpneIder.has(behandling.id));

    const [visning, setVisning] = useState<OversiktVisning>(OversiktVisning.Meldeperiodekjeder);

    return (
        <VStack gap={'space-24'}>
            <VStack gap={'space-16'} className={style.toppSeksjon}>
                <UbehandledeMeldekortVarsel meldeperiodekjeder={meldeperiodeKjeder} />

                <OpprettMeldekortbehandlingKnapp />
            </VStack>

            <ApneMeldekortbehandlingerOversikt
                saksnummer={saksnummer}
                meldekortbehandlinger={åpneMeldekortbehandlinger}
            />

            <HStack justify={'space-between'} align={'center'} gap={'space-16'}>
                <ToggleGroup
                    value={visning}
                    onChange={(value) => setVisning(value as OversiktVisning)}
                >
                    <ToggleGroup.Item value={OversiktVisning.Meldeperiodekjeder}>
                        {`Meldeperioder (${meldeperiodeKjeder.length})`}
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={OversiktVisning.Meldekortbehandlinger}>
                        {`Tidligere meldekortbehandlinger (${øvrigeMeldekortbehandlinger.length})`}
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
                    meldekortbehandlinger={øvrigeMeldekortbehandlinger}
                />
            )}
        </VStack>
    );
};
