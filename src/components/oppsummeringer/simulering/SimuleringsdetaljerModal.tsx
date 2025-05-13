import { useState } from 'react';
import { Simuleringsdetaljer } from '../../../types/Simulering';
import { Button, Heading, Modal } from '@navikt/ds-react';
import OppsummeringAvSimuleringsdetaljer from './OppsummeringAvSimuleringsdetaljer';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import styles from './SimuleringsdetaljerModal.module.css';
const SimuleringsdetaljerModal = (props: { simuleringsdetaljer: Simuleringsdetaljer }) => {
    const [vilSeDetaljer, setVilSeDetaljer] = useState(false);

    const erFeilutbetalingStørreEnn0 =
        props.simuleringsdetaljer.oppsummeringForPerioder.reduce(
            (akk, periode) => (akk += periode.totalFeilutbetaling),
            0,
        ) > 0;
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
                        <OppsummeringAvSimuleringsdetaljer
                            simuleringsdetaljer={props.simuleringsdetaljer}
                        />
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

export default SimuleringsdetaljerModal;
