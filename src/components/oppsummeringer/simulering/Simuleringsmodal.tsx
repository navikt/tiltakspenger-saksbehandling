import { useState } from 'react';
import { Simulering } from '../../../types/Simulering';
import { Button, Heading, Modal } from '@navikt/ds-react';

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import styles from './Simuleringsmodal.module.css';
import { erSimuleringEndring } from '../../../utils/simuleringUtils';
import OppsummeringAvSimulering from './OppsummeringAvSimulering';

const Simuleringsmodal = (props: { simulering: Simulering }) => {
    const [vilSeDetaljer, setVilSeDetaljer] = useState(false);

    const erFeilutbetalingStørreEnn0 =
        erSimuleringEndring(props.simulering) && props.simulering.totalFeilutbetaling > 0;

    return (
        <div>
            <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => setVilSeDetaljer(true)}
                className={styles.seSimuleringKnapp}
            >
                Se simulering
                {erFeilutbetalingStørreEnn0 && (
                    <ExclamationmarkTriangleFillIcon
                        className={styles.advarselIkon}
                        title="Advarsel ikon"
                        fontSize="1rem"
                    />
                )}
            </Button>
            {vilSeDetaljer && (
                <Modal
                    aria-label="Simuleringsdetaljer"
                    open={vilSeDetaljer}
                    onClose={() => setVilSeDetaljer(false)}
                    width={600}
                >
                    <Modal.Header>
                        <Heading spacing level="4" size="medium">
                            Simulering
                        </Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <OppsummeringAvSimulering simulering={props.simulering} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setVilSeDetaljer(false)}>
                            Lukk
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Simuleringsmodal;
