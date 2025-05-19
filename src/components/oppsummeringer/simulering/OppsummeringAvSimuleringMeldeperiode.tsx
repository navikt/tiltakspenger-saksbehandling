import { Accordion } from '@navikt/ds-react';
import { SimuleringMeldeperiode } from '../../../types/Simulering';
import OppsummeringAvSimuleringsdag from './OppsummeringAvSimuleringsdag';

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

export default OppsummeringAvSimuleringMeldeperiode;
