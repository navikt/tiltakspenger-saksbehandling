import { CopyButton, HStack } from '@navikt/ds-react';

export const FnrCelle = ({ fnr }: { fnr: string }) => (
    <HStack align={'center'} gap={'space-4'} wrap={false}>
        {fnr}
        <CopyButton copyText={fnr} size={'small'} data-color={'accent'} />
    </HStack>
);
