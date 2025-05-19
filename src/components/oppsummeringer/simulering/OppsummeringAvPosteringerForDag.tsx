import { PosteringerForDag } from '../../../types/Simulering';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';
import OppsummeringAvPosteringForDag from './OppsummeringAvPosteringForDag';

const OppsummeringAvPosteringerForDag = (props: { posteringer: PosteringerForDag }) => {
    return (
        <div>
            <OppsummeringsPar label={'Dato'} verdi={props.posteringer.dato} />
            <ul>
                {props.posteringer.posteringer.map((postering) => (
                    <li key={postering.dato}>
                        <OppsummeringAvPosteringForDag postering={postering} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OppsummeringAvPosteringerForDag;
