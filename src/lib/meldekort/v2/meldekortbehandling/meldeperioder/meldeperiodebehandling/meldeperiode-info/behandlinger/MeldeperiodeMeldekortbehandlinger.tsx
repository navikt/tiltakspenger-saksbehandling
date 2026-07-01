import { InlineMessage, VStack } from '@navikt/ds-react';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeMeldekortbehandlinger = ({ meldeperiodeKjede }: Props) => {
    const { meldekortbehandlingIder } = meldeperiodeKjede;

    return (
        <VStack gap={'space-16'}>
            <InlineMessage status={'info'} size={'small'}>
                {`Tidligere meldekortbehandlinger kommer her (${meldekortbehandlingIder.length})`}
            </InlineMessage>
        </VStack>
    );
};
