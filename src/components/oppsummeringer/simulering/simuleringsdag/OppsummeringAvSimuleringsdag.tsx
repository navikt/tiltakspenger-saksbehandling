import { HStack, ReadMore, VStack } from '@navikt/ds-react';
import { OppsummeringsPar } from '../../oppsummeringspar/OppsummeringsPar';
import { Simuleringsdag } from '../../../../types/Simulering';
import OppsummeringAvPosteringerForDag from '../posteringerForDag/OppsummeringAvPosteringerForDag';
import { formaterDatotekst } from '../../../../utils/date';

const OppsummeringAvSimuleringsdag = (props: { dag: Simuleringsdag }) => {
    return (
        <VStack gap="2">
            <VStack gap="2">
                <OppsummeringsPar
                    label={'Dato'}
                    variant="inlineColon"
                    verdi={formaterDatotekst(props.dag.dato)}
                />
                <HStack gap="3">
                    <OppsummeringsPar
                        label={'Tidligere utbetalt'}
                        variant="inlineColon"
                        verdi={props.dag.tidligereUtbetalt}
                    />
                    <OppsummeringsPar
                        label={'Ny utbetaling'}
                        variant="inlineColon"
                        verdi={props.dag.nyUtbetaling}
                    />
                    <OppsummeringsPar
                        label={'Etterbetaling'}
                        variant="inlineColon"
                        verdi={props.dag.totalEtterbetaling}
                    />
                    <OppsummeringsPar
                        label={'Feilutbetaling'}
                        variant="inlineColon"
                        verdi={props.dag.totalFeilutbetaling}
                    />
                </HStack>
            </VStack>
            <VStack gap="2">
                <ReadMore header="Vis posteringer">
                    <OppsummeringAvPosteringerForDag posteringer={props.dag.posteringsdag} />
                </ReadMore>
            </VStack>
        </VStack>
    );
};

export default OppsummeringAvSimuleringsdag;
