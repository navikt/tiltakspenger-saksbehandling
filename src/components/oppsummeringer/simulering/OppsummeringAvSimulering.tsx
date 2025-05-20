import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { Simulering, SimuleringEndring, SimuleringIngenEndring } from '../../../types/Simulering';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import { erSimuleringEndring } from '../../../utils/simuleringUtils';
import OppsummeringAvSimuleringMeldeperiode from './simuleringMeldeperiode/OppsummeringAvSimuleringMeldeperiode';
import { formaterDatotekst } from '../../../utils/date';

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
            <VStack gap="12">
                <VStack gap="2">
                    <Heading level="4" size="small">
                        Oppsummering av simulering
                    </Heading>
                    <OppsummeringsPar
                        label={'Dato beregnet'}
                        verdi={formaterDatotekst(props.simulering.datoBeregnet)}
                        variant="inlineColon"
                    />
                    <OppsummeringsPar
                        label={'Total beløp'}
                        variant="inlineColon"
                        verdi={props.simulering.totalBeløp}
                    />

                    <HStack gap="3">
                        <OppsummeringsPar
                            label={'Tidligere utbetalt'}
                            variant="inlineColon"
                            verdi={props.simulering.tidligereUtbetalt}
                        />
                        <OppsummeringsPar
                            label={'Ny utbetaling'}
                            variant="inlineColon"
                            verdi={props.simulering.nyUtbetaling}
                        />
                        <OppsummeringsPar
                            label={'Etterbetaling'}
                            variant="inlineColon"
                            verdi={props.simulering.totalEtterbetaling}
                        />
                        <OppsummeringsPar
                            label={'Feilutbetaling'}
                            variant="inlineColon"
                            verdi={props.simulering.totalFeilutbetaling}
                        />
                    </HStack>
                </VStack>
                <VStack gap="2">
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
