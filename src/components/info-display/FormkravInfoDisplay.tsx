import { Heading, HStack, VStack } from '@navikt/ds-react';
import React from 'react';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import OppsummeringAvJournalførtKlage from '../oppsummeringer/oppsummeringAvJournalførtKlage/OppsummeringAvJournalførtKlage';

const FormkravInfoDisplay = () => {
    return (
        <VStack gap="3">
            <HStack gap="2">
                <WarningCircleIcon />
                <Heading size="small">Formkrav</Heading>
            </HStack>
            <OppsummeringAvJournalførtKlage journalføringsdato={null} />
        </VStack>
    );
};

export default FormkravInfoDisplay;
