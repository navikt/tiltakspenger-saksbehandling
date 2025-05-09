import { Accordion, Box, Heading, VStack } from '@navikt/ds-react';
import { formaterDatotekst } from '../../../utils/date';
import { Simuleringsdetaljer } from '../../../types/Simulering';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import styles from './OppsummeringAvSimuleringsdetaljer.module.css';

const OppsummeringAvSimuleringsdetaljer = (props: { simuleringsdetaljer: Simuleringsdetaljer }) => {
    return (
        <VStack gap="6">
            <Box background="surface-neutral-subtle" padding="4">
                <Heading level="4" size="small">
                    Grunnleggende perioder
                </Heading>
                <Accordion size="small">
                    {props.simuleringsdetaljer.oppsummeringForPerioder.map((periode) => (
                        <Accordion.Item
                            key={`grunnleggende-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}`}
                        >
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
                    ))}
                </Accordion>
            </Box>

            <Box background="surface-neutral-subtle" padding="4">
                <Heading level="4" size="small">
                    Detaljerte perioder
                </Heading>
                <div className={styles.detaljeInfo}>
                    <OppsummeringsPar
                        label={'Dato beregnet'}
                        verdi={formaterDatotekst(props.simuleringsdetaljer.detaljer.datoBeregnet)}
                    />
                    <OppsummeringsPar
                        label={'Total beløp'}
                        verdi={props.simuleringsdetaljer.detaljer.totalBeløp}
                    />
                </div>
                <Accordion size="small">
                    {props.simuleringsdetaljer.detaljer.perioder.map((periode) => (
                        <Accordion.Item
                            key={`detaljert-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}`}
                        >
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
                    ))}
                </Accordion>
            </Box>
        </VStack>
    );
};

export default OppsummeringAvSimuleringsdetaljer;
