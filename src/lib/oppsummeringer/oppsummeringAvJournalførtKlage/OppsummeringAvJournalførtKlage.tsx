import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';

const OppsummeringAvJournalførtKlage = (props: { journalføringsdato: Nullable<string> }) => {
    return (
        <HStack gap="space-8">
            <EnvelopeOpenIcon title="Åpent brev ikon" fontSize="1.5rem" />
            <HStack gap="space-8">
                <BodyShort>Klagens journalføringsdato</BodyShort>
                <BodyShort>{props.journalføringsdato ? props.journalføringsdato : '-'}</BodyShort>
            </HStack>
        </HStack>
    );
};

export default OppsummeringAvJournalførtKlage;
