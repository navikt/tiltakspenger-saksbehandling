import { HStack, VStack } from '@navikt/ds-react';
import { KlageHendelse } from '~/dev/klage/KlageHendelse';
import { NySøknad } from '~/dev/søknad/NySøknad';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';

export const LokalDevSide = () => {
    return (
        <VStack justify={'center'} align={'center'} style={{ height: '70vh' }}>
            <HStack gap="space-6">
                <NySøknad />
                <KlageHendelse />
                <InternLenkeKnapp href="/dev/deltakelse" size="medium">
                    Oppdater tiltaksdeltakelse
                </InternLenkeKnapp>
            </HStack>
        </VStack>
    );
};
