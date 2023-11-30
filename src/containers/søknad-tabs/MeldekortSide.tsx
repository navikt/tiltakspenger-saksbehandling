import styles from './meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-side/MeldekortBeregningsVisning';
import {PencilWritingIcon} from "@navikt/aksel-icons";
import {Button} from "@navikt/ds-react";
import React, {useState} from "react";

interface MeldekortSideProps extends React.PropsWithChildren {
    title?: string;
}

export const MeldekortSide = ({}: MeldekortSideProps) => {
    const [ disableUkeVisning, setDisableUkeVisning] = useState<boolean>(false);

    const godkjennMeldekort = () => {
        setDisableUkeVisning(true);
    }

    return (
        <>
            <div className={ disableUkeVisning ? styles.disableUkevisning : styles.ukevisning }>
                <div className={styles.uke1}>
                    <MeldekortUke ukesnummer={1} fom={1} tom={7}></MeldekortUke>
                </div>
                <div className={styles.uke2}>
                    <MeldekortUke ukesnummer={2} fom={8} tom={14}></MeldekortUke>
                </div>
            </div>
            <MeldekortBeregningsvisning />
            <div style={{ marginTop: '2rem', justifyItems: 'center', alignItems: 'center'}}>
                <Button icon={<PencilWritingIcon />} variant="tertiary" size="small" onClick={()=> setDisableUkeVisning(false)}>
                    Endre meldekortperiode
                </Button>
                <Button size="small" style={{ marginLeft: '2rem'}} onClick={godkjennMeldekort}>
                    Godkjenn meldekortperiode
                </Button>
            </div>
        </>
    );
};
