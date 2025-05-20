import { Accordion } from '@navikt/ds-react';
import { SimuleringMeldeperiode } from '../../../../types/Simulering';
import OppsummeringAvSimuleringsdag from '../simuleringsdag/OppsummeringAvSimuleringsdag';
import { formaterDatotekst } from '../../../../utils/date';
import styles from './OppsummeringAvSimuleringMeldeperiode.module.css';

const OppsummeringAvSimuleringMeldeperiode = (props: {
    meldeperioder: SimuleringMeldeperiode[];
}) => {
    return (
        <Accordion size="small">
            <ul>
                {props.meldeperioder.map((periode) => (
                    <li key={periode.meldeperiodeId}>
                        <Accordion.Item>
                            <Accordion.Header>
                                {`${formaterDatotekst(periode.periode.fraOgMed)} - ${formaterDatotekst(periode.periode.tilOgMed)}`}
                            </Accordion.Header>
                            <Accordion.Content>
                                <ul className={styles.simuleringsdager}>
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

export default OppsummeringAvSimuleringMeldeperiode;
