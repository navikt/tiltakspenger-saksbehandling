import styles from './meldekort.module.css';
import {MeldekortUke} from "./MeldekortUke";

export const MeldekortAccordions = () => {
    return(
        <div className={styles.ukevisning}>
            <div className={styles.uke1}>
                <MeldekortUke ukesnummer={1} fom={1} tom={7}></MeldekortUke>
            </div>
            <div className={styles.uke2}>
                <MeldekortUke ukesnummer={2} fom={8} tom={14}></MeldekortUke>
            </div>
        </div>
    )
}
