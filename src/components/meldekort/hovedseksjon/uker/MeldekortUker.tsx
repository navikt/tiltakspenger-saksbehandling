import { VStack } from '@navikt/ds-react';
import { MeldekortUke } from './MeldekortUke';
import { MeldekortDagBeregnetProps } from '../../../../types/meldekort/MeldekortBehandling';
import { UseFormReturn } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../meldekort-behandling/utfylling/meldekortUtfyllingUtils';

type Props = {
    dager: MeldekortDagBeregnetProps[];
    formContext?: UseFormReturn<MeldekortBehandlingForm>;
    className?: string;
};

export const MeldekortUker = ({ dager, formContext, className }: Props) => {
    return (
        <VStack gap={'1'} className={className}>
            <MeldekortUke dager={dager.slice(0, 7)} ukeIndex={0} formContext={formContext} />
            <MeldekortUke dager={dager.slice(7, 14)} ukeIndex={1} formContext={formContext} />
        </VStack>
    );
};
