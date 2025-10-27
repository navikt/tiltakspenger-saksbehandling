import { VStack } from '@navikt/ds-react';
import { MeldekortUke } from './MeldekortUke';
import { MeldekortDagBeregnetProps } from '~/types/meldekort/MeldekortBehandling';

type Props = {
    dager: MeldekortDagBeregnetProps[];
    underBehandling?: boolean;
    className?: string;
};

export const MeldekortUker = ({ dager, underBehandling, className }: Props) => {
    return (
        <VStack gap={'1'} className={className}>
            <MeldekortUke
                dager={dager.slice(0, 7)}
                ukeIndex={0}
                underBehandling={!!underBehandling}
            />
            <MeldekortUke
                dager={dager.slice(7, 14)}
                ukeIndex={1}
                underBehandling={!!underBehandling}
            />
        </VStack>
    );
};
