import { VentestatusHendelse } from '~/types/Ventestatus';
import OppsummeringAvVentestatus from './OppsummeringAvVentestatus';
import { Button, Heading, Modal } from '@navikt/ds-react';
import { useState } from 'react';
import { Separator } from '~/lib/_felles/separator/Separator';
import styles from './OppsummeringAvVentestatuser.module.css';

export const OppsummeringAvVentestatuserModal = (props: {
    ventestatuser: VentestatusHendelse[];
}) => {
    const [åpen, setÅpen] = useState(false);
    return (
        <div>
            <Button type="button" size="small" variant="secondary" onClick={() => setÅpen(true)}>
                Se ventestatus-historikk
            </Button>
            <Modal
                open={åpen}
                onClose={() => setÅpen(false)}
                aria-label="Ventestatus-historikk"
                width={'medium'}
            >
                <Modal.Header>
                    <Heading size="medium" level="2">
                        Ventestatus-historikk
                    </Heading>
                </Modal.Header>
                <Modal.Body>
                    <OppsummeringAvVentestatuser ventestatuser={props.ventestatuser} />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="secondary" onClick={() => setÅpen(false)}>
                        Lukk
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const OppsummeringAvVentestatuser = (props: { ventestatuser: VentestatusHendelse[] }) => {
    return (
        <ul className={styles['ventestatuser-container']}>
            {props.ventestatuser.map((ventestatus, index) => (
                <ol key={`ventestatus-${index}`}>
                    <OppsummeringAvVentestatus ventestatus={ventestatus} size="small" />
                    <Separator />
                </ol>
            ))}
        </ul>
    );
};

export default OppsummeringAvVentestatuser;
