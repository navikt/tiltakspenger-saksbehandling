import { CopyButton, HStack } from '@navikt/ds-react';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { personoversiktUrl } from '~/utils/urls';

export const FnrCelle = ({ fnr, saksnummer }: { fnr: string; saksnummer: string }) => (
    <HStack align={'center'} gap={'space-4'} wrap={false}>
        <InternLenke href={personoversiktUrl(saksnummer)}>{fnr}</InternLenke>
        <CopyButton copyText={fnr} size={'small'} data-color={'accent'} />
    </HStack>
);
