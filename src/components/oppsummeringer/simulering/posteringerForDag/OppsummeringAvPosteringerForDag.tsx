import { PosteringerForDag } from '../../../../types/Simulering';
import { formaterDatotekst } from '../../../../utils/date';
import { OppsummeringsPar } from '../../oppsummeringspar/OppsummeringsPar';
import OppsummeringAvPosteringForDag from '../posteringForDag/OppsummeringAvPosteringForDag';

import styles from './OppsummeringAvPosteringerForDag.module.css';

const OppsummeringAvPosteringerForDag = (props: {
    posteringer: PosteringerForDag;
    visDato?: boolean;
}) => {
    return (
        <div>
            {props.visDato && (
                <OppsummeringsPar
                    label={'Dato'}
                    verdi={formaterDatotekst(props.posteringer.dato)}
                />
            )}
            <ul className={styles.posteringer}>
                {props.posteringer.posteringer.map((postering) => (
                    <li key={`posteringer-for-dag-${postering.dato}`}>
                        <OppsummeringAvPosteringForDag postering={postering} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OppsummeringAvPosteringerForDag;
