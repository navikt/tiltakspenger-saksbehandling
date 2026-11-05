import { HStack, VStack } from '@navikt/ds-react';
import { KlageHendelse } from '~/dev/klage/KlageHendelse';
import { NySøknad } from '~/dev/søknad/NySøknad';
import { NyUbestemtRevurdering } from '~/dev/revurdering/NyUbestemtRevurdering';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';

export const LokalDevSide = () => {
    return (
        <VStack justify={'center'} align={'center'} style={{ height: '70vh' }}>
            <HStack gap="space-6">
                <NySøknad />
                <KlageHendelse />
                <NyUbestemtRevurdering />
                <InternLenkeKnapp href="/dev/deltakelse" size="medium">
                    Opprett/oppdater tiltaksdeltakelse
                </InternLenkeKnapp>
            </HStack>
        </VStack>
    );
};
