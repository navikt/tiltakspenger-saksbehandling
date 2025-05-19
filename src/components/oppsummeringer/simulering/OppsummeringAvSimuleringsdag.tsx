import { Button, HStack, VStack } from '@navikt/ds-react';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { useState } from 'react';
import { Simuleringsdag } from '../../../types/Simulering';
import OppsummeringAvPosteringerForDag from './OppsummeringAvPosteringerForDag';

const OppsummeringAvSimuleringsdag = (props: { dag: Simuleringsdag }) => {
    const [vilSePosteringer, setVilSePosteringer] = useState(false);

    return (
        <VStack gap="2">
            <OppsummeringsPar label={'Dato'} verdi={props.dag.dato} />
            <HStack gap="2">
                <OppsummeringsPar
                    label={'Tidligere utbetalt'}
                    verdi={props.dag.tidligereUtbetalt}
                />
                <OppsummeringsPar label={'Ny utbetaling'} verdi={props.dag.nyUtbetaling} />
            </HStack>
            <HStack gap="2">
                <OppsummeringsPar
                    label={'Total etterbetaling'}
                    verdi={props.dag.totalEtterbetaling}
                />
                <OppsummeringsPar
                    label={'Total feilutbetaling'}
                    verdi={props.dag.totalFeilutbetaling}
                />
            </HStack>

            <VStack gap="2">
                <Button
                    type="button"
                    variant="secondary"
                    size="xsmall"
                    onClick={() => setVilSePosteringer(!vilSePosteringer)}
                >
                    {vilSePosteringer ? 'Skjul posteringer' : 'Vis posteringer'}
                </Button>
                {vilSePosteringer && (
                    <VStack gap="1">
                        <OppsummeringAvPosteringerForDag posteringer={props.dag.posteringsdag} />
                    </VStack>
                )}
            </VStack>
        </VStack>
    );
};

export default OppsummeringAvSimuleringsdag;
