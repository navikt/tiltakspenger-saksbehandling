import { Accordion, Alert, BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import {
    PosteringerForDag,
    PosteringForDag,
    Simulering,
    SimuleringEndring,
    SimuleringIngenEndring,
    SimuleringMeldeperiode,
    Simuleringsdag,
} from '../../../types/Simulering';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { erSimuleringEndring } from '../../../utils/simuleringUtils';
import { useState } from 'react';

const OppsummeringAvSimulering = (props: { simulering: Simulering }) => {
    const erFeilutbetalingStørreEnn0 =
        erSimuleringEndring(props.simulering) && props.simulering.totalFeilutbetaling > 0;

    return (
        <VStack gap="6">
            {erFeilutbetalingStørreEnn0 && (
                <Alert variant={'warning'} size="small">
                    Denne behandlingen vil føre til feilutbetaling eller trekk for bruker.
                    Saksbehandler bør se nøye over simuleringen for å vurdere konsekvensen for
                    bruker og i noen tilfeller må man opprette en JIRA-sak hos Økonomi slik at de
                    får endret utbetalingen til ønsket resultat.
                </Alert>
            )}
            {props.simulering.type === 'IngenEndring' && (
                <OppsummeringAvSimuleringIngenEndring simulering={props.simulering} />
            )}
            {props.simulering.type === 'Endring' && (
                <OppsummeringAvSimuleringEndring simulering={props.simulering} />
            )}
        </VStack>
    );
};

export default OppsummeringAvSimulering;

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const OppsummeringAvSimuleringIngenEndring = (props: { simulering: SimuleringIngenEndring }) => {
    return (
        <div>
            <BodyShort>Simuleringen har ført til ingen endring</BodyShort>
        </div>
    );
};

const OppsummeringAvSimuleringEndring = (props: { simulering: SimuleringEndring }) => {
    return (
        <div>
            <VStack gap="6">
                <VStack gap="2">
                    <Heading level="4" size="small">
                        Oppsummering av simulering
                    </Heading>
                    <OppsummeringsPar
                        label={'Dato beregnet'}
                        verdi={props.simulering.datoberegnet}
                    />
                    <OppsummeringsPar label={'Total beløp'} verdi={props.simulering.totalBeløp} />
                    <HStack gap="2">
                        <OppsummeringsPar
                            label={'Tidligere utbetalt'}
                            verdi={props.simulering.tidligereUtbetalt}
                        />
                        <OppsummeringsPar
                            label={'Ny utbetaling'}
                            verdi={props.simulering.nyUtbetaling}
                        />
                    </HStack>
                    <HStack gap="2">
                        <OppsummeringsPar
                            label={'Total etterbetaling'}
                            verdi={props.simulering.totalEtterbetaling}
                        />
                        <OppsummeringsPar
                            label={'Total feilutbetaling'}
                            verdi={props.simulering.totalFeilutbetaling}
                        />
                    </HStack>
                </VStack>

                <VStack gap="6">
                    <Heading level="4" size="small">
                        Detaljer per meldeperiode
                    </Heading>
                    <OppsummeringAvSimuleringMeldeperiode
                        meldeperioder={props.simulering.perMeldeperiode}
                    />
                </VStack>
            </VStack>
        </div>
    );
};

const OppsummeringAvSimuleringMeldeperiode = (props: {
    meldeperioder: SimuleringMeldeperiode[];
}) => {
    return (
        <Accordion size="small">
            <ul>
                {props.meldeperioder.map((periode) => (
                    <li key={periode.meldeperiodeId}>
                        <Accordion.Item>
                            <Accordion.Header>{`${periode.meldeperiodeKjedeId}`}</Accordion.Header>
                            <Accordion.Content>
                                <ul>
                                    {periode.simuleringsdager.map((dag) => (
                                        <li key={dag.dato}>
                                            <OppsummeringAvSimuleringsdag dag={dag} />
                                        </li>
                                    ))}
                                </ul>
                            </Accordion.Content>
                        </Accordion.Item>
                    </li>
                ))}
            </ul>
        </Accordion>
    );
};

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

const OppsummeringAvPosteringerForDag = (props: { posteringer: PosteringerForDag }) => {
    return (
        <div>
            <OppsummeringsPar label={'Dato'} verdi={props.posteringer.dato} />
            <ul>
                {props.posteringer.posteringer.map((postering) => (
                    <li key={postering.dato}>
                        <OppsummeringAvPosteringForDag postering={postering} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

const OppsummeringAvPosteringForDag = (props: { postering: PosteringForDag }) => {
    return (
        <div>
            <OppsummeringsPar label={'Dato'} verdi={props.postering.dato} />
            <OppsummeringsPar label={'Fagområde'} verdi={props.postering.fagområde} />
            <OppsummeringsPar label={'Klassekode'} verdi={props.postering.klassekode} />
            <OppsummeringsPar label={'Type'} verdi={props.postering.type} />
            <OppsummeringsPar label={'Beløp'} verdi={props.postering.beløp} />
        </div>
    );
};
