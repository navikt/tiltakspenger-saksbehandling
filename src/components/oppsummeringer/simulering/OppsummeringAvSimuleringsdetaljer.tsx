import { Accordion, Alert, Box, Heading, VStack } from '@navikt/ds-react';
import { formaterDatotekst } from '../../../utils/date';
import { Simuleringsdetaljer } from '../../../types/Simulering';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import styles from './OppsummeringAvSimuleringsdetaljer.module.css';

const OppsummeringAvSimuleringsdetaljer = (props: { simuleringsdetaljer: Simuleringsdetaljer }) => {
    const erFeilutbetalingStørreEnn0 =
        props.simuleringsdetaljer.oppsummeringForPerioder.reduce(
            (akk, periode) => (akk += periode.totalFeilutbetaling),
            0,
        ) > 0;

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
            <VStack gap="6">
                <Box background="surface-neutral-subtle" padding="4">
                    <Heading level="4" size="small">
                        Grunnleggende perioder
                    </Heading>
                    <Accordion size="small">
                        <ul>
                            {props.simuleringsdetaljer.oppsummeringForPerioder.map((periode) => (
                                <li
                                    key={`grunnleggende-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}`}
                                >
                                    <Accordion.Item>
                                        <Accordion.Header>
                                            {`${formaterDatotekst(periode.periode.fraOgMed)} - ${formaterDatotekst(periode.periode.tilOgMed)}`}
                                        </Accordion.Header>
                                        <Accordion.Content className={styles.accordionContent}>
                                            <OppsummeringsPar
                                                label={'Tidligere utbetalt'}
                                                verdi={periode.tidligereUtbetalt}
                                            />
                                            <OppsummeringsPar
                                                label={'Ny utbetaling'}
                                                verdi={periode.nyUtbetaling}
                                            />
                                            <OppsummeringsPar
                                                label={'Total etterbetaling'}
                                                verdi={periode.totalEtterbetaling}
                                            />
                                            <OppsummeringsPar
                                                label={'Total feilutbetaling'}
                                                verdi={periode.totalFeilutbetaling}
                                            />
                                        </Accordion.Content>
                                    </Accordion.Item>
                                </li>
                            ))}
                        </ul>
                    </Accordion>
                </Box>

                <Box background="surface-neutral-subtle" padding="4">
                    <Heading level="4" size="small">
                        Detaljerte perioder
                    </Heading>
                    <div className={styles.detaljeInfo}>
                        <OppsummeringsPar
                            label={'Dato beregnet'}
                            verdi={formaterDatotekst(
                                props.simuleringsdetaljer.detaljer.datoBeregnet,
                            )}
                        />
                        <OppsummeringsPar
                            label={'Total beløp'}
                            verdi={props.simuleringsdetaljer.detaljer.totalBeløp}
                        />
                    </div>
                    <Accordion size="small">
                        <ul>
                            {props.simuleringsdetaljer.detaljer.perioder.map((periode) => (
                                <li
                                    key={`detaljert-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}`}
                                >
                                    <Accordion.Item>
                                        <Accordion.Header>
                                            {`${formaterDatotekst(periode.periode.fraOgMed)} - ${formaterDatotekst(periode.periode.tilOgMed)}`}
                                        </Accordion.Header>
                                        <Accordion.Content className={styles.accordionContent}>
                                            <ul>
                                                {periode.delperiode.map((delperiode) => (
                                                    <li
                                                        key={`delperiode-${delperiode.periode.fraOgMed}-${delperiode.periode.tilOgMed}`}
                                                    >
                                                        <OppsummeringsPar
                                                            label={'Type'}
                                                            verdi={delperiode.type}
                                                        />
                                                        <OppsummeringsPar
                                                            label={'Klassekode'}
                                                            verdi={delperiode.klassekode}
                                                        />
                                                        <OppsummeringsPar
                                                            label={'Fagområde'}
                                                            verdi={delperiode.fagområde}
                                                        />

                                                        <OppsummeringsPar
                                                            label={'Beløp'}
                                                            verdi={delperiode.beløp}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </Accordion.Content>
                                    </Accordion.Item>
                                </li>
                            ))}
                        </ul>
                    </Accordion>
                </Box>
            </VStack>
        </VStack>
    );
};

export default OppsummeringAvSimuleringsdetaljer;
