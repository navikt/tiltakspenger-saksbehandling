import { VStack } from '@navikt/ds-react';
import { MeldekortUke } from './MeldekortUke';
import { MeldekortDagBeregnetProps } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    dager: MeldekortDagBeregnetProps[];
    className?: string;
};

export const MeldekortUker = ({ dager, className }: Props) => {
    return (
        <VStack gap={'space-4'} className={className}>
            <MeldekortUke dager={dager.slice(0, 7)} ukeIndex={0} />
            <MeldekortUke dager={dager.slice(7, 14)} ukeIndex={1} />
        </VStack>
    );
};
