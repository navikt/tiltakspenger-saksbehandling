import { PosteringForDag } from '../../../types/Simulering';
import { OppsummeringsPar } from '../oppsummeringspar/OppsummeringsPar';

const OppsummeringAvPosteringForDag = (props: { postering: PosteringForDag }) => {
    return (
        <div>
            <OppsummeringsPar label={'Dato'} verdi={props.postering.dato} />
            <OppsummeringsPar label={'Fagområde'} verdi={props.postering.fagområde} />
            <OppsummeringsPar label={'Klassekode'} verdi={props.postering.klassekode} />
            <OppsummeringsPar label={'Type'} verdi={props.postering.type} />
            <OppsummeringsPar label={'Beløp'} verdi={props.postering.beløp} />
        </div>
    );
};

export default OppsummeringAvPosteringForDag;
