import { Heading, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingerTabell } from './MeldekortbehandlingerTabell';

type Props = {
    saksnummer: string;
    meldekortbehandlinger: MeldekortbehandlingProps[];
};

export const ApneMeldekortbehandlingerOversikt = ({ saksnummer, meldekortbehandlinger }: Props) => {
    if (meldekortbehandlinger.length === 0) {
        return null;
    }

    return (
        <VStack gap={'space-8'}>
            <Heading size={'small'} level={'3'}>
                {`Åpne meldekortbehandlinger (${meldekortbehandlinger.length})`}
            </Heading>

            <MeldekortbehandlingerTabell
                saksnummer={saksnummer}
                meldekortbehandlinger={meldekortbehandlinger}
                medMeny={true}
            />
        </VStack>
    );
};
