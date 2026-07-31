import { VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { UbehandledeMeldekortOversikt } from './ubehandlede-meldekort/UbehandledeMeldekortOversikt';
import { ApneBehandlingerTabell } from './apne-behandlinger/ApneBehandlingerTabell';

export const ApneBehandlingerOversikt = () => {
    const { sak } = useSak();
    const { saksnummer, meldeperiodeKjeder } = sak;

    return (
        <VStack gap={'space-32'}>
            <UbehandledeMeldekortOversikt
                saksnummer={saksnummer}
                meldeperiodeKjeder={meldeperiodeKjeder}
            />

            <ApneBehandlingerTabell sak={sak} />
        </VStack>
    );
};
